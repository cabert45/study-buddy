import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import pg from 'pg';
import Anthropic from '@anthropic-ai/sdk';
import webpush from 'web-push';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Database setup with PostgreSQL ---
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        mode TEXT NOT NULL,
        total INTEGER NOT NULL,
        correct INTEGER NOT NULL,
        details TEXT
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS category_stats (
        category TEXT PRIMARY KEY,
        correct INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    // Push subscriptions
    await client.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        profile TEXT NOT NULL,
        endpoint TEXT NOT NULL UNIQUE,
        keys JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // --- Migrations: add profile column for multi-user support ---
    await client.query(`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS profile TEXT NOT NULL DEFAULT 'ryan'`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_profile ON sessions(profile, id DESC)`);

    // category_stats: rebuild with composite key (profile, category)
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name='category_stats' AND column_name='profile'
    `);
    if (colCheck.rows.length === 0) {
      await client.query(`ALTER TABLE category_stats ADD COLUMN profile TEXT NOT NULL DEFAULT 'ryan'`);
      // Drop old single-column PK and create composite PK
      try {
        await client.query(`ALTER TABLE category_stats DROP CONSTRAINT IF EXISTS category_stats_pkey`);
        await client.query(`ALTER TABLE category_stats ADD PRIMARY KEY (profile, category)`);
      } catch (e) {
        console.log('PK migration note:', e.message);
      }
    }

    // Mode invité (/laval): compteur anonyme par appareil. Aucun nom, aucune IP,
    // aucun navigateur enregistré — seulement l'identifiant aléatoire invite-xxxx.
    await client.query(`
      CREATE TABLE IF NOT EXISTS guest_visits (
        guest_id TEXT NOT NULL,
        date TEXT NOT NULL,
        event TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 1,
        first_at TIMESTAMP DEFAULT NOW(),
        last_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (guest_id, date, event)
      )
    `);

    console.log('Database tables ready');
  } finally {
    client.release();
  }
}

async function queryAll(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

async function queryOne(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows[0] || null;
}

// --- Anthropic client ---
let anthropic = null;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// --- Web Push setup (VAPID) ---
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || 'BCmP7UjMuEF6PihKVS71fj326YH6XOORXB5xtUhoctoMfsboJQs05s2UNq6R7AW4a3qDtm6CRE5SGcoEu8woIak';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || 'qMZ1lSnAZqeZ2GHoQGrgpymlH_ocKBVBLvsIKTPx-iQ';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:cbernard@cleaneroffices.ca';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

// --- Push Notification Routes ---
app.get('/api/push/vapid-key', (req, res) => {
  res.json({ key: VAPID_PUBLIC });
});

app.post('/api/push/subscribe', async (req, res) => {
  try {
    const { profile, subscription } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }
    await pool.query(`
      INSERT INTO push_subscriptions (profile, endpoint, keys)
      VALUES ($1, $2, $3)
      ON CONFLICT (endpoint) DO UPDATE SET profile = $1, keys = $3
    `, [profile || 'ryan', subscription.endpoint, JSON.stringify(subscription.keys)]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/push/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/push/send', async (req, res) => {
  try {
    const { profile, title, body, url } = req.body;
    const profileFilter = profile && profile !== 'all';
    const subs = profileFilter
      ? await queryAll('SELECT * FROM push_subscriptions WHERE profile = $1', [profile])
      : await queryAll('SELECT * FROM push_subscriptions');

    const payload = JSON.stringify({ title: title || 'Study Buddy', body: body || '', url: url || '/' });
    let sent = 0, failed = 0;
    for (const s of subs) {
      try {
        await webpush.sendNotification({
          endpoint: s.endpoint,
          keys: typeof s.keys === 'string' ? JSON.parse(s.keys) : s.keys,
        }, payload);
        sent++;
      } catch (err) {
        failed++;
        // Drop dead subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [s.endpoint]);
        }
      }
    }
    res.json({ ok: true, sent, failed, total: subs.length });
  } catch (err) {
    console.error('Push send error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- API Routes ---

app.get('/api/progress', async (req, res) => {
  try {
    const profile = req.query.profile || 'ryan';
    const stats = await queryAll('SELECT * FROM category_stats WHERE profile = $1', [profile]);
    const sessions = await queryAll('SELECT * FROM sessions WHERE profile = $1 ORDER BY id DESC LIMIT 10', [profile]);
    const totals = await queryOne('SELECT COALESCE(SUM(correct),0) as correct, COALESCE(SUM(total),0) as total FROM category_stats WHERE profile = $1', [profile]);
    const daily = await queryAll(`
      SELECT date, SUM(correct) as correct, SUM(total) as total
      FROM sessions WHERE profile = $1 GROUP BY date ORDER BY date DESC LIMIT 7
    `, [profile]);
    res.json({ stats, sessions, totals, daily: daily.reverse() });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/session', async (req, res) => {
  try {
    const { mode, total, correct, details, profile } = req.body;
    const profileId = profile || 'ryan';
    const date = new Date().toISOString().split('T')[0];

    await pool.query(
      'INSERT INTO sessions (date, mode, total, correct, details, profile) VALUES ($1, $2, $3, $4, $5, $6)',
      [date, mode, total, correct, JSON.stringify(details), profileId]
    );

    if (details && Array.isArray(details)) {
      for (const d of details) {
        const correctVal = d.correct ? 1 : 0;
        await pool.query(`
          INSERT INTO category_stats (profile, category, correct, total)
          VALUES ($1, $2, $3, 1)
          ON CONFLICT (profile, category) DO UPDATE SET
            correct = category_stats.correct + $4,
            total = category_stats.total + 1
        `, [profileId, d.category, correctVal, correctVal]);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Session save error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Family overview — all profiles at once
app.get('/api/family', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const profiles = ['ryan', 'cayla', 'demo'];
    const result = {};

    for (const p of profiles) {
      const totals = await queryOne('SELECT COALESCE(SUM(correct),0) as correct, COALESCE(SUM(total),0) as total FROM category_stats WHERE profile = $1', [p]);
      const today = await queryOne('SELECT COALESCE(SUM(total),0) as total, COALESCE(SUM(correct),0) as correct FROM sessions WHERE profile = $1 AND date = (SELECT to_char(NOW() AT TIME ZONE \'America/Toronto\', \'YYYY-MM-DD\'))', [p]);
      const week = await queryOne('SELECT COALESCE(SUM(total),0) as total, COALESCE(SUM(correct),0) as correct FROM sessions WHERE profile = $1 AND date >= $2', [p, weekAgoStr]);
      const sessions = await queryAll('SELECT date, mode, total, correct FROM sessions WHERE profile = $1 ORDER BY id DESC LIMIT 5', [p]);
      const stats = await queryAll('SELECT * FROM category_stats WHERE profile = $1', [p]);

      // Find weakest category
      const weak = stats.filter(s => s.total >= 3).sort((a, b) => (a.correct/a.total) - (b.correct/b.total))[0];

      result[p] = {
        totalQuestions: parseInt(totals.total) || 0,
        totalCorrect: parseInt(totals.correct) || 0,
        todayQuestions: parseInt(today.total) || 0,
        todayCorrect: parseInt(today.correct) || 0,
        weekQuestions: parseInt(week.total) || 0,
        weekCorrect: parseInt(week.correct) || 0,
        recentSessions: sessions,
        weakestCategory: weak ? { category: weak.category, pct: Math.round((weak.correct/weak.total)*100) } : null,
      };
    }

    res.json(result);
  } catch (err) {
    console.error('Family overview error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// AI-generated sentence variation for dictée
app.post('/api/dictee/sentence', async (req, res) => {
  if (!anthropic) return res.json({ sentence: null });
  try {
    const { word, grade } = req.body;
    const ageDesc = grade === 'sec1' ? '12 ans (secondaire 1)' : grade === '6' ? '11 ans (6e année)' : '7 ans (2e année)';
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 80,
      system: `Tu crées des phrases courtes en français pour enfants de ${ageDesc} au Québec.
La phrase doit contenir le mot demandé et avoir du sens.
Maximum 10 mots. Retourne UNIQUEMENT la phrase, pas d'explication.
Remplace le mot par "_____" dans ta réponse.`,
      messages: [{
        role: 'user',
        content: `Crée une phrase qui utilise le mot "${word}". Format: phrase avec _____ à la place du mot.`,
      }],
    });
    const text = response.content[0]?.text?.trim() || '';
    res.json({ sentence: text });
  } catch (err) {
    console.error('AI sentence error:', err);
    res.json({ sentence: null });
  }
});

// Leaderboard — compare all profiles
app.get('/api/leaderboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const allTime = await queryAll(`
      SELECT profile,
        COALESCE(SUM(total), 0) as total_questions,
        COALESCE(SUM(correct), 0) as total_correct,
        COUNT(*) as session_count,
        MAX(id) as last_id
      FROM sessions GROUP BY profile
    `);

    const todayStats = await queryAll(`
      SELECT profile,
        COALESCE(SUM(total), 0) as today_questions,
        COALESCE(SUM(correct), 0) as today_correct
      FROM sessions WHERE date = $1 GROUP BY profile
    `, [today]);

    const weekStats = await queryAll(`
      SELECT profile,
        COALESCE(SUM(total), 0) as week_questions,
        COALESCE(SUM(correct), 0) as week_correct
      FROM sessions WHERE date >= $1 GROUP BY profile
    `, [weekStartStr]);

    res.json({ allTime, today: todayStats, week: weekStats });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const profile = req.query.profile || 'ryan';
    const stats = await queryAll('SELECT * FROM category_stats WHERE profile = $1', [profile]);
    const sessions = await queryAll('SELECT * FROM sessions WHERE profile = $1 ORDER BY id DESC LIMIT 30', [profile]);
    const totals = await queryOne('SELECT COALESCE(SUM(correct),0) as correct, COALESCE(SUM(total),0) as total FROM category_stats WHERE profile = $1', [profile]);
    const sessionCount = await queryOne('SELECT COUNT(*) as count FROM sessions WHERE profile = $1', [profile]);
    const daily = await queryAll(`
      SELECT date, SUM(correct) as correct, SUM(total) as total
      FROM sessions WHERE profile = $1 GROUP BY date ORDER BY date DESC LIMIT 14
    `, [profile]);
    res.json({ stats, sessions, totals, sessionCount: parseInt(sessionCount?.count) || 0, daily: daily.reverse() });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/dashboard/advice', async (req, res) => {
  if (!anthropic) {
    return res.json({ message: "Configurez la cle API Anthropic pour obtenir des conseils." });
  }
  try {
    const profile = req.query.profile || 'ryan';
    const stats = await queryAll('SELECT * FROM category_stats WHERE profile = $1', [profile]);
    const recentSessions = await queryAll('SELECT * FROM sessions WHERE profile = $1 ORDER BY id DESC LIMIT 5', [profile]);
    const recentDetails = recentSessions.map(s => {
      let details = [];
      try { details = JSON.parse(s.details || '[]'); } catch {}
      return { date: s.date, mode: s.mode, score: `${s.correct}/${s.total}`, details };
    });

    const prompt = `Voici les stats de Ryan (7 ans, 2e annee Quebec):

Statistiques par categorie:
${stats.map(s => `- ${s.category}: ${s.correct}/${s.total} (${s.total > 0 ? Math.round(s.correct/s.total*100) : 0}%)`).join('\n')}

5 dernieres sessions:
${JSON.stringify(recentDetails, null, 2)}

Donne-moi:
1. Ses points forts
2. Ses difficultes actuelles (avec exemples concrets des erreurs)
3. Ce qu'il devrait pratiquer en priorite cette semaine
4. Des conseils pour l'aider a la maison`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `Tu es un tuteur de mathematiques expert pour enfants au Quebec. Tu parles au PARENT de Ryan, pas a Ryan. Sois precis, actionnable et encourageant. Utilise des emojis. Reponds en francais.`,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ message: response.content[0].text });
  } catch (err) {
    console.error('Advice API error:', err);
    res.json({ message: "Erreur lors de la generation des conseils. Reessayez plus tard." });
  }
});

// ===== « Mes blocs » — état de la fondation de 2e année =====
// Stocké dans la table settings existante (clé blocs_<profil>): aucun changement
// de schéma, donc aucun risque pour les données de sessions.
app.get('/api/blocs', async (req, res) => {
  try {
    const profile = req.query.profile || 'ryan';
    const r = await pool.query('SELECT value FROM settings WHERE key = $1', [`blocs_${profile}`]);
    res.json(r.rows[0] ? JSON.parse(r.rows[0].value) : {});
  } catch (e) {
    console.error('GET /api/blocs', e.message);
    res.json({});
  }
});

app.post('/api/blocs', async (req, res) => {
  try {
    const { profile = 'ryan', blocs } = req.body || {};
    if (!blocs || typeof blocs !== 'object') return res.status(400).json({ error: 'blocs manquant' });
    await pool.query(
      `INSERT INTO settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [`blocs_${profile}`, JSON.stringify(blocs)]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('POST /api/blocs', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/reset', async (req, res) => {
  try {
    const profile = req.body?.profile || 'ryan';
    await pool.query('DELETE FROM sessions WHERE profile = $1', [profile]);
    await pool.query('DELETE FROM category_stats WHERE profile = $1', [profile]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ---------------------------------------------------------------- Invités (/laval)
const GUEST_ID_RE = /^invite-[a-z0-9]{4,16}$/;
const GUEST_EVENTS = new Set(['open', 'module:univers_social', 'module:sciences_labo', 'module:verbes']);
const TODAY_SQL = `to_char(NOW() AT TIME ZONE 'America/Toronto', 'YYYY-MM-DD')`;

app.post('/api/guest/ping', async (req, res) => {
  try {
    const { id, event } = req.body || {};
    if (!GUEST_ID_RE.test(String(id || '')) || !GUEST_EVENTS.has(event)) return res.status(400).json({ ok: false });
    await pool.query(`
      INSERT INTO guest_visits (guest_id, date, event) VALUES ($1, ${TODAY_SQL}, $2)
      ON CONFLICT (guest_id, date, event) DO UPDATE SET count = guest_visits.count + 1, last_at = NOW()
    `, [id, event]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Guest ping error:', err);
    res.status(500).json({ ok: false });
  }
});

// Chiffres agrégés seulement (jamais les identifiants)
app.get('/api/guest/stats', async (req, res) => {
  try {
    const n = (r, k = 'n') => parseInt(r?.[k]) || 0;
    const weekAgo = `to_char((NOW() AT TIME ZONE 'America/Toronto') - INTERVAL '6 days', 'YYYY-MM-DD')`;
    const total = await queryOne(`SELECT COUNT(DISTINCT guest_id) AS n, COALESCE(SUM(count) FILTER (WHERE event='open'),0) AS visits, MIN(date) AS first FROM guest_visits`);
    const today = await queryOne(`SELECT COUNT(DISTINCT guest_id) AS n FROM guest_visits WHERE date = ${TODAY_SQL}`);
    const week = await queryOne(`SELECT COUNT(DISTINCT guest_id) AS n FROM guest_visits WHERE date >= ${weekAgo}`);
    const back = await queryOne(`SELECT COUNT(*) AS n FROM (SELECT guest_id FROM guest_visits GROUP BY guest_id HAVING COUNT(DISTINCT date) > 1) t`);
    const modules = await queryAll(`SELECT event, COUNT(DISTINCT guest_id) AS devices, SUM(count) AS opens FROM guest_visits WHERE event LIKE 'module:%' GROUP BY event`);
    const daily = await queryAll(`SELECT date, COUNT(DISTINCT guest_id) AS devices FROM guest_visits WHERE date >= to_char((NOW() AT TIME ZONE 'America/Toronto') - INTERVAL '13 days', 'YYYY-MM-DD') GROUP BY date ORDER BY date`);
    const sessions = await queryOne(`SELECT COUNT(*) AS n, COUNT(DISTINCT profile) AS devices, COALESCE(SUM(total),0) AS questions, COALESCE(SUM(correct),0) AS correct FROM sessions WHERE profile LIKE 'invite-%'`);
    // Heures (Montréal) — les horodatages sont en UTC (NOW() du serveur Neon)
    const LOCAL = (col) => `((${col} AT TIME ZONE 'UTC') AT TIME ZONE 'America/Toronto')`;
    const hourly = await queryAll(`
      SELECT EXTRACT(HOUR FROM ${LOCAL('f')})::int AS hour, COUNT(*) AS devices
      FROM (SELECT guest_id, MIN(first_at) AS f FROM guest_visits WHERE date = ${TODAY_SQL} GROUP BY guest_id) t
      GROUP BY 1 ORDER BY 1`);
    const sinceHour = Math.min(23, Math.max(0, parseInt(req.query.since, 10) || 0));
    const since = await queryOne(`
      SELECT
        COUNT(DISTINCT guest_id) FILTER (WHERE EXTRACT(HOUR FROM ${LOCAL('last_at')}) >= $1) AS active,
        (SELECT COUNT(*) FROM (SELECT guest_id FROM guest_visits WHERE date = ${TODAY_SQL} GROUP BY guest_id
           HAVING EXTRACT(HOUR FROM ${LOCAL('MIN(first_at)')}) >= $1) x) AS new
      FROM guest_visits WHERE date = ${TODAY_SQL}`, [sinceHour]);
    res.json({
      devices: n(total), visits: n(total, 'visits'), since: total?.first || null,
      today: n(today), week: n(week), returning: n(back),
      modules: Object.fromEntries(modules.map((m) => [m.event.replace('module:', ''), { devices: parseInt(m.devices) || 0, opens: parseInt(m.opens) || 0 }])),
      daily: daily.map((d) => ({ date: d.date, devices: parseInt(d.devices) || 0 })),
      sessions: { count: n(sessions), devices: n(sessions, 'devices'), questions: n(sessions, 'questions'), correct: n(sessions, 'correct') },
      hourlyToday: hourly.map((h) => ({ hour: h.hour, newDevices: parseInt(h.devices) || 0 })),
      sinceHourToday: { hour: sinceHour, activeDevices: n(since, 'active'), newDevices: n(since, 'new') },
    });
  } catch (err) {
    console.error('Guest stats error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Univers social (Cayla) — l'IA écrit de nouveaux textes à résumer et de
// nouvelles phrases à trou pour les mots qu'elle rate, pour qu'elle ne
// reconnaisse pas la question par cœur.
app.post('/api/univers-social/variantes', async (req, res) => {
  if (!anthropic) return res.json({ variantes: {} });
  try {
    const mots = (req.body.mots || []).slice(0, 8);
    if (!mots.length) return res.json({ variantes: {} });
    const liste = mots.map((m) => `- id: ${m.id} | mot: ${m.mot} | idée: ${m.cle}`).join('\n');
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      system: `Tu prépares des exercices de vocabulaire d'histoire (secondaire 1, Québec, Dossier « La sédentarisation », Néolithique).
Pour chaque mot, écris 2 courts textes (2 phrases, max 35 mots) qui DÉCRIVENT la situation sans jamais utiliser le mot ni sa racine, et 2 phrases à trou où le mot est remplacé par ___ (le mot ne doit apparaître nulle part dans la phrase).
Réponds UNIQUEMENT en JSON: {"variantes": {"<id>": {"textes": ["...","..."], "trous": ["...","..."]}}}`,
      messages: [{ role: 'user', content: `Mots:\n${liste}` }],
    });
    const text = response.content[0]?.text || '';
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = JSON.parse(json);
    // Sécurité: on retire toute variante où le mot apparaît quand même
    const out = {};
    for (const m of mots) {
      const v = parsed.variantes?.[m.id];
      if (!v) continue;
      const root = m.mot.toLowerCase().split(/[\s/]/)[0].slice(0, 5);
      const clean = (arr) => (arr || []).filter((t) => typeof t === 'string' && !t.toLowerCase().includes(root));
      out[m.id] = { textes: clean(v.textes), trous: clean(v.trous).filter((t) => t.includes('___')) };
    }
    res.json({ variantes: out });
  } catch (err) {
    console.error('Univers social variantes error:', err);
    res.json({ variantes: {} });
  }
});

app.post('/api/tutor', async (req, res) => {
  if (!anthropic) {
    return res.status(500).json({ error: 'Cle API Anthropic non configuree' });
  }
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: `Tu es le tuteur de math de Ryan, 7 ans, 2e année au Québec.
Réponds en 1-2 phrases MAXIMUM. Français simple. Sois encourageant avec des émojis.
Ne donne JAMAIS la réponse directement. Guide Ryan pour comprendre.
Quand il se trompe, explique avec des exemples concrets (billes, bonbons, doigts).`,
      messages: [{ role: 'user', content: req.body.prompt }],
    });
    res.json({ message: response.content[0].text });
  } catch (err) {
    console.error('Tutor API error:', err);
    res.json({ message: "Hmm, je n'ai pas pu reflechir cette fois. Reessaie! 🤔" });
  }
});

// --- Voix ElevenLabs -------------------------------------------------------
// La voix de l'appareil (Siri, Microsoft) lit mal le français: elle hache les
// mots de dictée et sonne robotique. ElevenLabs lit à sa place.
//
// La clé reste ICI, sur le serveur: l'app ne la voit jamais. Elle demande
// /api/tts?... et reçoit un MP3.
//
// Chaque clip est gardé sur le disque (data/tts-cache). Les mots reviennent
// sans arrêt — la même dictée, les mêmes encouragements du Coach, les mêmes
// consignes — donc on ne paie un mot qu'une seule fois, et à la 2e écoute le
// son part instantanément. L'app retombe sur la voix de l'appareil si le
// serveur ne répond pas: aucun écran ne devient muet.
const TTS_KEY = process.env.ELEVENLABS_API_KEY || '';
// flash_v2_5: ~2x moins cher et beaucoup plus rapide que multilingual_v2, pour
// un français très correct. Mettre ELEVENLABS_MODEL=eleven_multilingual_v2
// dans les variables d'environnement si on veut la qualité maximale.
const TTS_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_flash_v2_5';
const TTS_DEFAULT_VOICE = process.env.ELEVENLABS_VOICE_ID || '';
const TTS_DIR = path.join(__dirname, 'data', 'tts-cache');
const TTS_MAX_CHARS = 600;

fs.mkdirSync(TTS_DIR, { recursive: true });

// Est-ce que la voix premium est disponible? L'app le demande au démarrage.
app.get('/api/tts/status', (req, res) => {
  res.json({ enabled: !!TTS_KEY, defaultVoice: TTS_DEFAULT_VOICE, model: TTS_MODEL });
});

// Les voix proposées dans ⚙️ Réglages quand le compte ne peut pas être listé.
// La clé d'ElevenLabs est « scoped »: elle a le droit de faire parler, pas celui
// de lire la liste des voix du compte (401 sur /v1/voices). Plutôt que de laisser
// l'écran vide, on offre ces voix du catalogue commun, vérifiées en français.
const TTS_FALLBACK_VOICES = [
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'femme · douce · raconte bien' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', description: 'femme · claire · articule chaque mot' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'femme · chaleureuse · calme' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'femme · posée · lit lentement' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'femme · jeune · enjouée' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', description: 'femme · amicale · rassurante' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'homme · grave · tranquille' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', description: 'homme · net · sérieux' },
];

// Les voix du compte ElevenLabs, pour la liste de ⚙️ Réglages.
// Gardées 10 min en mémoire: la liste ne bouge presque jamais.
let voicesCache = { at: 0, list: null };
app.get('/api/tts/voices', async (req, res) => {
  if (!TTS_KEY) return res.json({ enabled: false, voices: [] });
  if (voicesCache.list && Date.now() - voicesCache.at < 10 * 60 * 1000) {
    return res.json({ enabled: true, voices: voicesCache.list });
  }
  try {
    const r = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': TTS_KEY },
    });
    if (!r.ok) throw new Error(`ElevenLabs ${r.status}`);
    const data = await r.json();
    const list = (data.voices || []).map((v) => ({
      id: v.voice_id,
      name: v.name,
      // « female · young · french »: ce qu'on montre sous le nom
      description: [v.labels?.gender, v.labels?.age, v.labels?.accent, v.labels?.use_case]
        .filter(Boolean).join(' · '),
      category: v.category,
    }));
    voicesCache = { at: Date.now(), list: list.length ? list : TTS_FALLBACK_VOICES };
    res.json({ enabled: true, voices: voicesCache.list });
  } catch (err) {
    // 401 = clé « scoped » sans le droit de lister. Ce n'est pas une panne: elle
    // peut toujours faire parler, donc on renvoie la liste de secours.
    console.error('ElevenLabs voices error:', err.message, '→ liste de secours');
    res.json({ enabled: true, voices: TTS_FALLBACK_VOICES, fallback: true });
  }
});

// Le MP3 d'une phrase. GET (et pas POST) exprès: l'URL devient la clé de cache
// du navigateur ET du service worker, donc un mot déjà entendu ne repasse même
// plus par le réseau.
app.get('/api/tts', async (req, res) => {
  if (!TTS_KEY) return res.status(503).json({ error: 'tts_disabled' });

  const text = String(req.query.text || '').slice(0, TTS_MAX_CHARS).trim();
  const voice = String(req.query.voice || TTS_DEFAULT_VOICE).trim();
  // Dictée: on demande à ElevenLabs de ralentir, plutôt que d'étirer le MP3
  // dans le navigateur, ce qui déforme la voix.
  const slow = req.query.slow === '1';
  if (!text) return res.status(400).json({ error: 'no_text' });
  if (!/^[A-Za-z0-9]{10,40}$/.test(voice)) return res.status(400).json({ error: 'no_voice' });

  const settings = slow
    ? { stability: 0.6, similarity_boost: 0.8, speed: 0.8 }
    : { stability: 0.5, similarity_boost: 0.75, speed: 1.0 };

  const key = crypto.createHash('sha1')
    .update([TTS_MODEL, voice, slow ? 'slow' : 'normal', text].join('\u0000'))
    .digest('hex');
  const file = path.join(TTS_DIR, `${key}.mp3`);

  // Immuable: l'URL contient le texte et la voix, donc le son ne change jamais.
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.type('audio/mpeg');

  if (fs.existsSync(file)) return res.sendFile(file);

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': TTS_KEY,
          'content-type': 'application/json',
          accept: 'audio/mpeg',
        },
        body: JSON.stringify({ text, model_id: TTS_MODEL, voice_settings: settings }),
      }
    );
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      console.error(`ElevenLabs ${r.status}: ${body.slice(0, 200)}`);
      res.set('Cache-Control', 'no-store');
      return res.status(502).json({ error: 'tts_failed' });
    }
    const buf = Buffer.from(await r.arrayBuffer());
    // Écriture atomique: deux enfants qui cliquent en même temps ne peuvent pas
    // laisser un demi-fichier dans le cache.
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, buf);
    fs.renameSync(tmp, file);
    res.send(buf);
  } catch (err) {
    console.error('ElevenLabs TTS error:', err.message);
    res.set('Cache-Control', 'no-store');
    res.status(502).json({ error: 'tts_failed' });
  }
});

// --- Serve static files in production ---
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// --- Start server ---
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Study Buddy server running on http://localhost:${PORT}`);
  });
});

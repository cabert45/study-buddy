import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dns from 'node:dns';
import pg from 'pg';

// Le conteneur Railway n'a pas de route IPv6: chaque adresse AAAA de Neon
// renvoie ENETUNREACH avant qu'on tente enfin l'IPv4. On resout donc en IPv4
// en premier.
dns.setDefaultResultOrder('ipv4first');
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
  // Neon exige TLS. L'ancien test ne l'activait que pour un hote « railway »,
  // donc depuis le demenagement vers Neon il ne s'appliquait plus du tout.
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  keepAlive: true,
});

// Un pool qui explose ne doit pas emporter le processus.
pool.on('error', (err) => {
  dbPrete = false;
  console.error('Pool Postgres:', err.message);
});

let dbPrete = false;

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

    // Un rappel ne part qu'UNE fois par jour, même si le serveur redémarre.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS push_log (
        kind TEXT NOT NULL,
        jour DATE NOT NULL,
        sent_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (kind, jour)
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
// Qui est l'enfant devant l'écran. Le prompt du tuteur disait « Ryan, 7 ans,
// 2e année » — figé depuis l'an dernier. Ryan a 8 ans et il est en 3e, Cayla
// est au secondaire, Nyla ne lit pas encore. Un tuteur qui se trompe d'enfant
// explique au mauvais niveau, ce qui est pire que pas de tuteur du tout.
const ENFANTS = {
  ryan: {
    nom: 'Ryan',
    qui: 'Ryan, 8 ans, 3e année au Québec',
    comment: `Il pleure quand il se trompe: ne dis jamais que c'est faux. Dis d'abord ce qui est déjà
bon, puis la prochaine étape. Explique avec des objets qu'il peut voir (billes, bonbons, doigts, blocs).`,
  },
  cayla: {
    nom: 'Cayla',
    qui: 'Cayla, secondaire 1 au Québec (Collège Laval)',
    comment: `Parle-lui comme à une grande. Pas de bébelles: donne la règle, puis un exemple clair.`,
  },
  nyla: {
    nom: 'Nyla',
    qui: 'Nyla, 5 ans, maternelle 5 ans au Québec',
    comment: `Elle NE LIT PAS. Tout ce que tu écris sera lu à voix haute: des phrases très courtes,
des mots de tous les jours, aucune consigne écrite à déchiffrer. Compte avec elle à voix haute.`,
  },
};

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

// --- Rappels automatiques (push) ---
//
// Toute la plomberie push existait (VAPID, /subscribe, /send) mais RIEN ne la
// déclenchait: il fallait appuyer sur « test » à la main. Voici ce qui manquait.
//
// Trois rappels, heure de Montréal:
//   16h30 en semaine / 10h00 la fin de semaine → Ryan: son bloc l'attend
//   19h00 tous les jours → le parent, seulement si Ryan n'a rien fait
//   17h00 le jeudi → tout le monde: la feuille se remet demain
//
// `push_log` garantit un seul envoi par jour et par rappel, même si Railway
// redémarre le serveur trois fois dans l'après-midi.

const TZ = 'America/Toronto';

function maintenantMontreal() {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false,
  });
  const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
  const JOURS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    jour: `${p.year}-${p.month}-${p.day}`,
    minutes: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10),
    jourSemaine: JOURS[p.weekday],
  };
}

async function dejaEnvoye(kind, jour) {
  const r = await queryOne('SELECT 1 AS x FROM push_log WHERE kind = $1 AND jour = $2', [kind, jour]);
  return !!r;
}

async function marquerEnvoye(kind, jour) {
  await pool.query(
    'INSERT INTO push_log (kind, jour) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [kind, jour],
  );
}

async function envoyerPush({ profile, title, body, url }) {
  const subs = profile && profile !== 'all'
    ? await queryAll('SELECT * FROM push_subscriptions WHERE profile = $1', [profile])
    : await queryAll('SELECT * FROM push_subscriptions');
  const payload = JSON.stringify({ title, body, url: url || '/' });
  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: typeof sub.keys === 'string' ? JSON.parse(sub.keys) : sub.keys,
      }, payload);
      sent++;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [sub.endpoint]);
      }
    }
  }
  return sent;
}

// Ryan a-t-il pratiqué aujourd'hui? (heure de Montréal)
async function aPratiqueAujourdhui(jour) {
  try {
    const r = await queryOne(
      `SELECT COUNT(*)::int AS n FROM sessions
       WHERE profile = 'ryan'
         AND (created_at AT TIME ZONE 'UTC' AT TIME ZONE $2)::date = $1::date`,
      [jour, TZ],
    );
    return (r && r.n > 0);
  } catch {
    return false; // en cas de doute, on rappelle: un rappel de trop vaut mieux qu'un oubli
  }
}

async function verifierRappels() {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return;
  const { jour, minutes, jourSemaine } = maintenantMontreal();
  const finDeSemaine = jourSemaine === 0 || jourSemaine === 6;

  // On tolère un retard de 20 min: le serveur peut dormir ou redémarrer.
  const cEstLHeure = (h, m) => {
    const cible = h * 60 + m;
    return minutes >= cible && minutes < cible + 20;
  };

  try {
    // 1. Le bloc de Ryan
    if (cEstLHeure(finDeSemaine ? 10 : 16, finDeSemaine ? 0 : 30)
        && !(await dejaEnvoye('bloc_ryan', jour))) {
      await marquerEnvoye('bloc_ryan', jour);
      await envoyerPush({
        profile: 'ryan',
        title: "Ma semaine t'attend 🍁",
        body: finDeSemaine
          ? "Deux heures aujourd'hui — on commence par les doubles!"
          : "Ton bloc d'une heure: les stratégies, la liste, et le cahier.",
        url: '/',
      });
    }

    // 2. Le parent, seulement si rien n'a été fait
    if (cEstLHeure(19, 0) && !(await dejaEnvoye('rappel_parent', jour))) {
      const fait = await aPratiqueAujourdhui(jour);
      await marquerEnvoye('rappel_parent', jour);
      if (!fait) {
        await envoyerPush({
          profile: 'parent',
          title: "Ryan n'a pas encore pratiqué",
          body: "Son bloc du jour n'est pas commencé. Il reste du temps avant le dodo.",
          url: '/',
        });
      }
    }

    // 3. La feuille à remettre (jeudi 17h, pour la remise du vendredi)
    if (jourSemaine === 4 && cEstLHeure(17, 0) && !(await dejaEnvoye('remise', jour))) {
      await marquerEnvoye('remise', jour);
      await envoyerPush({
        profile: 'all',
        title: '📌 La feuille se remet demain',
        body: "Feuille d'orthographe + feuille de maths, à remettre vendredi.",
        url: '/',
      });
    }
  } catch (err) {
    console.error('Rappels push:', err.message);
  }
}

// Toutes les 10 minutes. Léger: une requête SELECT quand ce n'est pas l'heure.
setInterval(verifierRappels, 10 * 60 * 1000);
setTimeout(verifierRappels, 30 * 1000);

// Déclenchement manuel, pour tester sans attendre 16h30
app.post('/api/push/check-now', async (req, res) => {
  await verifierRappels();
  res.json({ ok: true, maintenant: maintenantMontreal() });
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

    const enfant = ENFANTS[profile] || ENFANTS.ryan;
    const prompt = `Voici les stats de ${enfant.qui}:

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
      model: 'claude-opus-5',
      max_tokens: 2000,
      system: `Tu es un tuteur expert pour enfants au Québec, en français ET en mathématiques.
Tu parles au PARENT de ${enfant.nom}, pas à l'enfant. Sois précis, actionnable et encourageant.
Appuie chaque constat sur un chiffre des statistiques. Utilise des émojis. Réponds en français.`,
      messages: [{ role: 'user', content: prompt }],
    });
    const texte = response.content.find((b) => b.type === 'text');
    res.json({ message: texte ? texte.text : "Pas encore assez de données pour un conseil utile." });
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
  const enfant = ENFANTS[req.body.profile] || ENFANTS.ryan;
  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 300,
      // Une phrase d'aide n'a pas besoin d'une longue réflexion, et l'enfant
      // attend devant l'écran: effort bas = réponse rapide.
      output_config: { effort: 'low' },
      system: `Tu es le tuteur de ${enfant.qui}.
Réponds en 1-2 phrases MAXIMUM. Français simple. Sois encourageant, avec un émoji.
Ne donne JAMAIS la réponse directement: pose la question qui lui fait trouver la prochaine étape.
${enfant.comment}`,
      messages: [{ role: 'user', content: req.body.prompt }],
    });
    const texte = response.content.find((b) => b.type === 'text');
    res.json({ message: texte ? texte.text : 'Essaie encore! 💪' });
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
// La dictée, elle, passe par le gros modèle. C'est le seul moment où l'enfant
// écrit d'après le son seul: une liaison avalée ou un « ent » final mal rendu
// lui coûte le mot. Ces mots-là sont courts et reviennent toute la semaine,
// donc la seconde et demie de génération n'est payée qu'une fois par mot.
const TTS_MODEL_SLOW = process.env.ELEVENLABS_MODEL_SLOW || 'eleven_multilingual_v2';
// La voix par defaut de l'app: francaise, calme, articulee.
// ELEVENLABS_VOICE_ID (Railway) reste prioritaire s'il est defini — c'est
// encore une voix anglaise aujourd'hui, d'ou la note dans le README du deploy.
const VOIX_FR_DEFAUT = 'DmA5Za3LKQf1NQcbHfdZ';
const TTS_DEFAULT_VOICE = process.env.ELEVENLABS_VOICE_ID || VOIX_FR_DEFAUT;
const TTS_DIR = path.join(__dirname, 'data', 'tts-cache');
const TTS_MAX_CHARS = 600;

fs.mkdirSync(TTS_DIR, { recursive: true });

// Est-ce que la voix premium est disponible? L'app le demande au démarrage.
app.get('/api/tts/status', (req, res) => {
  res.json({ enabled: !!TTS_KEY, defaultVoice: TTS_DEFAULT_VOICE, model: TTS_MODEL, modelSlow: TTS_MODEL_SLOW });
});

// ===== Nyla parle, et on l'écoute ================================
//
// Le reste du portail de Nyla est à choix multiples, et un choix multiple
// bute toujours sur le même mur à cinq ans: il faut lire les réponses. Des
// pans entiers du programme de maternelle restaient donc dehors — réciter
// les jours de la semaine, compter jusqu'à 20 d'un trait, dire son âge.
// Ça ne se coche pas, ça se dit.
//
// Même montage que la pratique orale de Prepara: on enregistre un tour, on
// l'envoie à Scribe, on renvoie le texte. Rien n'est gardé — l'audio vit le
// temps d'une requête, en mémoire, et repart avec elle.
//
// La clé d'ElevenLabs est « scoped »: elle a le droit de faire parler, pas de
// lister les voix (401 sur /v1/voices). Vérifié le 26 sept 2026: elle A le
// droit de transcrire (scribe_v1, language_code=fra → 200). Si cette
// permission disparaissait, /api/ecoute répond 503 et l'app retombe sur le
// module de reconnaissance du navigateur: aucun écran ne devient muet.
const ECOUTE_MAX_BYTES = 4 * 1024 * 1024; // ~30 s d'audio: bien assez pour un tour

app.post('/api/ecoute', express.raw({ type: 'audio/*', limit: ECOUTE_MAX_BYTES }), async (req, res) => {
  if (!TTS_KEY) return res.status(503).json({ error: 'stt_indisponible' });
  const buf = req.body;
  if (!buf || !buf.length) return res.status(400).json({ error: 'audio_vide' });
  const mime = req.headers['content-type'] || 'audio/webm';
  const ext = /mp4|m4a|aac/.test(mime) ? 'm4a' : /ogg/.test(mime) ? 'ogg' : /wav/.test(mime) ? 'wav' : 'webm';
  try {
    const fd = new FormData();
    fd.append('model_id', 'scribe_v1');
    fd.append('language_code', 'fra');
    fd.append('tag_audio_events', 'false');
    fd.append('file', new Blob([buf], { type: mime }), `tour.${ext}`);
    const r = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: { 'xi-api-key': TTS_KEY },
      body: fd,
    });
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      console.error('STT', r.status, body.slice(0, 200));
      return res.status(503).json({ error: 'stt_indisponible' });
    }
    const data = await r.json();
    res.json({ texte: String(data.text || '').trim() });
  } catch (err) {
    console.error('Ecoute error:', err.message);
    res.status(503).json({ error: 'stt_indisponible' });
  }
});

// ===== « On jase » — une vraie conversation, pas une série de questions =====
//
// Le mode « questions » pose cinq consignes fixes et les corrige. Ça travaille
// des savoirs précis (les jours, compter jusqu'à 20), mais ça ne ressemble pas
// à une conversation, et le parent en voulait une: on choisit quelqu'un, on
// touche, et ça se met à jaser — comme /parler chez Prepara.
//
// Sans état, exactement comme Prepara: le client garde le fil et le renvoie à
// chaque tour. Rien n'est écrit sur le serveur.
//
// Deux règles tenues par le prompt:
//   • UNE phrase, puis UNE question. Un enfant de cinq ans décroche d'un
//     paragraphe, et ne peut répondre qu'à une chose à la fois.
//   • On ne corrige jamais son français. Elle a cinq ans: elle parle, c'est
//     tout ce qu'on lui demande.
const CAUSERIE_MAX_TOURS = 12;

app.post('/api/causerie', async (req, res) => {
  const { tours = [], mascotte = 'ton ami' } = req.body || {};
  if (!anthropic) {
    return res.json({ dire: "Raconte-moi ce que tu as fait aujourd'hui!", fini: false });
  }
  const echanges = Array.isArray(tours) ? tours.slice(-CAUSERIE_MAX_TOURS * 2) : [];
  const nbElle = echanges.filter((t) => t.qui === 'nyla').length;
  const onTermine = nbElle >= CAUSERIE_MAX_TOURS - 1;

  try {
    const r = await anthropic.messages.create({
      model: 'claude-opus-5',
      // La réflexion compte dans max_tokens: trop juste, et la phrase revient
      // vide sans la moindre erreur.
      max_tokens: 1200,
      output_config: { effort: 'low' },
      system: `Tu es ${mascotte}, une petite mascotte qui jase avec Nyla, 5 ans, en maternelle 5 ans au Québec.
Son prénom se prononce « Naïla ».

Comment tu parles:
- UN FRANCAIS NEUTRE ET INTERNATIONAL. Ni tres quebecois, ni tres francais de France.
  A eviter: allo, tse, c'est le fun, pantoute, char, presentement, magasiner, une brassee.
  A eviter aussi: ouais, sympa, bagnole, super chouette, un truc, gamin.
  Ecris comme un livre pour enfants ou une emission jeunesse: bonjour, d'accord,
  c'est bien, une voiture, aujourd'hui, beaucoup, amusant.
- UNE phrase courte, puis UNE seule question. Jamais deux questions.
- Des mots de tous les jours, comme on parle à un enfant de cinq ans.
- Tu réagis à ce qu'elle vient de dire avant de demander autre chose.
- Tu ne corriges JAMAIS son français, jamais sa prononciation. Elle parle: c'est déjà tout.
- Si sa réponse est incompréhensible, suppose que le micro a mal entendu et redemande autrement, gentiment.
- Aucun emoji, aucune liste, aucune consigne écrite: tout sera lu à voix haute.

De quoi on jase: sa journée, sa famille (Ryan son grand frère, Cayla sa grande sœur), l'école,
ce qu'elle aime manger, jouer, les animaux, dehors, ce qu'elle a dessiné.
Glisse parfois une petite question de maternelle sans en faire un examen
(« et ça fait combien de chats en tout? », « c'est quelle couleur? »).

${onTermine ? 'IMPORTANT: la conversation se termine. Dis-lui au revoir chaleureusement en une phrase, sans poser de question.' : ''}`,
      messages: echanges.length
        ? echanges.map((t) => ({
            role: t.qui === 'nyla' ? 'user' : 'assistant',
            content: t.texte,
          }))
        : [{ role: 'user', content: '(La conversation commence. Salue-la et pose-lui une première question.)' }],
    });
    const texte = (r.content.find((b) => b.type === 'text') || {}).text || '';
    if (!texte.trim()) {
      console.error('Causerie: reponse vide', r.stop_reason);
      return res.json({ dire: "Et toi, qu'est-ce que tu aimes faire?", fini: onTermine });
    }
    res.json({ dire: texte.trim(), fini: onTermine });
  } catch (err) {
    console.error('Causerie API error:', err.message);
    res.json({ dire: "Raconte-moi encore!", fini: false });
  }
});

// Le juge parlant. Le client a déjà tranché tout seul ce qui est tranchable
// (une suite de nombres, les jours de la semaine — voir utils/nylaOralCheck).
// Ce qui arrive ici, c'est soit une question ouverte, soit un cas où le
// vérificateur local a refusé de conclure. La réponse est COURTE parce qu'elle
// sera lue à voix haute: une enfant de cinq ans n'écoute pas un paragraphe.
app.post('/api/oral', async (req, res) => {
  const { question, attendu, transcript, verdict } = req.body || {};
  if (!anthropic) {
    return res.json({ ok: null, dire: "Merci Nyla! On passe à la suivante." });
  }
  try {
    const r = await anthropic.messages.create({
      model: 'claude-opus-5',
      // 200 ne suffisait pas: la réflexion du modèle compte dans max_tokens,
      // et elle mangeait tout le budget avant la phrase. La réponse revenait
      // vide, sans erreur, et l'app tombait sur son filet « Bravo Nyla! On
      // continue. » — poli, mais elle ne jugeait plus rien. La phrase parlée
      // reste courte parce que le prompt l'exige, pas parce qu'on la coupe.
      max_tokens: 1200,
      // Elle attend devant l'écran, la bouche encore ouverte: la vitesse fait
      // partie de la pédagogie ici.
      output_config: { effort: 'low' },
      system: `Tu parles à Nyla, 5 ans, maternelle 5 ans au Québec. Elle NE LIT PAS:
tout ce que tu écris sera lu à voix haute par une voix de synthèse.

Règles absolues:
- UNE ou DEUX phrases courtes. Jamais plus.
- Un francais NEUTRE ET INTERNATIONAL: ni tres quebecois (allo, tse, c'est le fun),
  ni tres francais de France (ouais, sympa, gamin). Comme une emission jeunesse.
- Des mots de tous les jours. Aucune consigne écrite, aucune liste, aucun emoji.
- Si elle a raison: dis-le avec enthousiasme et redis sa bonne réponse.
- Si elle se trompe: ne dis JAMAIS « non » ni « c'est faux ». Nomme d'abord ce
  qu'elle a réussi, puis donne l'indice qui lui fait trouver. Elle pleure quand
  elle se trompe.
- Si sa réponse est hors sujet ou incompréhensible, suppose que la transcription
  est mauvaise et redemande gentiment, autrement.

Réponds en JSON: {"ok": true|false, "dire": "<ce qu'on lui dit à voix haute>"}`,
      messages: [{
        role: 'user',
        content: `Question posée à voix haute: « ${question} »
${attendu ? `Réponse attendue: ${attendu}` : 'Question ouverte: toute réponse sensée est bonne.'}
Ce que la transcription a entendu: « ${transcript} »
${verdict ? `Le vérificateur automatique a conclu: ${verdict}` : ''}`,
      }],
    });
    const texte = (r.content.find((b) => b.type === 'text') || {}).text || '';
    const m = texte.match(/\{[\s\S]*\}/);
    let parsed = null;
    try { parsed = m ? JSON.parse(m[0]) : null; } catch {}
    if (!parsed || typeof parsed.dire !== 'string') {
      // Silencieux, cet echec ressemblait a un succes: on le nomme dans le log
      // pour qu'un budget de tokens trop court se voie du premier coup d'oeil.
      console.error('Oral: reponse inexploitable', r.stop_reason, JSON.stringify(texte).slice(0, 160));
      return res.json({ ok: null, dire: 'Bravo Nyla! On continue.' });
    }
    res.json({ ok: !!parsed.ok, dire: parsed.dire });
  } catch (err) {
    console.error('Oral API error:', err.message);
    res.json({ ok: null, dire: "Bravo Nyla! On continue." });
  }
});

// Les voix proposées dans ⚙️ Réglages quand le compte ne peut pas être listé.
// La clé d'ElevenLabs est « scoped »: elle a le droit de faire parler, pas celui
// de lire la liste des voix du compte (401 sur /v1/voices). Plutôt que de laisser
// l'écran vide, on offre ces voix du catalogue commun, vérifiées en français.
// Les voix proposees dans l'app. Elles sont FRANCAISES, et c'est tout le
// sujet.
//
// Le compte ElevenLabs est partage avec Prepara, qui enseigne l'anglais: ses
// 22 voix sont donc toutes anglaises. Elles savent lire du francais avec le
// modele multilingue, mais avec une bouche anglaise — « six » sortait
// « sixe ». Un enfant de cinq ans qui apprend a compter ne doit pas entendre
// ca.
//
// Celles-ci viennent de la bibliotheque partagee, `language=fr`, accent
// `standard`: ni tres quebecois, ni tres parisien — du francais neutre, comme
// demande. Chacune a ete essayee sur une phrase piegeuse (« une tortue, un
// ourson et six oiseaux ») et reconnue en francais par Scribe.
const TTS_FALLBACK_VOICES = [
  { id: 'DmA5Za3LKQf1NQcbHfdZ', name: 'Emilie', description: 'femme - calme et amicale' },
  { id: 'Cy2zXKmu2kQeAuze0rzV', name: 'Chloe', description: 'femme - jeune et naturelle' },
  { id: 'LAUUUZAQpu1khF4zl6Vl', name: 'Lucie', description: 'femme - douce, pour raconter' },
  { id: 'uOw88F5bjqRiVuZLhXEA', name: 'Victoria', description: 'femme - enjouee' },
  { id: 'LFtQZWdaqmvamcTNGpwl', name: 'Lucie (posee)', description: 'femme - lente et claire' },
  { id: 'aiFobLbZNvpjmWZD7HBh', name: 'Alex', description: 'homme - chaleureux' },
  { id: '43TArLZXN5r3L8mJ6AGR', name: 'Quentin', description: 'homme - jeune' },
];


// Les voix du compte ElevenLabs, pour la liste de ⚙️ Réglages.
// Gardées 10 min en mémoire: la liste ne bouge presque jamais.
let voicesCache = { at: 0, list: null };
app.get('/api/tts/voices', (req, res) => {
  if (!TTS_KEY) return res.json({ enabled: false, voices: [] });
  // On NE liste plus les voix du compte. Depuis que la permission voices_read
  // est accordee, /v1/voices repond bien — mais il rend les 22 voix de
  // Prepara, toutes anglaises. Les proposer dans une app francaise pour
  // enfants serait un recul: on sert la selection francaise ci-dessus.
  res.json({ enabled: true, voices: TTS_FALLBACK_VOICES });
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

  const model = slow ? TTS_MODEL_SLOW : TTS_MODEL;
  const settings = slow
    ? { stability: 0.6, similarity_boost: 0.8, speed: 0.8 }
    : { stability: 0.5, similarity_boost: 0.75, speed: 1.0 };

  const key = crypto.createHash('sha1')
    .update([model, voice, slow ? 'slow' : 'normal', text].join('\u0000'))
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
        body: JSON.stringify({ text, model_id: model, voice_settings: settings }),
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

// Etat du service: permet de voir en un coup d'oeil si la base repond,
// au lieu de decouvrir trois jours plus tard que rien n'a ete enregistre.
app.get('/api/health', async (req, res) => {
  let base = 'injoignable';
  try {
    // Un diagnostic qui prend 10 s n'est pas un diagnostic: on plafonne a 3 s,
    // sinon /api/health pend aussi longtemps que le pool.
    await Promise.race([
      pool.query('SELECT 1'),
      new Promise((_, rejeter) => setTimeout(() => rejeter(new Error('trop lent')), 3000)),
    ]);
    base = 'ok';
    dbPrete = true;
  } catch (err) {
    base = `injoignable (${err.code || err.message})`;
  }
  res.status(base === 'ok' ? 200 : 503).json({
    serveur: 'ok',
    base,
    voix: !!TTS_KEY,
    heure: new Date().toISOString(),
  });
});

// --- Serve static files in production ---
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// --- Start server ---
//
// AVANT: `initDb().then(() => app.listen(...))`. Si la base etait injoignable,
// la promesse echouait, `app.listen` n'etait JAMAIS appele et le processus
// mourait: toute l'app tombait en 502 — y compris les exercices, qui tournent
// entierement dans le navigateur et n'ont pas besoin de la base.
// C'est exactement ce qui est arrive le 26 sept.
//
// Maintenant le serveur ecoute tout de suite. La base est preparee a cote,
// avec des essais espaces, et l'app fonctionne dans l'intervalle: la pratique
// marche, et les sessions attendent sur l'appareil (voir utils/storage.js).
app.listen(PORT, () => {
  console.log(`Study Buddy server running on http://localhost:${PORT}`);
});

async function preparerLaBase(essai = 1) {
  try {
    await initDb();
    dbPrete = true;
    console.log('Base de donnees prete' + (essai > 1 ? ` (apres ${essai} essais)` : ''));
  } catch (err) {
    dbPrete = false;
    const attente = Math.min(60000, 2000 * 2 ** (essai - 1));
    console.error(`Base injoignable (essai ${essai}): ${err.message} — nouvel essai dans ${Math.round(attente / 1000)}s`);
    setTimeout(() => preparerLaBase(essai + 1), attente);
  }
}
preparerLaBase();

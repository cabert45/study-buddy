import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import Anthropic from '@anthropic-ai/sdk';

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

// --- API Routes ---

app.get('/api/progress', async (req, res) => {
  try {
    const profile = req.query.profile || 'ryan';
    const stats = await queryAll('SELECT * FROM category_stats WHERE profile = $1', [profile]);
    const sessions = await queryAll('SELECT * FROM sessions WHERE profile = $1 ORDER BY id DESC LIMIT 10', [profile]);
    const totals = await queryOne('SELECT COALESCE(SUM(correct),0) as correct, COALESCE(SUM(total),0) as total FROM category_stats WHERE profile = $1', [profile]);
    res.json({ stats, sessions, totals });
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
    const ageDesc = grade === '6' ? '11 ans (6e année)' : '7 ans (2e année)';
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

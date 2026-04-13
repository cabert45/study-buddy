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
    const stats = await queryAll('SELECT * FROM category_stats');
    const sessions = await queryAll('SELECT * FROM sessions ORDER BY id DESC LIMIT 10');
    const totals = await queryOne('SELECT COALESCE(SUM(correct),0) as correct, COALESCE(SUM(total),0) as total FROM category_stats');
    res.json({ stats, sessions, totals });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/session', async (req, res) => {
  try {
    const { mode, total, correct, details } = req.body;
    const date = new Date().toISOString().split('T')[0];

    await pool.query(
      'INSERT INTO sessions (date, mode, total, correct, details) VALUES ($1, $2, $3, $4, $5)',
      [date, mode, total, correct, JSON.stringify(details)]
    );

    if (details && Array.isArray(details)) {
      for (const d of details) {
        const correctVal = d.correct ? 1 : 0;
        await pool.query(`
          INSERT INTO category_stats (category, correct, total)
          VALUES ($1, $2, 1)
          ON CONFLICT (category) DO UPDATE SET
            correct = category_stats.correct + $3,
            total = category_stats.total + 1
        `, [d.category, correctVal, correctVal]);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Session save error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const stats = await queryAll('SELECT * FROM category_stats');
    const sessions = await queryAll('SELECT * FROM sessions ORDER BY id DESC LIMIT 30');
    const totals = await queryOne('SELECT COALESCE(SUM(correct),0) as correct, COALESCE(SUM(total),0) as total FROM category_stats');
    const sessionCount = await queryOne('SELECT COUNT(*) as count FROM sessions');
    const daily = await queryAll(`
      SELECT date, SUM(correct) as correct, SUM(total) as total
      FROM sessions GROUP BY date ORDER BY date DESC LIMIT 14
    `);
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
    const stats = await queryAll('SELECT * FROM category_stats');
    const recentSessions = await queryAll('SELECT * FROM sessions ORDER BY id DESC LIMIT 5');
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
    await pool.query('DELETE FROM sessions');
    await pool.query('DELETE FROM category_stats');
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

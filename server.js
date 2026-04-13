import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Database setup with sql.js ---
// Use RAILWAY_VOLUME_MOUNT_PATH if available (persistent volume), otherwise local data/
const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'ryan.db');
let db;

async function initDb() {
  const SQL = await initSqlJs();

  // Load existing db file if it exists — NEVER overwrite existing data
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('Loaded existing database from', dbPath);
  } else {
    db = new SQL.Database();
    console.log('Created new database');
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      mode TEXT NOT NULL,
      total INTEGER NOT NULL,
      correct INTEGER NOT NULL,
      details TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS category_stats (
      category TEXT PRIMARY KEY,
      correct INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  saveDb();
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows[0] || null;
}

// --- Anthropic client ---
let anthropic = null;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// --- API Routes ---

app.get('/api/progress', (req, res) => {
  const stats = queryAll('SELECT * FROM category_stats');
  const sessions = queryAll('SELECT * FROM sessions ORDER BY id DESC LIMIT 10');
  const totals = queryOne('SELECT COALESCE(SUM(correct),0) as correct, COALESCE(SUM(total),0) as total FROM category_stats');
  res.json({ stats, sessions, totals });
});

app.post('/api/session', (req, res) => {
  const { mode, total, correct, details } = req.body;
  const date = new Date().toISOString().split('T')[0];

  db.run('INSERT INTO sessions (date, mode, total, correct, details) VALUES (?, ?, ?, ?, ?)',
    [date, mode, total, correct, JSON.stringify(details)]);

  if (details && Array.isArray(details)) {
    for (const d of details) {
      const correctVal = d.correct ? 1 : 0;
      db.run(`
        INSERT INTO category_stats (category, correct, total)
        VALUES (?, ?, 1)
        ON CONFLICT(category) DO UPDATE SET
          correct = correct + ?,
          total = total + 1
      `, [d.category, correctVal, correctVal]);
    }
  }

  saveDb();
  res.json({ ok: true });
});

app.get('/api/dashboard', (req, res) => {
  const pin = req.query.pin;
  if (pin !== '1234') {
    return res.status(401).json({ error: 'PIN incorrect' });
  }
  const stats = queryAll('SELECT * FROM category_stats');
  const sessions = queryAll('SELECT * FROM sessions ORDER BY id DESC LIMIT 10');
  const totals = queryOne('SELECT COALESCE(SUM(correct),0) as correct, COALESCE(SUM(total),0) as total FROM category_stats');
  const sessionCount = queryOne('SELECT COUNT(*) as count FROM sessions');
  res.json({ stats, sessions, totals, sessionCount: sessionCount?.count || 0 });
});

app.post('/api/reset', (req, res) => {
  const { pin } = req.body;
  if (pin !== '1234') {
    return res.status(401).json({ error: 'PIN incorrect' });
  }
  db.run('DELETE FROM sessions');
  db.run('DELETE FROM category_stats');
  saveDb();
  res.json({ ok: true });
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

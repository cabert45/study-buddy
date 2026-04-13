/**
 * Database backup script
 * Run BEFORE any database changes, deployments, or schema modifications.
 * Creates a timestamped copy of the SQLite database file.
 *
 * Usage: node scripts/backup-db.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Database location — respects RAILWAY_VOLUME_MOUNT_PATH if set
const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(projectRoot, 'data');
const dbPath = path.join(dataDir, 'ryan.db');
const backupDir = path.join(dataDir, 'backups');

function backup() {
  if (!fs.existsSync(dbPath)) {
    console.log('No database file found at', dbPath, '— nothing to back up.');
    return;
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupPath = path.join(backupDir, `ryan-${timestamp}.db`);

  fs.copyFileSync(dbPath, backupPath);

  const sizeMB = (fs.statSync(backupPath).size / 1024 / 1024).toFixed(2);
  console.log(`Backup created: ${backupPath} (${sizeMB} MB)`);

  // Keep only the last 10 backups to avoid filling disk
  const backups = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('ryan-') && f.endsWith('.db'))
    .sort()
    .reverse();

  if (backups.length > 10) {
    for (const old of backups.slice(10)) {
      fs.unlinkSync(path.join(backupDir, old));
      console.log(`Removed old backup: ${old}`);
    }
  }
}

backup();

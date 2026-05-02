// Generate PNG icons from SVG for PWA
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const svgPath = path.join(projectRoot, 'public', 'favicon.svg');
const publicDir = path.join(projectRoot, 'public');

const svg = fs.readFileSync(svgPath);

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

for (const { size, name } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, name));
  console.log(`Generated ${name} (${size}x${size})`);
}

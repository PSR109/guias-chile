// Adds og:image:width / og:image:height (real, measured) and og:image:alt
// (fallback = the page's own og:title, already-published copy — zero-invention)
// to every page that has an og:image but is missing these tags. Idempotent.
import fs from 'node:fs';
import path from 'node:path';
import { jpegSizeFromFile } from './og-image-dims.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const dims = new Map(); // slug -> {width, height}
for (const f of fs.readdirSync(path.join(ROOT, 'img/og'))) {
  if (!f.endsWith('.jpg')) continue;
  const slug = f.replace(/\.jpg$/, '');
  dims.set(slug, jpegSizeFromFile(path.join(ROOT, 'img/og', f)));
}

function findHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'scratchpad') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) findHtmlFiles(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of findHtmlFiles(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const imgMatch = html.match(/<meta property="og:image" content="[^"]*\/img\/og\/([a-z0-9-]+)\.jpg">/);
  if (!imgMatch) continue; // creditos.html, privacy-policy.html
  const slug = imgMatch[1];
  const size = dims.get(slug);
  if (!size) { console.warn('no dims for', slug, file); continue; }

  let inserted = '';
  if (!html.includes('og:image:width')) {
    inserted += `\n<meta property="og:image:width" content="${size.width}">\n<meta property="og:image:height" content="${size.height}">`;
  }
  if (!html.includes('og:image:alt')) {
    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)">/);
    const alt = titleMatch ? titleMatch[1] : slug;
    inserted += `\n<meta property="og:image:alt" content="${alt}">`;
  }
  if (!inserted) continue;

  const newHtml = html.replace(imgMatch[0], imgMatch[0] + inserted);
  fs.writeFileSync(file, newHtml);
  changed++;
}
console.log('changed', changed, 'files');

// Variante en/pt de switch-kit-cta-gumroad.mjs — mismo switch Payhip→Gumroad
// primario, con enlace secundario localizado ("also on Payhip" / "também no Payhip").
// Solo toca páginas cuya campaña está LIVE en tools/chrome/gumroad-live.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(new URL('.', import.meta.url).pathname, '..');
const FACTORY = resolve(ROOT, '..');

const live = JSON.parse(readFileSync(resolve(FACTORY, 'tools/chrome/gumroad-live.json'), 'utf8'));
const map = JSON.parse(readFileSync(resolve(FACTORY, 'tools/chrome/crosslink-map-r9.json'), 'utf8'));
const cambios = [];

for (const [pagina, enlaces] of Object.entries(map.paginas)) {
  const isEn = pagina.includes('/en/');
  const isPt = pagina.includes('/pt/');
  if (!pagina.startsWith('guias-chile/') || (!isEn && !isPt)) continue;
  const secText = isEn ? 'also on' : 'também no';
  const abs = resolve(FACTORY, pagina);
  let html = readFileSync(abs, 'utf8');
  let tocado = false;
  for (const e of enlaces) {
    const gumUrl = live[e.campaign];
    if (!gumUrl) continue;
    const payhipHref = `https://payhip.com/b/${e.code}?utm_source=guias&utm_medium=cta&utm_campaign=${e.campaign}`;
    if (!html.includes(payhipHref)) { console.log('SKIP (href no encontrado):', pagina, e.campaign); continue; }
    if (html.includes(gumUrl)) { console.log('SKIP (ya tiene Gumroad):', pagina, e.campaign); continue; }
    const gumHref = `${gumUrl}?utm_source=guias&utm_medium=cta&utm_campaign=${e.campaign}`;
    html = html.replace(payhipHref, gumHref);
    html = html.replace(
      /(<span class="kit-price">[^<]*<\/span>)/,
      `$1 <span class="kit-mirror">· ${secText} <a href="${payhipHref}" rel="sponsored noopener" target="_blank">Payhip</a></span>`
    );
    tocado = true;
    cambios.push({ pagina, slug: e.campaign, gumroad: gumHref });
  }
  if (tocado) writeFileSync(abs, html);
}

console.log('\nPáginas modificadas:', new Set(cambios.map((c) => c.pagina)).size);
for (const c of cambios) console.log(' ', c.pagina, '→', c.gumroad);
if (!cambios.length) console.log('(nada que cambiar)');

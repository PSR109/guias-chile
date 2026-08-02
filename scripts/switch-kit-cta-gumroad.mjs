// Switch de CTAs trip-kit Payhip → Gumroad (primario) en guias-chile.
// Motivo: gate #77 (PayPal de Payhip no puede recibir pagos) — el espejo
// Gumroad es el ÚNICO checkout funcional. Reversible: Payhip queda como
// enlace secundario "También en Payhip".
// Solo toca páginas cuyo slug de campaña está LIVE en Gumroad (fuente:
// tools/chrome/gumroad-live.json — {slug: url}). Correr DESPUÉS de que el
// cron 8ef7d4df drene la cola: node scripts/switch-kit-cta-gumroad.mjs
// Luego: node scripts/check-html.mjs && check-links.mjs, commit+push, CI.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(new URL('.', import.meta.url).pathname, '..');
const FACTORY = resolve(ROOT, '..');

const livePath = resolve(FACTORY, 'tools/chrome/gumroad-live.json');
if (!existsSync(livePath)) throw new Error('falta tools/chrome/gumroad-live.json (lo genera el cron al publicar)');
const live = JSON.parse(readFileSync(livePath, 'utf8'));

const map = JSON.parse(readFileSync(resolve(FACTORY, 'tools/chrome/crosslink-map-r9.json'), 'utf8'));
const cambios = [];

for (const [pagina, enlaces] of Object.entries(map.paginas)) {
  if (!pagina.startsWith('guias-chile/') || pagina.includes('/en/') || pagina.includes('/pt/')) continue;
  const abs = resolve(FACTORY, pagina);
  let html = readFileSync(abs, 'utf8');
  let tocado = false;
  for (const e of enlaces) {
    const gumUrl = live[e.campaign];
    if (!gumUrl) continue; // ese kit aún no está LIVE en Gumroad
    const payhipHref = `https://payhip.com/b/${e.code}?utm_source=guias&utm_medium=cta&utm_campaign=${e.campaign}`;
    if (!html.includes(payhipHref)) { console.log('SKIP (href no encontrado):', pagina, e.campaign); continue; }
    if (html.includes(gumUrl)) { console.log('SKIP (ya tiene Gumroad):', pagina, e.campaign); continue; }
    const gumHref = `${gumUrl}?utm_source=guias&utm_medium=cta&utm_campaign=${e.campaign}`;
    // Payhip primario → Gumroad primario, y Payhip pasa a secundario al final del CTA
    html = html.replace(payhipHref, gumHref);
    html = html.replace(
      /(<span class="kit-price">[^<]*<\/span>)/,
      `$1 <span class="kit-mirror">· también en <a href="${payhipHref}" rel="sponsored noopener" target="_blank">Payhip</a></span>`
    );
    tocado = true;
    cambios.push({ pagina, slug: e.campaign, gumroad: gumHref });
  }
  if (tocado) writeFileSync(abs, html);
}

console.log('\nPáginas modificadas:', new Set(cambios.map((c) => c.pagina)).size);
for (const c of cambios) console.log(' ', c.pagina, '→', c.gumroad);
if (!cambios.length) console.log('(nada que cambiar — ¿gumroad-live.json vacío o slugs sin mapeo?)');

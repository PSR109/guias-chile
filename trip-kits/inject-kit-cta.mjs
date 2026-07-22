import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KITS, GUMROAD_BASE } from './kits.config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// guia -> kit que se le ofrece
const MAP = {
  'torres-del-paine': 'tdp-no-car',
  'puerto-natales': 'tdp-no-car',
  'punta-arenas': 'tdp-no-car',
  'carretera-austral': 'carretera-austral-7d',
  'chiloe': 'chiloe-lakes-5d',
  'puerto-varas': 'chiloe-lakes-5d',
  'frutillar': 'chiloe-lakes-5d',
  'saltos-del-petrohue': 'chiloe-lakes-5d',
  'san-pedro-de-atacama': 'atacama-5d',
  'santiago': 'santiago-cajon-4d',
  'cajon-del-maipo': 'santiago-cajon-4d',
  'valparaiso': 'valpo-wine-4d',
  'colchagua-pichilemu': 'valpo-wine-4d',
  'pucon-villarrica': 'pucon-volcano-4d',
  'la-serena-coquimbo': 'elqui-stars-4d',
  'valle-del-elqui': 'elqui-stars-4d',
  'rapa-nui': 'rapa-nui-4d',
};

const TEXTS = {
  es: (kit, url) =>
    `🗺️ ¿Planificando este viaje? Descarga nuestro <a href="${url}" rel="sponsored noopener" target="_blank">itinerario PDF día a día: ${kit.title}</a> — imprimible, con presupuesto 2026 y checklist. <span class="kit-price">US$${kit.priceUsd}</span>`,
  en: (kit, url) =>
    `🗺️ Planning this trip? Get our <a href="${url}" rel="sponsored noopener" target="_blank">day-by-day PDF itinerary: ${kit.title}</a> — printable, with 2026 budget tables and a packing checklist. <span class="kit-price">US$${kit.priceUsd}</span>`,
  pt: (kit, url) =>
    `🗺️ Planejando esta viagem? Baixe nosso <a href="${url}" rel="sponsored noopener" target="_blank">roteiro PDF dia a dia: ${kit.title}</a> — imprimível, com orçamento 2026 e checklist. <span class="kit-price">US$${kit.priceUsd}</span>`,
};

let changed = 0, skipped = 0;
for (const [slug, kitId] of Object.entries(MAP)) {
  const kit = KITS.find((k) => k.id === kitId);
  for (const lang of ['es', 'en', 'pt']) {
    const file = lang === 'es' ? join(ROOT, `${slug}.html`) : join(ROOT, lang, `${slug}.html`);
    if (!existsSync(file)) { console.warn(`WARN: no existe ${file}`); continue; }
    let html = readFileSync(file, 'utf8');
    if (html.includes('kit-cta')) { skipped++; continue; }
    const url = `${GUMROAD_BASE}/${kit.gumroadPermalink}?utm_source=guias&utm_medium=cta&utm_campaign=${kit.id}`;
    const block = `  <div class="kit-cta">\n    ${TEXTS[lang](kit, url)}\n  </div>\n\n`;
    const anchor = '<div class="promo">';
    if (!html.includes(anchor)) { console.warn(`WARN: sin ancla .promo en ${file}`); continue; }
    html = html.replace(anchor, block + '  ' + anchor);
    writeFileSync(file, html);
    changed++;
    console.log(`cta: ${lang}/${slug}`);
  }
}
console.log(`changed=${changed} skipped=${skipped}`);

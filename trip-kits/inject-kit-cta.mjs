import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KITS, GUMROAD_BASE, PAYHIP_URLS } from './kits.config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// guia -> kit que se le ofrece. Valor string (gen-1) o array (2026-08-01):
// array = kits candidatos para la MISMA guia; por idioma se elige el kit con
// lang fijo que calce y, si no hay, el gen-1 (sin lang). Ej: santiago/cajon
// ofrecen el kit EN en en/pt y el gemelo ES en la guia ES (swap del CTA).
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
  'santiago': ['santiago-cajon-4d', 'santiago-cajon-4d-es'],
  'cajon-del-maipo': ['santiago-cajon-4d', 'santiago-cajon-4d-es'],
  'valparaiso': 'valpo-wine-4d',
  'colchagua-pichilemu': 'valpo-wine-4d',
  'pucon-villarrica': 'pucon-volcano-4d',
  'la-serena-coquimbo': 'elqui-stars-4d',
  'valle-del-elqui': 'elqui-stars-4d',
  'rapa-nui': 'rapa-nui-4d',
  'termas-de-chillan': 'termas-del-sur-4d',
  // Kits gen-2 ES de la tanda 2 (2026-08-01): FUERA de READY_KITS hasta que los
  // productos Payhip existan y PAYHIP_URLS tenga las URLs reales (gate: sin
  // producto real no se publica el link — leccion 2026-07-28).
  'radal-siete-tazas-curico': 'radal-siete-tazas-3d',
};

// Gate 2026-07-28: solo los kits con producto Gumroad YA existente y verificado
// (200 en patricio358.gumroad.com/l/<permalink>) entran al inyector. Los 5 que
// chocaron con el limite de 10 productos/dia de Gumroad (tdp-no-car,
// santiago-cajon-4d, valpo-wine-4d, pucon-volcano-4d, rapa-nui-4d) se
// verificaron 200 el 2026-07-30 (ciclo apps-runner) -- cupo diario reseteado,
// los 10 kits ya existen.
const READY_KITS = new Set([
  'carretera-austral-7d',
  'chiloe-lakes-5d',
  'atacama-5d',
  'elqui-stars-4d',
  'tdp-no-car',
  'santiago-cajon-4d',
  'valpo-wine-4d',
  'pucon-volcano-4d',
  'rapa-nui-4d',
  // termas-del-sur-4d: producto Payhip creado y verificado 2026-08-01
  // (https://payhip.com/b/XDjCS, US$12.90). Kit ES: el inyector solo toca la guia ES.
  'termas-del-sur-4d',
]);

// URL de compra: Payhip si existe (migracion 2026-07-30), si no el permalink Gumroad.
const kitUrl = (kit) => PAYHIP_URLS[kit.id] ?? `${GUMROAD_BASE}/${kit.gumroadPermalink}`;

const TEXTS = {
  es: (kit, url) =>
    `🗺️ ¿Planificando este viaje? Descarga nuestro <a href="${url}" rel="sponsored noopener" target="_blank">itinerario PDF día a día: ${kit.title}</a> — imprimible, con presupuesto 2026 y checklist. <span class="kit-price">US$${kit.priceUsd}</span>`,
  en: (kit, url) =>
    `🗺️ Planning this trip? Get our <a href="${url}" rel="sponsored noopener" target="_blank">day-by-day PDF itinerary: ${kit.title}</a> — printable, with 2026 budget tables and a packing checklist. <span class="kit-price">US$${kit.priceUsd}</span>`,
  pt: (kit, url) =>
    `🗺️ Planejando esta viagem? Baixe nosso <a href="${url}" rel="sponsored noopener" target="_blank">roteiro PDF dia a dia: ${kit.title}</a> — imprimível, com orçamento 2026 e checklist. <span class="kit-price">US$${kit.priceUsd}</span>`,
};

let changed = 0, skipped = 0, notReady = 0;
for (const [slug, entry] of Object.entries(MAP)) {
  const readyIds = (Array.isArray(entry) ? entry : [entry]).filter((id) => READY_KITS.has(id));
  if (readyIds.length === 0) { notReady++; continue; }
  const kits = readyIds.map((id) => KITS.find((k) => k.id === id));
  for (const lang of ['es', 'en', 'pt']) {
    // Kit para ESTE idioma: el de lang fijo que calce; si no, el gen-1 (sin
    // lang). Kits con lang fijo (gen-2 ES) solo se ofrecen en guias de ese
    // idioma: un CTA en la guia EN venderia un PDF en espanol (y viceversa).
    const kit = kits.find((k) => k.lang === lang) ?? kits.find((k) => !k.lang);
    if (!kit) continue;
    const file = lang === 'es' ? join(ROOT, `${slug}.html`) : join(ROOT, lang, `${slug}.html`);
    if (!existsSync(file)) { console.warn(`WARN: no existe ${file}`); continue; }
    let html = readFileSync(file, 'utf8');
    // La comilla final es el borde del href: sin ella, el id 'santiago-cajon-4d'
    // haria match substring dentro de 'santiago-cajon-4d-es'.
    if (html.includes(`utm_campaign=${kit.id}"`)) { skipped++; continue; }
    const url = `${kitUrl(kit)}?utm_source=guias&utm_medium=cta&utm_campaign=${kit.id}`;
    const block = `  <div class="kit-cta">\n    ${TEXTS[lang](kit, url)}\n  </div>\n\n`;
    if (html.includes('kit-cta')) {
      // SWAP: la guia ya tiene el CTA de OTRO kit (ej. la guia ES ofrecia el
      // kit EN y ahora existe el gemelo ES). Se reemplaza el bloque completo
      // por el del kit elegido — nunca dos CTAs en la misma guia.
      const swapped = html.replace(/ {2}<div class="kit-cta">\n[\s\S]*?\n {2}<\/div>\n\n/, block);
      if (swapped === html) { console.warn(`WARN: kit-cta con formato inesperado en ${file}, no se toca`); continue; }
      writeFileSync(file, swapped);
      changed++;
      console.log(`cta swap: ${lang}/${slug} -> ${kit.id}`);
      continue;
    }
    const anchor = '<div class="promo">';
    if (!html.includes(anchor)) { console.warn(`WARN: sin ancla .promo en ${file}`); continue; }
    html = html.replace(anchor, block + '  ' + anchor);
    writeFileSync(file, html);
    changed++;
    console.log(`cta: ${lang}/${slug}`);
  }
}
console.log(`changed=${changed} skipped=${skipped} notReady(sin producto Payhip aun)=${notReady}`);

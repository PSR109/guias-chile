#!/usr/bin/env node
// Extiende inject-crosslinks-2026-08-01.mjs (WP 10K.7.11) a en/ y pt/ --
// esas dos carpetas quedaron fuera de alcance explícito de esa corrida.
// Mismo bloque "Más herramientas de Rev It Up", localizado por idioma.
// Idempotente por marcador (uno distinto por locale, no pisa el de raíz ES).
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const LOCALES = {
  pt: {
    dir: join(ROOT, "pt"),
    marker: "herramientas-2026-08-02-pt",
    intro: "Mais ferramentas da Rev It Up:",
    links: [
      ["https://viajesypanoramas.cl", "Viajes y Panoramas — app de passeios"],
      ["https://configuracion.patagoniasimracing.cl", "Patagonia SimRacing — setups de simracing"],
      ["https://cv-ats-chile.contacto-d1f.workers.dev", "CV ATS Chile — currículo em minutos"],
      ["https://legaldocs-chile.contacto-d1f.workers.dev", "LegalDocs Chile — documentos legais"],
      ["https://profecl.cl", "ProfeCL — planejamentos docentes"],
      ["https://rapidapi.com/patricioponce358/api/chile-poi-places-tolls-fuel-prices1", "API Chile POI — dados para apps"],
    ],
  },
  en: {
    dir: join(ROOT, "en"),
    marker: "herramientas-2026-08-02-en",
    intro: "More tools from Rev It Up:",
    links: [
      ["https://viajesypanoramas.cl", "Viajes y Panoramas — trip-planning app"],
      ["https://configuracion.patagoniasimracing.cl", "Patagonia SimRacing — sim racing setups"],
      ["https://cv-ats-chile.contacto-d1f.workers.dev", "CV ATS Chile — resumes in minutes"],
      ["https://legaldocs-chile.contacto-d1f.workers.dev", "LegalDocs Chile — legal documents"],
      ["https://profecl.cl", "ProfeCL — lesson planning"],
      ["https://rapidapi.com/patricioponce358/api/chile-poi-places-tolls-fuel-prices1", "API Chile POI — data for apps"],
    ],
  },
};

let totalChanged = 0;

for (const [locale, cfg] of Object.entries(LOCALES)) {
  const bloque =
    `  <!-- ${cfg.marker} -->\n` +
    `  <p class="herramientas">${cfg.intro} ` +
    cfg.links.map(([href, txt]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${txt}</a>`).join(" · ") +
    `</p>\n`;

  let changed = 0;
  const skipped = [];

  for (const fname of readdirSync(cfg.dir)) {
    if (!fname.endsWith(".html")) continue;
    const filePath = join(cfg.dir, fname);
    const html = readFileSync(filePath, "utf8");
    if (html.includes(cfg.marker)) continue; // ya inyectado
    if (!html.includes('<footer class="sitio">')) continue; // no es página del sitio
    const closes = html.split("</footer>").length - 1;
    if (closes !== 1) {
      skipped.push(`${locale}/${fname}: ${closes} cierres </footer>, se omite a mano`);
      continue;
    }
    writeFileSync(filePath, html.replace("</footer>", `${bloque}</footer>`));
    changed++;
  }

  console.log(`${locale}: ${changed} archivos actualizados`);
  for (const s of skipped) console.log(`OMITIDO ${s}`);
  totalChanged += changed;
}

console.log(`total: ${totalChanged} archivos actualizados`);

#!/usr/bin/env node
// Cross-links del portafolio (tarea tráfico 2026-08-01): bloque discreto
// "Más herramientas de Rev It Up" en el footer de las guías ES raíz +
// index.html. Solo ES raíz (en/ y pt/ fuera de alcance por ahora).
// Idempotente: si el marcador ya está, no toca el archivo. NO toca los
// bloques CTA de trip kits (viven en <main>, esto solo toca <footer>).
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MARKER = "herramientas-2026-08-01";

// Nombre + descripción de 2-4 palabras; máx 6 links (anti link-farm).
// Guías de Chile no se enlaza a sí misma; sí a la API hermana en RapidAPI.
const LINKS = [
  ["https://viajesypanoramas.cl", "Viajes y Panoramas — app de panoramas"],
  ["https://configuracion.patagoniasimracing.cl", "Patagonia SimRacing — setups de simracing"],
  ["https://cv-ats-chile.contacto-d1f.workers.dev", "CV ATS Chile — CV en minutos"],
  ["https://legaldocs-chile.contacto-d1f.workers.dev", "LegalDocs Chile — documentos legales"],
  ["https://profecl.cl", "ProfeCL — planificaciones docentes"],
  ["https://rapidapi.com/patricioponce358/api/chile-poi-places-tolls-fuel-prices1", "API Chile POI — datos para apps"],
];

const bloque =
  `  <!-- ${MARKER} -->\n` +
  `  <p class="herramientas">Más herramientas de Rev It Up: ` +
  LINKS.map(([href, txt]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${txt}</a>`).join(" · ") +
  `</p>\n`;

let changed = 0;
const skipped = [];

for (const fname of readdirSync(ROOT)) {
  if (!fname.endsWith(".html")) continue;
  const filePath = join(ROOT, fname);
  const html = readFileSync(filePath, "utf8");
  if (html.includes(MARKER)) continue; // ya inyectado
  if (!html.includes('<footer class="sitio">')) continue; // no es página del sitio
  const closes = html.split("</footer>").length - 1;
  if (closes !== 1) {
    skipped.push(`${fname}: ${closes} cierres </footer>, se omite a mano`);
    continue;
  }
  writeFileSync(filePath, html.replace("</footer>", `${bloque}</footer>`));
  changed++;
}

console.log(`cross-links: ${changed} archivos actualizados`);
for (const s of skipped) console.log(`OMITIDO ${s}`);

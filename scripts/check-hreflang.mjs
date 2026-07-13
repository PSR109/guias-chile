#!/usr/bin/env node
// Reciprocidad hreflang: toda página ES que tenga contraparte en en/<mismo
// nombre>.html debe enlazarse a ella con <link rel="alternate" hreflang="en">
// y la página EN debe enlazar de vuelta con hreflang="es". Sin esto Google
// puede indexar ambas versiones como duplicadas en vez de alternativas de
// idioma. Idea equivalente a verify-i18n.mjs de app_panoramas, adaptada a
// HTML estático plano (sin depender de ese repo).
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const EN_DIR = join(ROOT, "en");
const DOMAIN = "https://guias.viajesypanoramas.cl";

function hasAlternate(html, hreflang, href) {
  const re = new RegExp(
    `<link[^>]*rel=["']alternate["'][^>]*hreflang=["']${hreflang}["'][^>]*href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']|` +
    `<link[^>]*hreflang=["']${hreflang}["'][^>]*rel=["']alternate["'][^>]*href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
    "i"
  );
  return re.test(html);
}

if (!existsSync(EN_DIR)) {
  console.log("check-hreflang: OK (no existe carpeta en/, nada que verificar)");
  process.exit(0);
}

const enFiles = readdirSync(EN_DIR).filter((f) => f.toLowerCase().endsWith(".html"));
const errors = [];

for (const name of enFiles) {
  const esPath = join(ROOT, name);
  const enPath = join(EN_DIR, name);
  if (!existsSync(esPath)) {
    errors.push(`en/${name}: existe pero no hay contraparte ES en la raíz (${name})`);
    continue;
  }
  const esHtml = readFileSync(esPath, "utf8");
  const enHtml = readFileSync(enPath, "utf8");
  // El hub de portada (index.html) usa URLs de directorio (/ y /en/), no el
  // nombre de archivo — Google canonicaliza la home sin "index.html".
  const isHome = name === "index.html";
  const esUrl = isHome ? `${DOMAIN}/` : `${DOMAIN}/${name}`;
  const enUrl = isHome ? `${DOMAIN}/en/` : `${DOMAIN}/en/${name}`;

  if (!hasAlternate(esHtml, "en", enUrl)) {
    errors.push(`${name}: falta <link rel="alternate" hreflang="en" href="${enUrl}">`);
  }
  if (!hasAlternate(esHtml, "es", esUrl)) {
    errors.push(`${name}: falta <link rel="alternate" hreflang="es" href="${esUrl}"> (self-reference)`);
  }
  if (!hasAlternate(enHtml, "es", esUrl)) {
    errors.push(`en/${name}: falta <link rel="alternate" hreflang="es" href="${esUrl}">`);
  }
  if (!hasAlternate(enHtml, "en", enUrl)) {
    errors.push(`en/${name}: falta <link rel="alternate" hreflang="en" href="${enUrl}"> (self-reference)`);
  }
}

// Cluster de portada (home hubs ES/EN/PT): el loop de arriba (EN-only) ya cubre
// la reciprocidad ES↔EN de index.html con URLs de directorio; acá verificamos
// además el brazo pt-BR y el x-default en las tres portadas, que ese loop no toca.
const PT_DIR = join(ROOT, "pt");
if (existsSync(join(EN_DIR, "index.html")) && existsSync(PT_DIR)) {
  const esHome = `${DOMAIN}/`, enHome = `${DOMAIN}/en/`, ptHome = `${DOMAIN}/pt/`;
  const homes = [
    ["index.html", join(ROOT, "index.html")],
    ["en/index.html", join(EN_DIR, "index.html")],
    ["pt/index.html", join(PT_DIR, "index.html")],
  ];
  for (const [label, p] of homes) {
    if (!existsSync(p)) { errors.push(`${label}: falta el hub de portada`); continue; }
    const html = readFileSync(p, "utf8");
    if (!hasAlternate(html, "es", esHome)) errors.push(`${label}: falta hreflang="es" href="${esHome}"`);
    if (!hasAlternate(html, "en", enHome)) errors.push(`${label}: falta hreflang="en" href="${enHome}"`);
    if (!hasAlternate(html, "pt-BR", ptHome)) errors.push(`${label}: falta hreflang="pt-BR" href="${ptHome}"`);
    if (!hasAlternate(html, "x-default", esHome)) errors.push(`${label}: falta hreflang="x-default" href="${esHome}"`);
  }
}

if (errors.length) {
  console.error(`check-hreflang: ${errors.length} problema(s):\n`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
console.log(`check-hreflang: OK (${enFiles.length} par(es) ES/EN recíprocos)`);

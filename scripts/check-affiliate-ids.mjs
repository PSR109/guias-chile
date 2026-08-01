#!/usr/bin/env node
// Guarda de regresión: afiliados.js debe seguir teniendo los IDs de partner
// reales de GetYourGuide, Viator y Travelpayouts (marker + links Airalo/Kiwi
// de la fase 2, 2026-08-01). Si alguien los borra por accidente (o un PR
// automático los deja vacíos), esto debe romper el build — son los
// interruptores de todo el revenue de afiliados del sitio.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FILE = join(ROOT, "afiliados.js");

const EXPECTED = {
  "GetYourGuide (gyg_partner)": "BZYZJT4",
  "Viator (viator_pid)": "P00308789",
  "Travelpayouts (tp_marker)": "747702",
  "Airalo eSIM (airalo_esim, link corto verificado)": "airalo.tpx.lt/bReiPeFx",
  "Kiwi.com ES/PT (kiwi_es, promo 8927)": "tp.media/click?shmarker=747702&promo_id=8927",
  "Kiwi.com EN (kiwi_en, promo 3673)": "tp.media/click?shmarker=747702&promo_id=3673",
};

const src = readFileSync(FILE, "utf8");
const missing = Object.entries(EXPECTED).filter(([, id]) => !src.includes(id));

if (missing.length) {
  console.error("check-affiliate-ids: faltan IDs de afiliado esperados en afiliados.js:");
  for (const [label, id] of missing) console.error(` - ${label}: se esperaba "${id}"`);
  process.exit(1);
}
console.log("check-affiliate-ids: OK (GYG, Viator y Travelpayouts presentes en afiliados.js)");

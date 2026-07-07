#!/usr/bin/env node
// Guarda de regresión: afiliados.js debe seguir teniendo los IDs de partner
// reales de GetYourGuide y Viator. Si alguien los borra por accidente (o un
// PR automático los deja vacíos), esto debe romper el build — son los
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
};

const src = readFileSync(FILE, "utf8");
const missing = Object.entries(EXPECTED).filter(([, id]) => !src.includes(id));

if (missing.length) {
  console.error("check-affiliate-ids: faltan IDs de afiliado esperados en afiliados.js:");
  for (const [label, id] of missing) console.error(` - ${label}: se esperaba "${id}"`);
  process.exit(1);
}
console.log("check-affiliate-ids: OK (GYG y Viator presentes en afiliados.js)");

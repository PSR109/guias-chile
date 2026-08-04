#!/usr/bin/env node
// Activa la captura de correo en las guías EN y PT.
//
// Bug que arregla (medido el 2026-08-03): 77 de las 85 páginas del sitio ya
// tenían INYECTADO el markup completo del popup del boletín
// (<!-- growth-popup-2026-07-21 -->, con su <form data-boletin>, su honeypot y
// su .boletin-estado), pero sólo 26 —todas ES de la raíz— cargaban boletin.js.
// El <div id="boletin-popup"> nace con el atributo `hidden` y es boletin.js el
// único que lo muestra: sin ese <script>, en las 51 guías EN/PT el popup no
// aparecía jamás. Markup y CSS construidos, desplegados y capturando CERO
// correos. Faltaba UNA etiqueta <script> por página.
//
// Por qué importa comercialmente: un PDF de viaje se compra semanas después de
// leer la guía. Sin correo, ese lector se pierde en la primera visita.
//
// Idempotente: si la página ya carga boletin.js, no la toca. Sólo actúa sobre
// páginas que YA tienen el popup inyectado (no mete el script donde no hay form).
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MARCA_POPUP = "growth-popup-2026-07-21";

// Se ancla a analytics.js porque está en todas las guías y con la MISMA
// profundidad de ruta que boletin.js, así el prefijo ../ sale solo.
const RE_ANCLA = /<script src="((?:\.\.\/)?)analytics\.js" defer><\/script>/;

const soloCheck = process.argv.includes("--check");
const pendientes = [];
let cambiados = 0;

for (const dir of ["", "en/", "pt/"]) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) continue;
  for (const f of readdirSync(abs).filter((x) => x.endsWith(".html"))) {
    const ruta = join(abs, f);
    const html = readFileSync(ruta, "utf8");
    if (!html.includes(MARCA_POPUP)) continue; // no es página de guía
    if (/<script src="(?:\.\.\/)?boletin\.js"/.test(html)) continue; // ya activo
    const m = RE_ANCLA.exec(html);
    if (!m) {
      pendientes.push(`${dir}${f}: tiene el popup pero no encuentro el ancla analytics.js`);
      continue;
    }
    if (soloCheck) {
      pendientes.push(`${dir}${f}: popup del boletín inerte (falta <script src="${m[1]}boletin.js">)`);
      continue;
    }
    writeFileSync(ruta, html.replace(RE_ANCLA, `${m[0]}\n<script src="${m[1]}boletin.js" defer></script>`), "utf8");
    cambiados++;
  }
}

if (soloCheck) {
  if (pendientes.length) {
    console.error(`activar-boletin --check: ${pendientes.length} página(s) con el popup inerte:`);
    for (const p of pendientes) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  console.log("activar-boletin --check: OK (toda guía con popup carga boletin.js)");
} else {
  for (const p of pendientes) console.error(`  AVISO ${p}`);
  console.log(`activar-boletin: ${cambiados} página(s) activadas.`);
}

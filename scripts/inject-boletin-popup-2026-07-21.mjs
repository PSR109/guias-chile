#!/usr/bin/env node
// Segunda pasada de growth-2026-07-21: el popup no invasivo del newsletter
// (spec: "aparece tras 10s o 50% scroll, nunca invasivo"). boletin.js ya
// maneja #boletin-popup con no-op seguro si no existe -- esto lo agrega.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MARKER = "<!-- growth-popup-2026-07-21 -->";

const COPY = {
  es: { h3: "Recibe los 5 mejores panoramas del fin de semana", p: "Un correo a la semana, directo a tu correo. Sin spam.", placeholder: "tu@correo.com", boton: "Quiero recibirlos", cerrar: "Cerrar" },
  en: { h3: "Get the 5 best weekend trips, every week", p: "One email a week, straight to your inbox. No spam.", placeholder: "you@email.com", boton: "Sign me up", cerrar: "Close" },
  pt: { h3: "Receba os 5 melhores passeios do fim de semana", p: "Um e-mail por semana, direto no seu e-mail. Sem spam.", placeholder: "seu@email.com", boton: "Quero receber", cerrar: "Fechar" },
};

function popupBlock(c, slug) {
  return `${MARKER}
<div class="boletin-popup" id="boletin-popup" hidden>
  <button type="button" class="boletin-cerrar" aria-label="${c.cerrar}">×</button>
  <h3>${c.h3}</h3>
  <p>${c.p}</p>
  <form class="boletin-form" data-boletin data-fuente="guias-${slug}-popup">
    <input type="email" name="email" required placeholder="${c.placeholder}" aria-label="Email" autocomplete="email">
    <input type="text" name="contact_time_x9" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit" class="boton boletin-boton">${c.boton}</button>
  </form>
  <p class="boletin-estado" role="status" hidden></p>
</div>
`;
}

const DIRS = { es: "", en: "en/", pt: "pt/" };
let changed = 0;

for (const [locKey, dir] of Object.entries(DIRS)) {
  const files = readFilesInDir(join(ROOT, dir));
  for (const fname of files) {
    const filePath = join(ROOT, dir, fname);
    const html = readFileSync(filePath, "utf8");
    if (html.includes(MARKER)) continue;
    if (!html.includes("</body>")) continue;
    // Solo paginas de guia (llevan el marcador de la primera pasada) -- evita
    // meter el popup en privacy-policy.html / creditos.html.
    if (!html.includes("<!-- growth-2026-07-21 -->")) continue;
    const slug = fname.replace(/\.html$/, "");
    const block = popupBlock(COPY[locKey], slug);
    const out = html.replace("</body>", `${block}</body>`);
    writeFileSync(filePath, out, "utf8");
    changed++;
  }
}

function readFilesInDir(dir) {
  return readdirSync(dir).filter((f) => f.endsWith(".html"));
}

console.log(`inject-boletin-popup: ${changed} archivo(s) modificados.`);

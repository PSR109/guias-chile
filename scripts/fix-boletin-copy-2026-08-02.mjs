#!/usr/bin/env node
// WP 10K.7.6 (ciclo apps-runner 2026-08-02): el copy del form de captura
// prometia "un correo a la semana" pero la automation real que se va a
// activar es un curso de 5 dias (ver tools/distribucion/email-course-brevo.md).
// Bajo Ley 19.628 el texto del form ES el consentimiento para el envio --
// hay que corregirlo ANTES de activar la automation, no despues.
// Reemplazo de texto puro (no toca el marcador growth-2026-07-21 ni el
// popup-2026-07-21), corre sobre TODOS los .html del repo (raiz + en/ + pt/),
// idempotente (si ya corrio, el string viejo no matchea y no cambia nada).
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const REPLACEMENTS = [
  // Box inline (inject-growth-features) y popup (inject-boletin-popup) — mismo H3/P en ambas pasadas.
  ["Recibe los 5 mejores panoramas del fin de semana", "Los 5 errores que encarecen un viaje por Chile"],
  ["Un correo a la semana con ideas para tu próximo viaje. Sin spam, cancela cuando quieras.", "Curso gratis de 5 días por email. Sin spam, cancela cuando quieras."],
  ["Un correo a la semana, directo a tu correo. Sin spam.", "Curso gratis de 5 días por email. Sin spam."],
  ["Quiero recibirlos", "Quiero el curso gratis"],

  ["Get the 5 best weekend trips, every week", "The 5 mistakes that make a Chile road trip expensive"],
  ["One email a week with ideas for your next trip. No spam, unsubscribe anytime.", "Free 5-day email course. No spam, unsubscribe anytime."],
  ["One email a week, straight to your inbox. No spam.", "Free 5-day email course. No spam."],
  ["Sign me up", "Get the free course"],

  ["Receba os 5 melhores passeios do fim de semana", "Os 5 erros que encarecem uma viagem pelo Chile"],
  ["Um e-mail por semana com ideias para sua próxima viagem. Sem spam, cancele quando quiser.", "Curso grátis de 5 dias por e-mail. Sem spam, cancele quando quiser."],
  ["Um e-mail por semana, direto no seu e-mail. Sem spam.", "Curso grátis de 5 dias por e-mail. Sem spam."],
  ["Quero receber", "Quero o curso grátis"],
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

let filesChanged = 0;
let totalReplacements = 0;

for (const filePath of walk(ROOT)) {
  let html = readFileSync(filePath, "utf8");
  let changedHere = 0;
  for (const [oldStr, newStr] of REPLACEMENTS) {
    if (html.includes(oldStr)) {
      html = html.split(oldStr).join(newStr);
      changedHere++;
    }
  }
  if (changedHere > 0) {
    writeFileSync(filePath, html, "utf8");
    filesChanged++;
    totalReplacements += changedHere;
  }
}

console.log(`fix-boletin-copy: ${filesChanged} archivo(s) modificados, ${totalReplacements} reemplazos.`);

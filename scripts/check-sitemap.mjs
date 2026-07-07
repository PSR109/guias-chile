#!/usr/bin/env node
// sitemap.xml debe ser XML bien formado y NO contener DOCTYPE ni ENTITY —
// misma guardia anti "billion laughs" que ya usa la sonda de salud en
// .github/workflows/growth-agent.yml (ahí se valida el sitemap YA PUBLICADO
// vía curl; aquí se valida el archivo del propio repo ANTES de publicarlo,
// con la misma lógica de rechazo por patrón de bytes seguida de un parseo
// real, portado a Node para no depender de un binario de Python con nombre
// distinto entre Windows/CI).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FILE = join(ROOT, "sitemap.xml");

const raw = readFileSync(FILE);
const text = raw.toString("utf8");

// 1) Guardia anti-billion-laughs: igual que growth-agent.yml, se rechaza
//    cualquier DOCTYPE o ENTITY antes de intentar parsear nada.
if (raw.includes("<!DOCTYPE") || raw.includes("<!ENTITY")) {
  console.error("check-sitemap: DTD/entidades no permitidas en sitemap.xml");
  process.exit(1);
}

// 2) Bien formado: balance de etiquetas con una pila simple (XML real,
//    todo debe cerrarse explícitamente salvo self-closing <tag/>).
function lineAt(str, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (str[i] === "\n") line++;
  return line;
}

const withoutComments = text.replace(/<!--[\s\S]*?-->/g, (m) => " ".repeat(m.length));
const tagRe = /<\?[\s\S]*?\?>|<\/?[a-zA-Z_][\w:.-]*(?:\s+[^<>]*?)?\/?>/g;
const stack = [];
const errors = [];
let m;
while ((m = tagRe.exec(withoutComments))) {
  const tag = m[0];
  if (tag.startsWith("<?")) continue;
  const isClose = tag.startsWith("</");
  const nameMatch = tag.match(/^<\/?([a-zA-Z_][\w:.-]*)/);
  if (!nameMatch) continue;
  const name = nameMatch[1];
  const selfClosing = /\/>\s*$/.test(tag);
  if (isClose) {
    if (stack.length === 0 || stack[stack.length - 1].name !== name) {
      errors.push(`sitemap.xml:${lineAt(withoutComments, m.index)}: cierre </${name}> no coincide`);
    } else {
      stack.pop();
    }
  } else if (!selfClosing) {
    stack.push({ name, line: lineAt(withoutComments, m.index) });
  }
}
for (const open of stack) {
  errors.push(`sitemap.xml:${open.line}: etiqueta <${open.name}> nunca se cierra`);
}

if (errors.length) {
  console.error(`check-sitemap: ${errors.length} problema(s) de XML:\n`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}

// 3) Sanity check de contenido: debe tener urlset con al menos un <url><loc>.
if (!/<urlset[\s>]/.test(text) || !/<url>[\s\S]*?<loc>[^<]+<\/loc>/.test(text)) {
  console.error("check-sitemap: sitemap.xml no tiene la forma esperada (<urlset> con <url><loc>...)");
  process.exit(1);
}

console.log("check-sitemap: OK (sitemap.xml es XML válido, sin DTD/entidades)");

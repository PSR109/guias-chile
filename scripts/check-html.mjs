#!/usr/bin/env node
// Validador HTML ligero, sin dependencias externas: comprueba lo que
// realmente rompe una guía hecha a mano — doctype, charset, título, y
// balance de etiquetas (abrir/cerrar en el orden correcto). No es un
// validador W3C completo, pero atrapa el error real más común (una
// etiqueta sin cerrar) sin depender de un paquete npm ni de red en CI.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { findHtmlFiles } from "./lib/walk-html.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text[i] === "\n") line++;
  return line;
}

function stripNonTagContent(html) {
  // Quita comentarios y el CONTENIDO de <script>/<style> (deja las etiquetas
  // en pie para que el balanceo las siga contando), así el JSON-LD u otro JS
  // con '<'/'>' dentro no confunde el tokenizador de tags.
  return html
    .replace(/<!--[\s\S]*?-->/g, (m) => " ".repeat(m.length))
    .replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (_, a, body, b) => a + " ".repeat(body.length) + b)
    .replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, a, body, b) => a + " ".repeat(body.length) + b);
}

function checkTagBalance(html, file, errors) {
  const clean = stripNonTagContent(html);
  const tagRe = /<!doctype[^>]*>|<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^<>]*?)?\/?>/gi;
  const stack = [];
  let m;
  while ((m = tagRe.exec(clean))) {
    const tag = m[0];
    if (/^<!doctype/i.test(tag)) continue;
    const isClose = tag.startsWith("</");
    const nameMatch = tag.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
    if (!nameMatch) continue;
    const name = nameMatch[1].toLowerCase();
    const selfClosing = /\/>\s*$/.test(tag);
    if (isClose) {
      if (stack.length === 0 || stack[stack.length - 1].name !== name) {
        const openTop = stack.length ? stack[stack.length - 1].name : "(ninguna)";
        errors.push(
          `${file}:${lineAt(clean, m.index)}: cierre </${name}> no coincide con la etiqueta abierta "${openTop}"`
        );
        // Recuperación best-effort: si el nombre existe más abajo en la pila, lo desapilamos hasta ahí.
        const idx = stack.map((s) => s.name).lastIndexOf(name);
        if (idx !== -1) stack.length = idx;
      } else {
        stack.pop();
      }
    } else if (!VOID_ELEMENTS.has(name) && !selfClosing) {
      stack.push({ name, line: lineAt(clean, m.index) });
    }
  }
  for (const open of stack) {
    errors.push(`${file}:${open.line}: etiqueta <${open.name}> nunca se cierra`);
  }
}

function checkStructure(html, file, errors) {
  if (!/^\s*<!doctype html>/i.test(html)) {
    errors.push(`${file}: falta "<!doctype html>" al inicio del archivo`);
  }
  if (!/<html[^>]*\blang=["'][a-z-]+["']/i.test(html)) {
    errors.push(`${file}: falta <html lang="..."> `);
  }
  if (!/<meta[^>]*charset=/i.test(html)) {
    errors.push(`${file}: falta <meta charset="...">`);
  }
  if (!/<title>[^<]+<\/title>/i.test(html)) {
    errors.push(`${file}: falta <title>...</title> con contenido`);
  }
}

const files = findHtmlFiles(ROOT);
if (files.length === 0) {
  console.error("check-html: no se encontró ningún *.html — algo está mal con la búsqueda");
  process.exit(1);
}

const errors = [];
for (const abs of files) {
  const rel = relative(ROOT, abs).replace(/\\/g, "/");
  const html = readFileSync(abs, "utf8");
  checkStructure(html, rel, errors);
  checkTagBalance(html, rel, errors);
}

if (errors.length) {
  console.error(`check-html: ${errors.length} problema(s) en ${files.length} archivo(s):\n`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
console.log(`check-html: OK (${files.length} archivos HTML válidos)`);

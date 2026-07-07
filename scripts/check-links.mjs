#!/usr/bin/env node
// Comprueba que todo href/src RELATIVO (interno) de cada *.html apunte a un
// archivo real del repo. Ignora enlaces externos (http(s)://, //, mailto:,
// tel:), anclas puras (#...) y data: URIs — esos no son responsabilidad de
// este repo.
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";
import { findHtmlFiles } from "./lib/walk-html.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text[i] === "\n") line++;
  return line;
}

function isExternalOrSkippable(href) {
  if (!href) return true;
  if (href.startsWith("#")) return true;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(href)) return true; // http(s)://, //cdn...
  if (/^(mailto|tel|data|javascript):/i.test(href)) return true;
  return false;
}

function resolveTarget(sourceFile, href) {
  const withoutFragment = href.split("#")[0].split("?")[0];
  if (withoutFragment === "") return null; // pure "#anchor" or "?query" already filtered, but be safe
  const sourceDir = dirname(sourceFile);
  let target = resolve(sourceDir, withoutFragment);
  if (target.endsWith("/") || withoutFragment.endsWith("/") || withoutFragment === ".") {
    target = join(target, "index.html");
  } else if (existsSync(target) && statSync(target).isDirectory()) {
    target = join(target, "index.html");
  }
  return target;
}

const files = findHtmlFiles(ROOT);
const errors = [];

for (const abs of files) {
  const rel = relative(ROOT, abs).replace(/\\/g, "/");
  const html = readFileSync(abs, "utf8");
  const attrRe = /\s(?:href|src)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = attrRe.exec(html))) {
    const href = m[1].trim();
    if (isExternalOrSkippable(href)) continue;
    const target = resolveTarget(abs, href);
    if (!target) continue;
    if (!existsSync(target)) {
      errors.push(`${rel}:${lineAt(html, m.index)}: enlace roto "${href}" → no existe ${relative(ROOT, target).replace(/\\/g, "/")}`);
    }
  }
}

if (errors.length) {
  console.error(`check-links: ${errors.length} enlace(s) interno(s) roto(s):\n`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
console.log(`check-links: OK (${files.length} archivos revisados)`);

// Utilidad compartida: lista todos los *.html del repo (raíz + subcarpetas
// como en/), ignorando .git y node_modules si algún día existieran.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export function findHtmlFiles(root) {
  const out = [];
  const skip = new Set([".git", "node_modules", ".github"]);
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      if (skip.has(name)) continue;
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (name.toLowerCase().endsWith(".html")) {
        out.push(full);
      }
    }
  })(root);
  return out.sort();
}

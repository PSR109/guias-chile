// WP 10K.5.11: compila SOLO el kit `chiloe-5d-es` sin tocar archivos compartidos.
//
// El pipeline real (compile-html.mjs + build-pdf.mjs) importa `KITS` desde
// kits.config.mjs — archivo compartido que este WP NO puede editar. Este driver
// reutiliza el código real del pipeline sin copiarlo: lee cada script, cambia en
// memoria el import de config por el archivo local kits.config.chiloe-5d-es.mjs,
// lo escribe como archivo temporal EN ESTE MISMO DIRECTORIO (para que resuelvan
// los imports relativos ./lib/*, ../assets, ../../img) y lo importa. El temporal
// se borra al terminar, falle o no.
//
// Salidas (idénticas a las del pipeline cuando el integrador cablee el kit):
//   build/chiloe-5d-es-es.html   (el id ya termina en -es: ${id}-${lang})
//   dist/chiloe-5d-es-es.pdf     (A4 + metadata ES embebida vía pdf-lib)
//
// Uso: node build-chiloe-5d-es.mjs
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SHARED_IMPORT = "from './kits.config.mjs'";
const LOCAL_IMPORT = "from './kits.config.chiloe-5d-es.mjs'";

async function runPatched(script) {
  const src = readFileSync(join(HERE, script), 'utf8');
  if (!src.includes(SHARED_IMPORT)) {
    throw new Error(`${script}: no se encontró el import de kits.config.mjs — ¿cambió el pipeline?`);
  }
  const tmp = join(HERE, `_tmp-${script}`);
  writeFileSync(tmp, src.replace(SHARED_IMPORT, LOCAL_IMPORT));
  try {
    await import(pathToFileURL(tmp).href);
  } finally {
    rmSync(tmp, { force: true });
  }
}

await runPatched('compile-html.mjs');
await runPatched('build-pdf.mjs');
await runPatched('make-mockups.mjs');
console.log('OK: build/chiloe-5d-es-es.html + dist/chiloe-5d-es-es.pdf + mockups-out/chiloe-5d-es-*.png');

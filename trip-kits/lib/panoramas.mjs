import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
// Supuesto: checkout hermano de app_panoramas junto a guias-chile
// (.../guias-chile/trip-kits/lib -> ../../../app_panoramas/dist/data/panoramas.json).
// Override con PANORAMAS_DATA_PATH si el checkout vive en otro lado.
const DATA_PATH = process.env.PANORAMAS_DATA_PATH
  ? resolve(process.env.PANORAMAS_DATA_PATH)
  : resolve(HERE, '..', '..', '..', 'app_panoramas', 'dist', 'data', 'panoramas.json');
let cache = null;

function load() {
  cache ??= JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  return cache;
}

// lang='es' usa descripcion_es (catalogo Panoramas es ES-primary; verificado 2026-08-01:
// los POIs de Ñuble traen descripcion_es editorial completa). Default 'en' = comportamiento gen-1.
// exclude: nombres exactos a omitir (dedup editorial — el catalogo repite el mismo complejo
// con nombres distintos, ej. 3 fichas de Termas de Chillán y 2 del centro de esquí).
const score = (p, field = 'descripcion_en') =>
  (Array.isArray(p.bundle_tags) && p.bundle_tags.includes('imperdible') ? 10 : 0) +
  (p.photo_url ? 1 : 0) +
  (p[field] && p[field].length > 120 ? 1 : 0);

export function topPois({ comunas, limit = 8, lang = 'en', exclude = [] }) {
  const field = lang === 'es' ? 'descripcion_es' : 'descripcion_en';
  const set = new Set(comunas);
  const skip = new Set(exclude);
  const hits = load().filter((p) => set.has(p.comuna) && p[field] && !skip.has(p.nombre));
  hits.sort((a, b) => score(b, field) - score(a, field));
  const seen = new Set();
  const out = [];
  for (const p of hits) {
    if (seen.has(p.nombre)) continue;
    seen.add(p.nombre);
    out.push({
      nombre: p.nombre,
      descripcion: p[field],
      precioClp: p.precio_referencia_clp ?? 0,
      horas: p.duracion_horas ?? null,
      categoria: p.categoria_slug ?? '',
    });
    if (out.length >= limit) break;
  }
  return out;
}

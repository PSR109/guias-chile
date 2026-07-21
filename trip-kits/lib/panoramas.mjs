import { readFileSync } from 'node:fs';

const DATA_PATH = 'C:/Creador de apps/app_panoramas/dist/data/panoramas.json';
let cache = null;

function load() {
  cache ??= JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  return cache;
}

const score = (p) =>
  (Array.isArray(p.bundle_tags) && p.bundle_tags.includes('imperdible') ? 10 : 0) +
  (p.photo_url ? 1 : 0) +
  (p.descripcion_en && p.descripcion_en.length > 120 ? 1 : 0);

export function topPois({ comunas, limit = 8 }) {
  const set = new Set(comunas);
  const hits = load().filter((p) => set.has(p.comuna) && p.descripcion_en);
  hits.sort((a, b) => score(b) - score(a));
  const seen = new Set();
  const out = [];
  for (const p of hits) {
    if (seen.has(p.nombre)) continue;
    seen.add(p.nombre);
    out.push({
      nombre: p.nombre,
      descripcion: p.descripcion_en,
      precioClp: p.precio_referencia_clp ?? 0,
      horas: p.duracion_horas ?? null,
      categoria: p.categoria_slug ?? '',
    });
    if (out.length >= limit) break;
  }
  return out;
}

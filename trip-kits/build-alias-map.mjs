#!/usr/bin/env node
// Generador de trip-kits/alias-map.json — la tabla de alias AUTORITATIVA entre
// cada CTA de compra publicado en el sitio y el producto que debería vender.
//
// Por qué existe: el 2026-08-02 se midió que la mayoría de los CTAs del sitio
// apuntaban a Payhip, y Payhip NO PUEDE COBRAR (PayPal de la cuenta caído,
// gate #77). Cada uno de esos enlaces es una venta imposible. Al repuntarlos a
// Gumroad se pisó una trampa que ya costó plata: `santiago-cajon-4d` en Gumroad
// es LA VERSIÓN EN INGLÉS, y `chiloe-5d-es` NO EXISTE (404). Mandar a un lector
// chileno a un PDF en inglés es peor que no venderle.
//
// Fuentes de verdad (todas locales, sin red):
//   - las propias páginas *.html del repo (qué se está publicando HOY)
//   - trip-kits/kits.config.mjs         → KITS[].lang y KITS[].gumroadPermalink
//   - trip-kits/dist/*.pdf              → el archivo revela el idioma real
//   - trip-kits/gumroad-live.json       → qué está LIVE en Gumroad y en qué idioma
//
// Uso:  node trip-kits/build-alias-map.mjs        (escribe trip-kits/alias-map.json)
//       node trip-kits/build-alias-map.mjs --check (no escribe; sale 1 si está stale)
//
// El guard scripts/check-cta-checkout.mjs consume este JSON en CI.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { findHtmlFiles } from "../scripts/lib/walk-html.mjs";
import { KITS, PAYHIP_URLS } from "./kits.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KITS_DIR = __dirname;
const ROOT = join(__dirname, "..");
const OUT = join(KITS_DIR, "alias-map.json");

const catalogo = JSON.parse(readFileSync(join(KITS_DIR, "gumroad-live.json"), "utf8"));
const LIVE = catalogo.productos;

// Política de idioma. ES es tolerancia cero (la trampa ya pagada). PT no tiene
// catálogo propio: cae deliberadamente al kit EN mientras no exista uno PT.
const POLITICA = {
  es: ["es"],
  en: ["en"],
  pt: ["pt", "en"],
};

// Kits que viven fuera de KITS (shape custom, ver trip-kits/NOTES.md).
const KITS_EXTERNOS = {
  "malalcahuello-conguillio-4d-es": { lang: "es", gumroadPermalink: "malalcahuello-conguillio-4d-es", priceUsd: 12.9 },
  "malalcahuello-conguillio-4d-en": { lang: "en", gumroadPermalink: "malalcahuello-conguillio-4d-en", priceUsd: 12.9 },
};

const porId = new Map();
for (const k of KITS) porId.set(k.id, k);
for (const [id, k] of Object.entries(KITS_EXTERNOS)) if (!porId.has(id)) porId.set(id, { id, ...k });

// --- idioma real del kit, según el PDF que existe en dist/ -------------------
const pdfs = existsSync(join(KITS_DIR, "dist")) ? readdirSync(join(KITS_DIR, "dist")).filter((f) => f.endsWith(".pdf")) : [];
function pdfDeKit(id) {
  // dist usa dos convenciones: "<id>-<lang>.pdf" y "<id>.pdf" (cuando el id ya
  // termina en -es). Se prueban ambas y se devuelve la primera que exista.
  for (const cand of [`${id}-es.pdf`, `${id}-en.pdf`, `${id}.pdf`]) {
    if (pdfs.includes(cand)) return cand;
  }
  return null;
}
function idiomaDesdePdf(file) {
  if (!file) return null;
  if (file.endsWith("-en.pdf")) return "en";
  if (file.endsWith("-es.pdf")) return "es";
  return null;
}

function idiomaDelKit(id) {
  const k = porId.get(id);
  const porPdf = idiomaDesdePdf(pdfDeKit(id));
  // KITS sin `lang` son los gen-1, todos en inglés (verificado contra dist/*.pdf
  // y contra el <og:title> del producto Gumroad el 2026-08-02).
  const porConfig = k ? k.lang ?? "en" : null;
  return porConfig ?? porPdf ?? (id.endsWith("-es") ? "es" : id.endsWith("-en") ? "en" : null);
}

function slugEsperado(id) {
  const k = porId.get(id);
  return k?.gumroadPermalink ?? id;
}

// --- escaneo de las páginas publicadas --------------------------------------
const RE_COMPRA = /https:\/\/(?:payhip\.com\/b\/([A-Za-z0-9]+)|([a-z0-9]+)\.gumroad\.com\/l\/([A-Za-z0-9_-]+))(\?[^"'\s]*)?/g;

function idiomaDePagina(rel) {
  if (rel.startsWith("en/")) return "en";
  if (rel.startsWith("pt/")) return "pt";
  return "es";
}

// Enlaces de TIENDA (no de producto): "ver todos los trip kits".
const RE_TIENDA = /https:\/\/(?:payhip\.com\/(?!b\/)[A-Za-z0-9_-]+|patricio358\.gumroad\.com\/(?!l\/))(?:\?[^"'\s]*)?(?=["'\s>])/g;

const filas = [];
const tiendas = [];
for (const abs of findHtmlFiles(ROOT)) {
  const rel = relative(ROOT, abs).split("\\").join("/");
  if (rel.startsWith("trip-kits/")) continue; // artefactos de build, no se publican
  const html = readFileSync(abs, "utf8");
  for (const m of html.matchAll(RE_TIENDA)) {
    if (m[0].includes("/b/") || m[0].includes("/l/")) continue; // es producto, no tienda
    tiendas.push({
      pagina: rel,
      idioma_pagina: idiomaDePagina(rel),
      url_actual: m[0],
      pasarela: m[0].includes("payhip") ? "payhip" : "gumroad",
      cobra: !m[0].includes("payhip"),
    });
  }
  const porKit = new Map();
  for (const m of html.matchAll(RE_COMPRA)) {
    const url = m[0];
    const qs = m[4] ?? "";
    const camp = /utm_campaign=([A-Za-z0-9_-]+)/.exec(qs)?.[1] ?? null;
    const gumSlug = m[3] ?? null;
    const kitId = camp ?? gumSlug ?? null;
    if (!kitId) continue;
    const acc = porKit.get(kitId) ?? { payhip: null, gumroad: null, gumroadSlug: null };
    if (m[1]) acc.payhip = url;
    else {
      acc.gumroad = url;
      acc.gumroadSlug = gumSlug;
    }
    porKit.set(kitId, acc);
  }
  for (const [kitId, acc] of porKit) {
    const idiomaPagina = idiomaDePagina(rel);
    const idiomaKit = idiomaDelKit(kitId);
    const esperado = slugEsperado(kitId);
    const live = Boolean(LIVE[esperado]);
    const idiomaProductoActual = acc.gumroadSlug ? LIVE[acc.gumroadSlug]?.idioma ?? null : null;
    const permitidos = POLITICA[idiomaPagina] ?? [idiomaPagina];
    const checkout = acc.gumroad ? "gumroad" : acc.payhip ? "payhip" : "ninguno";
    const idiomaCoincide = acc.gumroad ? permitidos.includes(idiomaProductoActual) : permitidos.includes(idiomaKit);

    let estado;
    let accion;
    if (checkout === "payhip") {
      estado = live && permitidos.includes(LIVE[esperado].idioma) ? "payhip_muerto_swap_pendiente" : "payhip_muerto_sin_producto";
      accion =
        estado === "payhip_muerto_swap_pendiente"
          ? `swap ya posible: apuntar a ${esperado}`
          : `publicar en Gumroad el kit ${kitId} con permalink ${esperado} (idioma ${idiomaKit})`;
    } else if (!idiomaCoincide) {
      estado = "idioma_mismatch";
      accion = `página ${idiomaPagina} vendiendo producto ${idiomaProductoActual}; publicar el kit ${idiomaPagina} y repuntar`;
    } else {
      estado = "ok";
      accion = null;
    }

    filas.push({
      pagina: rel,
      idioma_pagina: idiomaPagina,
      payhip_url_actual: acc.payhip,
      kit_id: kitId,
      idioma_del_kit: idiomaKit,
      gumroad_slug_esperado: esperado,
      gumroad_live: live,
      // --- contexto operativo (fuera del schema mínimo pedido) ---
      checkout_actual: checkout,
      gumroad_url_actual: acc.gumroad,
      gumroad_slug_actual: acc.gumroadSlug,
      idioma_producto_actual: idiomaProductoActual,
      idioma_coincide: idiomaCoincide,
      pdf_en_dist: pdfDeKit(kitId),
      payhip_url_config: PAYHIP_URLS[kitId] ?? null,
      estado,
      accion,
    });
  }
}

filas.sort((a, b) => a.pagina.localeCompare(b.pagina) || a.kit_id.localeCompare(b.kit_id));

// --- qué falta publicar, agrupado por slug ----------------------------------
// NO existe dato de tráfico por página de guias-chile en el repo: el propio
// trip-kits/NOTES.md lo dice ("sin datos de tráfico propios de trip-kits, que
// no existe todavía") y el export GSC del monorepo (docs/TRIAGE-SEO-GSC-2026-07-28.md)
// es de viajesypanoramas.cl y sólo trae fichas /panorama/. Por eso el orden de
// esta cola usa un proxy DECLARADO, no un número inventado:
//   1º nº de páginas publicadas que quedan sin checkout por falta de ese slug
//   2º señal de demanda documentada en el repo (abajo)
//   3º precio del kit
const SENAL_DEMANDA = {
  // Textual, tal como está documentado en trip-kits/NOTES.md y agente/ESTADO.md.
  "valle-elqui-4d-es": 'agente/ESTADO.md: "La Serena... alto volumen"',
  "torres-del-paine-5d-es": "3 guías ES (Torres del Paine, Puerto Natales, Punta Arenas) dependen de este único kit",
  "chiloe-5d-es": "cluster Chiloé/Lagos: 2 guías ES lo enlazan hoy + 3 más (frutillar, puerto-varas, saltos-del-petrohue) hoy mal apuntadas al kit EN",
};
const publicar = new Map();
for (const f of filas) {
  if (f.gumroad_live) continue;
  const cur = publicar.get(f.gumroad_slug_esperado) ?? {
    gumroad_slug_esperado: f.gumroad_slug_esperado,
    kit_id: f.kit_id,
    idioma_del_kit: f.idioma_del_kit,
    pdf_en_dist: f.pdf_en_dist,
    precio_usd: porId.get(f.kit_id)?.priceUsd ?? null,
    listing: ["json", "md"].map((e) => `trip-kits/listings/${f.kit_id}.${e}`).find((p) => existsSync(join(ROOT, p))) ?? null,
    senal_demanda: SENAL_DEMANDA[f.gumroad_slug_esperado] ?? null,
    paginas_que_lo_necesitan: [],
  };
  cur.paginas_que_lo_necesitan.push(f.pagina);
  publicar.set(f.gumroad_slug_esperado, cur);
}
const publicarLista = [...publicar.values()]
  .sort(
    (a, b) =>
      b.paginas_que_lo_necesitan.length - a.paginas_que_lo_necesitan.length ||
      Number(Boolean(b.senal_demanda)) - Number(Boolean(a.senal_demanda)) ||
      (b.precio_usd ?? 0) - (a.precio_usd ?? 0) ||
      a.gumroad_slug_esperado.localeCompare(b.gumroad_slug_esperado),
  )
  .map((p, i) => ({ prioridad: i + 1, ...p }));

const salida = {
  _meta: {
    generado: "2026-08-02",
    generador: "node trip-kits/build-alias-map.mjs",
    que_es: "Tabla autoritativa CTA→producto de todas las páginas publicadas (ES/EN/PT). La consume el gate scripts/check-cta-checkout.mjs.",
    regenerar_cuando: "se publique un producto nuevo en Gumroad, se agregue una guía, o se toque cualquier CTA de compra",
    contexto: "Payhip no puede cobrar (gate #77, PayPal de la cuenta caído): TODO enlace payhip de esta tabla es una venta imposible.",
    trafico: "NO hay dato de tráfico por página de guias-chile en el repo (trip-kits/NOTES.md lo dice explícito; el export GSC de docs/ es de viajesypanoramas.cl y sólo trae fichas /panorama/). El orden de publicar_en_gumroad usa un proxy declarado: nº de páginas bloqueadas > señal de demanda documentada > precio.",
  },
  politica_idioma: {
    reglas: POLITICA,
    por_que: "es→es es tolerancia cero: mandar a un lector chileno a un PDF en inglés convierte peor que no tener CTA. pt cae a en de forma declarada porque no existe ningún kit en portugués (0 PDFs pt en trip-kits/dist).",
  },
  deuda_idioma_es: [
    {
      paginas: ["colchagua-pichilemu.html"],
      producto_actual: "valpo-wine-4d",
      idioma_producto: "en",
      fix: "publicar valparaiso-vina-3d-es y repuntar",
      motivo_de_no_revertir: "revertir a Payhip no arregla el idioma (el producto Payhip de esa campaña es el MISMO kit EN) y encima mata el checkout.",
    },
    {
      paginas: ["frutillar.html", "puerto-varas.html", "saltos-del-petrohue.html"],
      producto_actual: "chiloe-lakes-5d",
      idioma_producto: "en",
      fix: "publicar chiloe-5d-es y repuntar (chiloe.html y puerto-montt.html ya apuntan a ese kit ES vía Payhip)",
      motivo_de_no_revertir: "ídem: el Payhip de chiloe-lakes-5d es el mismo kit EN.",
    },
    {
      paginas: ["rapa-nui.html"],
      producto_actual: "rapa-nui-4d",
      idioma_producto: "en",
      fix: "no existe kit ES de Rapa Nui (no hay PDF en dist/): hay que PRODUCIRLO, no sólo publicarlo",
      motivo_de_no_revertir: "ídem.",
    },
  ],
  publicar_en_gumroad: publicarLista,
  tiendas,
  ctas: filas,
};

// `trip-kits/dist/` está en .gitignore: en CI no existe. El único campo que
// depende de ese directorio es `pdf_en_dist` (informativo — el idioma del kit
// sale de kits.config.mjs, que sí está versionado). Cuando dist no está, se
// compara todo lo demás en lugar de saltarse el gate entero: un check que se
// salta se lee igual que uno que pasa, y eso ya costó un incidente.
const HAY_DIST = pdfs.length > 0;
const sinArtefactos = (o) => JSON.parse(JSON.stringify(o), (k, v) => (k === "pdf_en_dist" ? undefined : v));

if (process.argv.includes("--check")) {
  const actual = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : null;
  const a = JSON.stringify(HAY_DIST ? actual : sinArtefactos(actual), null, 2);
  const b = JSON.stringify(HAY_DIST ? salida : sinArtefactos(salida), null, 2);
  if (a !== b) {
    console.error("alias-map.json está desactualizado. Corre: node trip-kits/build-alias-map.mjs");
    process.exit(1);
  }
  console.log(`alias-map.json: al día${HAY_DIST ? "" : " (sin trip-kits/dist/: no se comparó pdf_en_dist)"}`);
} else {
  writeFileSync(OUT, JSON.stringify(salida, null, 2) + "\n");
  console.log(`alias-map.json: ${filas.length} CTAs en ${new Set(filas.map((f) => f.pagina)).size} páginas`);
  console.log(`  · con checkout Gumroad vivo:  ${filas.filter((f) => f.checkout_actual === "gumroad").length}`);
  console.log(`  · atrapados en Payhip (muerto): ${filas.filter((f) => f.checkout_actual === "payhip").length}`);
  console.log(`  · mismatch de idioma:          ${filas.filter((f) => !f.idioma_coincide).length}`);
  console.log(`  · slugs por publicar:          ${publicarLista.length}`);
}

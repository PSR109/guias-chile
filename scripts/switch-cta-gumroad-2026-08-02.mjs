#!/usr/bin/env node
// Swap de CTAs de compra Payhip → Gumroad, SOLO donde es seguro.
//
// Contexto (medido en producción el 2026-08-02): Payhip NO PUEDE COBRAR — el
// PayPal de la cuenta está caído (gate #77). Todo CTA que apunta a Payhip es
// una venta imposible. Gumroad es el único checkout vivo.
//
// TRAMPA YA PAGADA, no repetirla: `santiago-cajon-4d` en Gumroad ES LA VERSIÓN
// EN INGLÉS y `chiloe-5d-es` NO EXISTE (404). Vender un PDF en inglés a un
// lector chileno convierte peor que no venderle nada. Por eso este script sólo
// toca una página cuando el producto Gumroad está LIVE **y** su idioma cumple
// la política declarada en trip-kits/alias-map.json → politica_idioma
// (es→es estricto; pt→en permitido mientras no exista catálogo pt).
//
// A diferencia de los scripts de swap anteriores, éste es autocontenido: no
// depende de tools/chrome/*.json del monorepo (guias-chile es su propio repo y
// su CI no ve esos archivos). Fuente de verdad: trip-kits/gumroad-live.json.
//
// Idempotente por marcador (mismo patrón que los inject-*): una página con el
// marcador ya procesada no se vuelve a tocar.
//
// Uso:  node scripts/switch-cta-gumroad-2026-08-02.mjs [--dry]
// Después: node trip-kits/build-alias-map.mjs && node scripts/check-cta-checkout.mjs
//
// Volver a correrlo cada vez que se publique un producto nuevo en Gumroad:
// arregla automáticamente las páginas que pasen a tener producto en su idioma.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { findHtmlFiles } from "./lib/walk-html.mjs";
import { KITS } from "../trip-kits/kits.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DRY = process.argv.includes("--dry");
const MARKER = "cta-checkout-2026-08-02";

const catalogo = JSON.parse(readFileSync(join(ROOT, "trip-kits/gumroad-live.json"), "utf8"));
const LIVE = catalogo.productos;
const TIENDA = catalogo.tienda.url;

const POLITICA = { es: ["es"], en: ["en"], pt: ["pt", "en"] };
const PERMALINK = new Map(KITS.map((k) => [k.id, k.gumroadPermalink ?? k.id]));

const MIRROR = { es: "también en", en: "also on", pt: "também no" };
const TIENDA_TXT = {
  es: ["Pago seguro con PayPal · descarga inmediata", "Pago seguro con tarjeta · descarga inmediata"],
  en: ["Secure PayPal checkout · instant download", "Secure card checkout · instant download"],
  pt: ["Pagamento seguro com PayPal · download imediato", "Pagamento seguro com cartão · download imediato"],
};

const idiomaDePagina = (rel) => (rel.startsWith("en/") ? "en" : rel.startsWith("pt/") ? "pt" : "es");

const cambios = [];
const omitidos = [];

for (const abs of findHtmlFiles(ROOT)) {
  const rel = relative(ROOT, abs).split("\\").join("/");
  if (rel.startsWith("trip-kits/")) continue;
  let html = readFileSync(abs, "utf8");
  if (html.includes(MARKER)) continue; // ya procesada
  const lang = idiomaDePagina(rel);
  const permitidos = POLITICA[lang];
  let tocado = false;

  // ---- 1. CTA de producto: payhip primario → gumroad primario + mirror -----
  for (const m of [...html.matchAll(/https:\/\/payhip\.com\/b\/([A-Za-z0-9]+)\?([^"'\s]*)/g)]) {
    const payhipHref = m[0];
    const kitId = /utm_campaign=([A-Za-z0-9_-]+)/.exec(m[2])?.[1];
    if (!kitId) continue;
    const slug = PERMALINK.get(kitId) ?? kitId;
    const prod = LIVE[slug];
    if (!prod) {
      omitidos.push(`${rel}: ${kitId} → ${slug} no está LIVE en Gumroad (se deja el CTA muerto, no se inventa producto)`);
      continue;
    }
    const gumHref = `${prod.url}?utm_source=guias&utm_medium=cta&utm_campaign=${kitId}`;
    if (html.includes(gumHref)) continue; // ya swapeada (este payhip es el mirror secundario)
    if (!permitidos.includes(prod.idioma)) {
      omitidos.push(`${rel} (${lang}): ${slug} está en ${prod.idioma} — política de idioma lo bloquea`);
      continue;
    }
    html = html.replace(payhipHref, gumHref);
    html = html.replace(
      /(<span class="kit-price">[^<]*<\/span>)/,
      `$1 <span class="kit-mirror">· ${MIRROR[lang]} <a href="${payhipHref}" rel="sponsored noopener" target="_blank">Payhip</a></span>`,
    );
    tocado = true;
    cambios.push({ pagina: rel, tipo: "producto", kit: kitId, destino: gumHref });
  }

  // ---- 2. CTA de tienda: payhip.com/<tienda> → tienda Gumroad --------------
  // La tienda es un enlace de catálogo, no de producto: no tiene idioma propio.
  // Hoy apunta a una tienda que no puede cobrar; el copy además promete PayPal.
  if (html.includes("https://payhip.com/viajesypanoramas")) {
    const destino = `${TIENDA}?utm_source=guias&utm_medium=cta&utm_campaign=tienda`;
    html = html.split("https://payhip.com/viajesypanoramas").join(destino);
    const [viejo, nuevo] = TIENDA_TXT[lang];
    if (html.includes(viejo)) html = html.replace(viejo, nuevo);
    else omitidos.push(`${rel}: copy de pasarela no coincide con el esperado ("${viejo}") — revisar a mano`);
    tocado = true;
    cambios.push({ pagina: rel, tipo: "tienda", kit: null, destino });
  }

  if (tocado) {
    // Marcador de idempotencia, mismo estilo que los inject-*.
    html = html.replace("</body>", `  <!-- ${MARKER} -->\n</body>`);
    if (!DRY) writeFileSync(abs, html);
  }
}

console.log(`${DRY ? "[dry] " : ""}swap CTAs: ${cambios.length} enlaces en ${new Set(cambios.map((c) => c.pagina)).size} páginas`);
for (const c of cambios) console.log(`  ${c.pagina} [${c.tipo}] → ${c.destino}`);
if (omitidos.length) {
  console.log(`\nOMITIDOS (a propósito) — ${omitidos.length}:`);
  for (const o of omitidos) console.log(`  ${o}`);
}

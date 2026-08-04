#!/usr/bin/env node
// GATE DE CI — ningún CTA de compra puede llevar a un producto muerto ni a un
// producto en otro idioma que el de la página.
//
// Por qué existe (incidente real, 2026-08-02): el sitio publicaba 60 CTAs de
// compra hacia Payhip, y Payhip NO PUEDE COBRAR (PayPal de la cuenta caído,
// gate #77) — cada clic era una venta imposible. Al migrarlos a Gumroad se
// pisó la segunda trampa: `santiago-cajon-4d` en Gumroad es la versión EN
// INGLÉS y `chiloe-5d-es` devuelve 404. Un lector chileno mandado a un PDF en
// inglés convierte peor que uno que no ve CTA. Este gate es lo que impide que
// eso vuelva a entrar al sitio.
//
// Reglas (todas rompen el build):
//   1. Enlace a producto Gumroad cuyo slug NO está LIVE en
//      trip-kits/gumroad-live.json  → venta imposible (404).
//   2. Enlace a producto Gumroad cuyo idioma no cumple la política de idioma
//      de la página (es→es estricto, en→en, pt→pt|en) y que no está declarado
//      como deuda conocida en trip-kits/alias-map.json → deuda_idioma_es.
//   3. CTA primario en Payhip existiendo ya producto Gumroad LIVE y del idioma
//      correcto para ese kit → regresión del swap.
//   4. Enlace a la TIENDA de Payhip → esa tienda no cobra y la de Gumroad sí.
//   5. trip-kits/alias-map.json desincronizado con lo que publican las páginas.
//   6. `<html lang>` que no coincide con la carpeta (en/, pt/, raíz=es): si eso
//      se rompe, toda la inferencia de idioma de este gate es humo.
//
// Los enlaces Payhip SECUNDARIOS ("· también en Payhip") se cuentan y se avisan,
// pero no rompen: son el espejo reversible, no el camino de compra principal.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { findHtmlFiles } from "./lib/walk-html.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const catalogo = JSON.parse(readFileSync(join(ROOT, "trip-kits/gumroad-live.json"), "utf8"));
const alias = JSON.parse(readFileSync(join(ROOT, "trip-kits/alias-map.json"), "utf8"));
const LIVE = catalogo.productos;
const POLITICA = alias.politica_idioma.reglas;

// Deuda de idioma declarada y con fix escrito. Es la única puerta de escape:
// si alguien agrega un mismatch nuevo sin documentarlo, el build cae.
const DEUDA = new Set();
for (const d of alias.deuda_idioma_es ?? []) for (const p of d.paginas) DEUDA.add(`${p}|${d.producto_actual}`);

// kit_id → slug esperado, tal como lo resolvió el generador del alias-map.
const ESPERADO = new Map(alias.ctas.map((c) => [c.kit_id, c.gumroad_slug_esperado]));

const RE_GUMROAD = /https:\/\/[a-z0-9]+\.gumroad\.com\/l\/([A-Za-z0-9_-]+)(\?[^"'\s]*)?/g;
const RE_PAYHIP = /https:\/\/payhip\.com\/b\/([A-Za-z0-9]+)(\?[^"'\s]*)?/g;
const RE_PAYHIP_TIENDA = /https:\/\/payhip\.com\/(?!b\/)[A-Za-z0-9_-]+/g;

const idiomaDePagina = (rel) => (rel.startsWith("en/") ? "en" : rel.startsWith("pt/") ? "pt" : "es");

const errores = [];
const avisos = [];
let gumroadOk = 0;
let payhipEspejo = 0;
const paresEnHtml = new Set();

for (const abs of findHtmlFiles(ROOT)) {
  const rel = relative(ROOT, abs).split("\\").join("/");
  if (rel.startsWith("trip-kits/")) continue; // artefactos de build, no se publican
  const html = readFileSync(abs, "utf8");
  const lang = idiomaDePagina(rel);
  const permitidos = POLITICA[lang] ?? [lang];

  // --- regla 6: la carpeta y el <html lang> tienen que decir lo mismo -------
  const declarado = /<html[^>]*\blang="([a-zA-Z-]+)"/.exec(html)?.[1]?.slice(0, 2).toLowerCase();
  if (declarado && declarado !== lang) {
    errores.push(`${rel}: <html lang="${declarado}"> no coincide con la carpeta (esperado "${lang}")`);
  }

  // --- regla 4: tienda Payhip ----------------------------------------------
  for (const m of html.matchAll(RE_PAYHIP_TIENDA)) {
    errores.push(`${rel}: enlace a la tienda Payhip (${m[0]}) — Payhip no puede cobrar (gate #77). Usar ${catalogo.tienda.url}`);
  }

  // --- reglas 1 y 2: productos Gumroad -------------------------------------
  for (const m of html.matchAll(RE_GUMROAD)) {
    const slug = m[1];
    const prod = LIVE[slug];
    if (!prod) {
      errores.push(`${rel}: enlace de compra a Gumroad "${slug}" que NO está en trip-kits/gumroad-live.json (404 = venta imposible)`);
      continue;
    }
    if (!permitidos.includes(prod.idioma)) {
      const kit = /utm_campaign=([A-Za-z0-9_-]+)/.exec(m[2] ?? "")?.[1] ?? slug;
      if (DEUDA.has(`${rel}|${slug}`)) {
        avisos.push(`${rel} (${lang}) vende "${slug}" en ${prod.idioma} — deuda DECLARADA en alias-map.json (kit ${kit})`);
      } else {
        errores.push(
          `${rel} (página ${lang}): vende "${slug}", que está en ${prod.idioma}. Página en idioma X sólo vende producto en idioma X ` +
            `(política: ${permitidos.join("|")}). Si es deliberado y temporal, declararlo en trip-kits/alias-map.json → deuda_idioma_es.`,
        );
      }
    } else {
      gumroadOk++;
    }
    const kitId = /utm_campaign=([A-Za-z0-9_-]+)/.exec(m[2] ?? "")?.[1] ?? slug;
    paresEnHtml.add(`${rel}|${kitId}`);
  }

  // --- regla 3: Payhip primario con Gumroad disponible ---------------------
  for (const m of html.matchAll(RE_PAYHIP)) {
    const kitId = /utm_campaign=([A-Za-z0-9_-]+)/.exec(m[2] ?? "")?.[1];
    if (!kitId) {
      errores.push(`${rel}: enlace Payhip sin utm_campaign (${m[0]}) — no se puede saber qué kit vende`);
      continue;
    }
    paresEnHtml.add(`${rel}|${kitId}`);
    const esEspejo = /kit-mirror[^>]*>[^<]*<a href="https:\/\/payhip\.com\/b\/[A-Za-z0-9]+/.test(html) && html.indexOf('class="kit-mirror"') < html.indexOf(m[0]);
    const slug = ESPERADO.get(kitId) ?? kitId;
    const prod = LIVE[slug];
    if (prod && permitidos.includes(prod.idioma) && !esEspejo) {
      errores.push(
        `${rel}: CTA primario en Payhip para "${kitId}" cuando ${slug} está LIVE en Gumroad y en el idioma correcto. ` +
          `Correr: node scripts/switch-cta-gumroad-2026-08-02.mjs`,
      );
    } else if (esEspejo) {
      payhipEspejo++;
    } else {
      // Antes esto era un AVISO y el build pasaba igual. Eso dejó vivo en prod
      // durante días el CTA de en/malalcahuello-conguillio.html → payhip.com/b/Qdhbe
      // (403 tras challenge de Cloudflare): conversión matemáticamente 0% y encima
      // quema la confianza del lector que hizo clic. Payhip NO COBRA en ninguna
      // variante (gate #77), así que un CTA primario a Payhip es siempre una venta
      // imposible, exista o no el gemelo en Gumroad. Es ERROR, no aviso.
      errores.push(
        `${rel}: CTA primario en Payhip para "${kitId}" y Payhip no cobra (gate #77) = venta imposible. ` +
          `${slug} no está LIVE en Gumroad en el idioma de la página. Opciones: publicar ${slug} en Gumroad, ` +
          `repuntar el CTA a un kit LIVE del mismo idioma, o quitar el CTA. Dejarlo apuntando a Payhip no es una opción.`,
      );
    }
  }
}

// --- regla 5: el alias-map tiene que reflejar lo publicado ------------------
const paresEnMapa = new Set(alias.ctas.map((c) => `${c.pagina}|${c.kit_id}`));
for (const p of paresEnHtml) {
  if (!paresEnMapa.has(p)) errores.push(`alias-map desactualizado: falta la fila ${p}. Correr: node trip-kits/build-alias-map.mjs`);
}
for (const p of paresEnMapa) {
  if (!paresEnHtml.has(p)) errores.push(`alias-map desactualizado: sobra la fila ${p} (ya no está en el HTML). Correr: node trip-kits/build-alias-map.mjs`);
}

console.log(`check-cta-checkout: ${gumroadOk} CTAs Gumroad válidos · ${payhipEspejo} espejos Payhip secundarios · ${avisos.length} avisos`);
for (const a of avisos) console.log(`  AVISO ${a}`);
if (errores.length) {
  console.error(`\ncheck-cta-checkout: ${errores.length} ERRORES — el build no puede pasar:`);
  for (const e of errores) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("check-cta-checkout: OK (ningún CTA muerto ni cruzado de idioma)");

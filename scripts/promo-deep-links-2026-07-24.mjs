// ─────────────────────────────────────────────────────────────────────────────
// Deep links del bloque `.promo` a la página de REGIÓN de Panoramas
// (2026-07-24). One-shot, mismo molde que inject-growth-features-2026-07-21.mjs:
// se corre una vez, el resultado se commitea, y queda en el repo como registro
// de qué se cambió exactamente y con qué criterio.
//
// EL PROBLEMA: las 25 guías × 3 idiomas mandaban su único link a Panoramas al
// home pelado (https://viajesypanoramas.cl/). Alguien que acaba de leer la guía
// de Puerto Varas aterrizaba en un buscador nacional vacío y tenía que volver a
// escribir dónde está. El link existía; la continuidad, no.
//
// Además el home no monetiza: las páginas de región sí (CTA de afiliados
// GYG/Viator/Localrent, commit 3ae141c de app_panoramas) y son la superficie
// que el paywall de comuna usa. Mandar tráfico calificado al home era regalar
// la parte del embudo donde hay plata.
//
// LA REGIÓN SALE DEL PROPIO REPO, no de mi cabeza: index.html ya lleva
// `data-region` por tarjeta (lo usa el filtro del pie de la portada, ver
// agente/ESTADO.md §4), así que el mapeo guía→región ya estaba escrito y
// mantenido. Este script lo LEE en vez de reinventarlo — si mañana alguien
// agrega una guía con su tarjeta, el mapeo la incluye sola.
//
// Los 3 hubs (index.html, en/, pt/) NO se tocan: su alcance es nacional, un
// link a una sola región sería peor. (Nota aparte para quien pase por acá: su
// copy dice "¿Estás en la región de Los Lagos?" en un hub nacional — eso es
// una rareza de contenido, no de linking, y arreglarla es decisión editorial.)
//
//   node scripts/promo-deep-links-2026-07-24.mjs
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const ROOT = new URL('../', import.meta.url)
const HOME = 'https://viajesypanoramas.cl/'

// Nombre mostrado en index.html -> slug real de región en Panoramas
// (public/data/regions/index.json de app_panoramas). Explícito y no un
// slugify(): dos no coinciden por transformación mecánica —"Metropolitana" es
// "metropolitana-de-santiago" y "O'Higgins" es el nombre largo completo—, y un
// slugify silencioso habría generado dos URLs 404 que ningún gate detecta
// (check-links.mjs ignora links externos a propósito).
const REGION_SLUG = {
  'Arica y Parinacota': 'arica-y-parinacota',
  'Tarapacá': 'tarapaca',
  'Antofagasta': 'antofagasta',
  'Atacama': 'atacama',
  'Coquimbo': 'coquimbo',
  'Valparaíso': 'valparaiso',
  'Metropolitana': 'metropolitana-de-santiago',
  "O'Higgins": 'libertador-general-bernardo-o-higgins',
  'Maule': 'maule',
  'Ñuble': 'nuble',
  'Biobío': 'biobio',
  'La Araucanía': 'la-araucania',
  'Los Ríos': 'los-rios',
  'Los Lagos': 'los-lagos',
  'Aysén': 'aysen',
  'Magallanes': 'magallanes',
}

// Las plantillas reciben la FRASE PREPOSICIONAL completa, no el nombre suelto.
// Motivo concreto: en portugués "em" + "a Região" se contrae en "na" — con un
// hueco `em ${region}` no hay forma de escribir "na Região Metropolitana" sin
// que quede "em a Região Metropolitana". Que la preposición viaje con el
// nombre resuelve eso y de paso permite el artículo en español ("en la Región
// Metropolitana" y no "en Metropolitana", que es como quedaba antes).
const COPY = {
  es: {
    from: 'te muestra qué hacer cerca de ti, hoy.',
    to: (frase) => `te muestra qué hacer ${frase}, hoy.`,
  },
  en: {
    from: 'app shows you what to do nearby, today.',
    to: (frase) => `app shows you what to do ${frase}, today.`,
  },
  pt: {
    from: 'mostra o que fazer perto de você, hoje.',
    to: (frase) => `mostra o que fazer ${frase}, hoje.`,
  },
}

// Por defecto la frase es preposición + nombre propio tal cual — los nombres de
// región no se traducen ("Los Lagos", "La Araucanía" funcionan en los 3
// idiomas). La Metropolitana es la única que no funciona como nombre suelto en
// ninguno: "en Metropolitana" no lo dice nadie.
const FRASE_OVERRIDE = {
  Metropolitana: {
    es: 'en la Región Metropolitana',
    en: 'in the Santiago Metropolitan Region',
    pt: 'na Região Metropolitana',
  },
}
const PREPOSICION = { es: 'en', en: 'in', pt: 'em' }
function fraseRegion(region, locale) {
  return FRASE_OVERRIDE[region]?.[locale] ?? `${PREPOSICION[locale]} ${region}`
}

// ── Mapeo guía -> región, leído de las tarjetas de la portada ────────────────
const indexHtml = readFileSync(new URL('index.html', ROOT), 'utf-8')
const cardRe = /<div class="tarjeta"[^>]*data-region="([^"]*)"[^>]*>[\s\S]*?<a class="tarjeta-link" href="([^"]+)"/g
const guias = new Map() // archivo .html -> { region, slug }
for (const [, region, href] of indexHtml.matchAll(cardRe)) {
  if (!Object.hasOwn(REGION_SLUG, region)) {
    throw new Error(
      `promo-deep-links: la tarjeta "${href}" declara data-region="${region}", que no está en REGION_SLUG. ` +
        `Agregá el mapeo a mano (nunca derivarlo con slugify: ver el comentario de REGION_SLUG).`,
    )
  }
  guias.set(href, { region, slug: REGION_SLUG[region] })
}
if (guias.size === 0) throw new Error('promo-deep-links: 0 tarjetas parseadas en index.html — el patrón cambió')

// ── Reescritura ─────────────────────────────────────────────────────────────
// El reemplazo se hace SOLO dentro del bloque `.promo`. Un replace global sobre
// el archivo pisaría también los links a Panoramas que viven en otras partes de
// la guía (créditos, nota de afiliados), que sí deben apuntar al home.
const promoRe = /<div class="promo">[\s\S]*?<\/div>/g
let filesTouched = 0
let hrefsRewritten = 0
let copyRewritten = 0
const missing = []

for (const [file, { region, slug }] of guias) {
  for (const [locale, prefix] of [['es', ''], ['en', 'en/'], ['pt', 'pt/']]) {
    const url = new URL(`${prefix}${file}`, ROOT)
    if (!existsSync(url)) {
      missing.push(`${prefix}${file}`)
      continue
    }
    const original = readFileSync(url, 'utf-8')
    // /en y /pt sirven su propio árbol de regiones en Panoramas (verificado en
    // vivo: los 16 slugs × 3 locales devuelven 200). Mandar a un lector en
    // inglés a la versión ES sería degradarlo sin necesidad.
    const localePrefix = locale === 'es' ? '' : `/${locale}`
    const deepLink = `https://viajesypanoramas.cl${localePrefix}/region/${slug}`

    let hrefHits = 0
    let copyHits = 0
    const updated = original.replace(promoRe, (block) => {
      let out = block.replaceAll(`href="${HOME}"`, () => {
        hrefHits++
        return `href="${deepLink}"`
      })
      const { from, to } = COPY[locale]
      if (out.includes(from)) {
        out = out.replace(from, to(fraseRegion(region, locale)))
        copyHits++
      }
      return out
    })

    if (updated !== original) {
      writeFileSync(url, updated)
      filesTouched++
      hrefsRewritten += hrefHits
      copyRewritten += copyHits
    }
  }
}

if (missing.length > 0) {
  console.log(`promo-deep-links: ${missing.length} traducción(es) ausente(s), omitidas: ${missing.join(', ')}`)
}
console.log(
  `promo-deep-links: ${filesTouched} archivos, ${hrefsRewritten} href al home -> deep link de región, ` +
    `${copyRewritten} con copy que ahora nombra la región (las guías con promo propio de ruta ` +
    `conservan su texto: reescribirlo no es un cambio de linking).`,
)

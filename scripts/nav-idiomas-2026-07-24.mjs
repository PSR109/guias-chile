// ─────────────────────────────────────────────────────────────────────────────
// Nav de idiomas completo en las guías que la tenían rota (2026-07-24).
// One-shot, mismo molde que promo-deep-links-2026-07-24.mjs.
//
// EL PROBLEMA, medido: 13 de las 25 guías en español no tenían NI UN link a su
// traducción, y las 13 versiones en inglés no tenían link a la portuguesa. Las
// traducciones existen (en/*.html y pt/*.html, 25/25 las dos), están en el
// sitemap y están declaradas en el hreflang del <head> — o sea Google las
// conoce y las indexa. Lo que no había era forma de que una PERSONA llegara a
// ellas: el hreflang es una señal para el crawler, no un link visible.
//
// Un brasileño que aterriza en /pt/valdivia.html desde Google puede navegar; el
// mismo brasileño que aterriza en la versión ES quedaba encerrado ahí.
//
// El patrón NO se inventa: se copia carácter por carácter de las 12 guías que
// sí lo tienen (incluidos los `title` que avisan que el link se sale del árbol
// del idioma). Por eso el script FALLA si el <nav> de un archivo no calza con
// la forma esperada, en vez de escribir una variante nueva a mano alzada.
//
// pt/*.html no se toca: las 25 ya tenían su nav de 3 vías completo.
//
//   node scripts/nav-idiomas-2026-07-24.mjs
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'

const ROOT = new URL('../', import.meta.url)
const NO_SON_GUIAS = new Set(['index.html', 'creditos.html', 'privacy-policy.html'])

// Los links que cada locale debe tener, copiados de las guías completas.
// El <nav> de ES termina en </nav> y el de EN también: se inserta ANTES del
// cierre para preservar el primer link ("Todas las guías") y su title.
const ES_NAV_ABIERTO = '<nav><a href="./">Todas las guías</a>'
const EN_HOME_LINK =
  '<nav><a href="../" title="Leaves the English version — the homepage is in Spanish">All guides (Spanish site)</a>'

const guias = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && !NO_SON_GUIAS.has(f))
  .sort()

let esArregladas = 0
let enArregladas = 0
const saltadas = []

for (const file of guias) {
  const base = file.replace(/\.html$/, '')
  const esUrl = new URL(file, ROOT)
  const enUrl = new URL(`en/${file}`, ROOT)
  const ptUrl = new URL(`pt/${file}`, ROOT)

  // Sin las dos traducciones en disco no se linkea nada: un <a> a un archivo
  // que no existe es un 404 servido a una persona real, peor que no ofrecer el
  // idioma. (check-links.mjs lo cazaría igual, pero mejor no escribirlo nunca.)
  if (!existsSync(enUrl) || !existsSync(ptUrl)) {
    saltadas.push(`${file} (falta ${!existsSync(enUrl) ? 'en/' : 'pt/'})`)
    continue
  }

  // ── ES: le faltan los dos links de idioma ─────────────────────────────────
  const es = readFileSync(esUrl, 'utf-8')
  const yaTieneEn = es.includes(`href="en/${file}"`)
  const yaTienePt = es.includes(`href="pt/${file}"`)
  if (!yaTieneEn || !yaTienePt) {
    if (!es.includes(ES_NAV_ABIERTO)) {
      throw new Error(
        `nav-idiomas: el <nav> de ${file} no calza con el patrón esperado. Revisalo a mano — ` +
          `este script copia una forma exacta, no adivina variantes.`,
      )
    }
    const nuevos =
      (yaTieneEn ? '' : ` <a href="en/${file}">English</a>`) +
      (yaTienePt ? '' : ` <a href="pt/${file}">Português</a>`)
    writeFileSync(esUrl, es.replace(ES_NAV_ABIERTO, ES_NAV_ABIERTO + nuevos))
    esArregladas++
  }

  // ── EN: tiene el link a ES pero le falta el de PT ─────────────────────────
  const en = readFileSync(enUrl, 'utf-8')
  if (!en.includes(`href="../pt/${file}"`)) {
    // Se ancla en el link a español, que las 25 versiones EN sí tienen, para
    // que Português quede DESPUÉS de Español — mismo orden que las completas.
    const anclaEs = `<a href="../${file}">Español</a>`
    if (!en.includes(EN_HOME_LINK) || !en.includes(anclaEs)) {
      throw new Error(`nav-idiomas: el <nav> de en/${file} no calza con el patrón esperado. Revisalo a mano.`)
    }
    writeFileSync(enUrl, en.replace(anclaEs, `${anclaEs} <a href="../pt/${file}">Português</a>`))
    enArregladas++
  }

  // pt/*.html: verificación defensiva. Hoy las 25 están completas; si alguna
  // dejara de estarlo se avisa en vez de arreglarla en silencio — el fix de PT
  // no está escrito acá y fingir que sí lo está sería peor que el aviso.
  const pt = readFileSync(ptUrl, 'utf-8')
  if (!pt.includes(`href="../${file}"`) || !pt.includes(`href="../en/${file}"`)) {
    saltadas.push(`pt/${file} (nav incompleto — arreglar a mano)`)
  }
}

if (saltadas.length > 0) console.log(`nav-idiomas: atención en ${saltadas.length}: ${saltadas.join(', ')}`)
console.log(
  `nav-idiomas: ${guias.length} guías revisadas — ${esArregladas} versiones ES sin ningún link de idioma ` +
    `y ${enArregladas} versiones EN sin el link a PT, ahora con el nav de 3 vías completo.`,
)

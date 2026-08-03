#!/usr/bin/env node
// Quita el enlace espejo "· también en Payhip" de las páginas que YA cobran por Gumroad.
//
// Por qué. El swap del 2026-08-02 dejó Payhip como espejo secundario (`<span class="kit-mirror">`)
// pensando que daba opción al comprador. Pero Payhip NO PUEDE COBRAR: el PayPal de la cuenta está
// caído (gate #77). O sea el espejo no es una alternativa, es una trampa: el que lo clickea llega a
// un checkout que no toma plata, y lo más probable es que no vuelva.
//
// El gate `tools/venta/gate-comprable.mjs` lo veía y lo reportaba como MIXTA:
//   "cobra por 1 enlace(s), pero quedan 1 apuntando a una pasarela muerta".
//
// REGLA DEL SCRIPT: sólo se toca una página que tenga un enlace de Gumroad VIVO. Una página cuyo
// único CTA es Payhip se deja intacta — ahí el enlace muerto es mejor que ningún CTA, porque al
// menos declara que el producto existe, y esas páginas se arreglan publicando su producto, no
// borrándoles el botón.
//
// Uso:  node scripts/quitar-espejo-payhip-2026-08-03.mjs [--dry]
// Después: node scripts/check-cta-checkout.mjs && node trip-kits/build-alias-map.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import { findHtmlFiles } from './lib/walk-html.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DRY = process.argv.includes('--dry')

// El espejo tal cual lo escribe switch-cta-gumroad-2026-08-02.mjs.
const ESPEJO = /\s*<span class="kit-mirror">[\s\S]{0,400}?<\/span>/g
const GUMROAD_VIVO = /https:\/\/[a-z0-9]+\.gumroad\.com\/l\/[a-z0-9-]+/i
const PAYHIP = /https:\/\/payhip\.com\/b\/[A-Za-z0-9]+/i

/** Devuelve el html limpio, o null si esta pagina no se debe tocar. */
export function limpiar(html) {
  if (!PAYHIP.test(html)) return null // nada que quitar
  if (!GUMROAD_VIVO.test(html)) return null // único CTA es Payhip: NO tocar
  const salida = html.replace(ESPEJO, '')
  if (salida === html) return null // el payhip no está en un espejo: no es nuestro caso
  return salida
}

const tocadas = []
const saltadas = []

for (const file of findHtmlFiles(ROOT)) {
  const html = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)
  if (!PAYHIP.test(html)) continue

  const salida = limpiar(html)
  if (salida === null) {
    saltadas.push({
      rel,
      por_que: GUMROAD_VIVO.test(html)
        ? 'tiene Gumroad pero el Payhip no está en un <span class="kit-mirror">'
        : 'su ÚNICO checkout es Payhip — se arregla publicando el producto, no borrando el CTA',
    })
    continue
  }
  tocadas.push(rel)
  if (!DRY) writeFileSync(file, salida)
}

console.log(`${DRY ? '[dry] ' : ''}espejo Payhip quitado: ${tocadas.length} página(s)`)
for (const t of tocadas) console.log(`  ${t}`)
if (saltadas.length) {
  console.log(`\nSALTADAS (a propósito) — ${saltadas.length}:`)
  for (const s of saltadas) console.log(`  ${s.rel}: ${s.por_que}`)
}

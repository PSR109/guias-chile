# SKU: chile-completo-bundle — US$59.00 (BUNDLE, EN bilingüe)

Los 11 trip kits en UN solo producto: 10 kits EN + 1 kit ES (Termas del Sur).
Por separado suman US$163,00; el bundle cuesta US$59,00 (ahorro de US$104, ~64%).
Entrega: UN zip con los 11 PDFs (`trip-kits/dist/chile-completo-bundle.zip`,
7.057.399 bytes ~6,7 MB, 11 archivos verificados 2026-08-01). Decisión: zip directo,
la opción más simple — no requiere página índice ni pipeline nuevo.
Descripción bilingüe EN+ES a propósito: el contenido mezcla idiomas y el comprador
hispanohablante debe saber qué parte le llega en español.
NOTA idiomas: los 2 kits ES nuevos de esta tanda (radal-siete-tazas-3d,
santiago-cajon-4d-es) NO están en el bundle — son posteriores al corte. Si se
publican, evaluar una v2 del bundle (13 PDFs, repricing).

## Etsy title (117 chars)
Chile Complete Bundle: All 11 Trip Kits | Printable PDF Itineraries | Patagonia Atacama Santiago | Travel Planner

## Etsy tags (13, max 20 chars c/u)
chile travel / bundle / patagonia / atacama / santiago / itinerary pdf /
travel guide pdf / digital download / printable travel / south america /
trip planner / chile vacation / torres del paine

## Etsy description
Every Chile Trip Kit in one download: all 11 printable itineraries — 10 in
English + 1 in Spanish (Termas del Sur) — covering Patagonia, the Carretera
Austral, Chiloé & the Lakes, Atacama, Santiago + Cajón del Maipo, Valparaíso &
the Colchagua wine route, Pucón, the Elqui Valley, Rapa Nui and the Chillán hot
springs. Bought separately: $163.00. Bundle price: $59.00 — you save $104 (64%).

WHAT'S INSIDE (one ZIP, 11 A4 PDFs, instant download):
• Ultimate Patagonia: 14 Days in Chile ($29.00)
• Rapa Nui (Easter Island) in 4 Days ($19.90)
• Carretera Austral 7-Day Road Trip ($14.90)
• La Serena, Coquimbo & the Elqui Valley — 4 days ($14.90)
• Torres del Paine Without a Car — 5 days ($12.90)
• Atacama Desert in 5 Days ($12.90)
• Pucón & Villarrica Volcano — 4 days ($12.90)
• Valparaíso & the Colchagua Wine Route — 4 days ($12.90)
• Termas del Sur: 4 días en las Termas de Chillán — EN ESPAÑOL ($12.90)
• Chiloé & the Chilean Lakes in 5 Days ($9.90)
• Santiago City Break + Cajón del Maipo — 4 days ($9.90)

Every kit includes: day-by-day plan, schematic route map, 2026 budget tables in
CLP, pre-trip checklist, bonus places from our 25,000+ place Chile catalog, FAQ.

ESPAÑOL: Todos los trip kits de Chile en una sola descarga: los 11 itinerarios
imprimibles (10 en inglés + 1 en español — Termas del Sur). Por separado suman
US$163,00; el bundle cuesta US$59,00 (ahorras US$104, un 64%). Cada kit incluye
plan día a día, mapa esquemático de la ruta, presupuesto 2026 en CLP, checklist
pre-viaje y preguntas frecuentes. Descarga instantánea: un ZIP con 11 PDFs A4.

WHY TRUST THIS: compiled by the team behind guias.viajesypanoramas.cl, a free
Chile travel-guide site built on a catalog of 25,000+ real places across Chile.
These kits distill those guides into routes you can follow offline.

Place data is derived from OpenStreetMap, (c) OpenStreetMap contributors,
available under the Open Database License (ODbL).

INSTANT DOWNLOAD — no physical item shipped. One ZIP with 11 printable A4 PDFs. Personal use only.

## Gumroad (espejo opcional, comisión 10%)
- Product name: Chile Completo — All 11 Trip Kits Bundle (ZIP: 11 printable PDF itineraries)
- Permalink (EXACTO): chile-completo-bundle  →  https://payhip.com/b/BI8z0
- URL Gumroad (verificada LIVE 2026-08-01): https://gumroad.com/l/chile-completo-bundle
- Price: $59.00
- File: trip-kits/dist/chile-completo-bundle.zip

## Payhip (tienda principal, comisión 5%)
- Nombre de producto: Chile Completo — All 11 Trip Kits Bundle (ZIP: 11 printable PDF itineraries)
- Permalink Payhip: https://payhip.com/b/BI8z0 (creado y verificado 2026-08-01, US$59.00)
- Precio: $59.00
- Archivo a subir: `trip-kits/dist/chile-completo-bundle.zip` (6,7 MB)
- Descripción: la de arriba (quitar la línea INSTANT DOWNLOAD y dejar
  "Instant ZIP download: 11 printable A4 PDF itineraries. Personal use only.").

## Archivos del producto
- ZIP: `trip-kits/dist/chile-completo-bundle.zip` (7.057.399 bytes, 11 PDFs:
  los 10 `*-en.pdf` gen-1 + `termas-del-sur-4d-es.pdf`)
- Mockup: no tiene propio — opción simple: reutilizar `patagonia-14d-main.png`
  como portada del listing, o componer uno si el patrón lo amerita después.
- (dist/ y mockups-out/ están gitignored — el zip se regenera con el comando
  documentado en NOTES.md 2026-08-01, tras `npm run all`)

## Notas de integración (NO es un kit del pipeline)
- NO va en `kits.config.mjs` ni en el inyector: es producto puro de marketplace.
- `tools/chrome/gen-product-specs.mjs` (repo raíz) hoy exige un `-en.pdf`/`-es.pdf`
  por listing y lanzaría "Falta PDF" con este. Ajuste aplicado 2026-08-01: honra la
  línea `- File:` de la sección Gumroad cuando apunta a un archivo existente (zip).
  Sin ese ajuste, crear este producto a mano y los kits por CDP como siempre.
- Punto de inserción en el sitio (cuando haya URL): el índice no tiene tienda con
  cards — solo el bloque `.cta` "Trip Kits PDF" en `index.html` (~línea 431) y sus
  gemelos en/pt, que linkean la tienda Payhip completa. Si se quiere destacar el
  bundle, es ahí: una línea "Bundle Chile Completo: los 11 kits por US$59" junto al
  botón de la tienda. Dejado documentado, no implementado (sin URL aún).

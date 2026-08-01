# SKU: chiloe-5d-es — US$12.90 (kit gen-2, ESPAÑOL)

Kit 100% Chiloé en español (WP 10K.5.11, ronda 4, 2026-08-01): los 5 días completos
en la isla, a diferencia del kit EN `chiloe-lakes-5d` (Puerto Varas + Osorno +
Frutillar + solo 2 días de isla). Puerto Montt entra solo como puerta de
entrada/salida (días 1 y 5). Cero datos inventados: todo el contenido sale de las
guías ES raíz `chiloe.html` y `puerto-montt.html` (headings exactos verificados
2026-08-01) + 4 POIs bonus del catálogo Panoramas con `descripcion_es` editorial
real (PN Alerce Andino, Pingüineras de Puñihuil, Iglesia Ntra. Sra. del Rosario de
Chonchi y Muestra Costumbrista de Castro — dedup contra los 4 lugares que ya son
contenido de los días 1-5 y exclusión del boilerplate autogenerado del catálogo:
fichas stats de hectáreas, stubs "Mirador en Los Lagos, Chile.", campings con
reseña EN; verificado 2026-08-01). Permalink propio (`chiloe-5d-es`) para no
colisionar con el EN en Gumroad/Payhip.
La descripción de marketplace va en español a propósito (kit ES); la sección se llama
"Etsy description" solo para que `gen-product-specs.mjs` la parsee como los kits gen-1.

## Título (Payhip/Gumroad)
Chiloé en 5 días — Itinerario imprimible (PDF)

## Tags / keywords
chiloé / castro chiloé / palafitos / iglesias de chiloé unesco / dalcahue /
curanto / mitología chilota / canal de chacao ferry / ancud / pingüinos puñihuil /
itinerario chile / guía de viaje pdf / descarga digital / imprimible viaje /
sur de chile

## Etsy description
Chiloé ordenado día a día: 5 días completos en la isla — cruce del Canal de Chacao
en ferry desde Pargua, los palafitos y la Iglesia de San Francisco de Castro, el
circuito de iglesias de madera Patrimonio de la Humanidad (Achao, Tenaún,
Vilupulli, Colo), Dalcahue y las islas menores como Mechuque, el curanto al hoyo y
la mitología chilota (Trauco, Pincoya, Caleuche), con la logística real del cruce:
el puente Chacao sigue en obra (entrega estimada 2028) y el ferry es la vía actual.

QUÉ INCLUYE (PDF A4, descarga instantánea):
• Plan día a día: llegada a Puerto Montt y cruce del Chacao → Castro: palafitos
  e Iglesia de San Francisco → iglesias Patrimonio de la Humanidad → Dalcahue,
  islas menores y curanto → mitología chilota y regreso por Puerto Montt (Angelmó)
• Mapa esquemático de la ruta de 5 días
• Tablas de presupuesto 2026 en CLP: ferry Pargua–Chacao (pasajero y auto),
  alojamiento en Castro, tour de día e iglesias, curanto en restaurante, más los
  traslados aeropuerto El Tepual–Puerto Montt
• Checklist pre-viaje: bus directo Puerto Montt–Castro con ferry incluido vs auto,
  impermeable para la selva valdiviana (llueve incluso en enero), domingo para la
  feria de Dalcahue, curanto al hoyo coordinado con anticipación, efectivo para
  caletas de las islas menores
• 4 lugares bonus de nuestro catálogo de más de 25.000 lugares en Chile
• FAQ: estado real del puente Chacao, cuántos días dedicar a la isla, mejor época

POR QUÉ CONFIAR: lo compila el equipo detrás de guias.viajesypanoramas.cl, sitio
gratuito de guías de Chile construido sobre un catálogo de más de 25.000 lugares
reales. Este kit destila esa guía en una ruta que puedes seguir sin conexión.

Datos de lugares derivados de OpenStreetMap, (c) colaboradores de OpenStreetMap,
disponibles bajo la Open Database License (ODbL).

DESCARGA INSTANTÁNEA — no se envía ningún producto físico. Imprímelo o llévalo en
el teléfono. Solo para uso personal.

## Gumroad (espejo opcional, comisión 10%)
- Product name: Chiloé en 5 días — itinerario imprimible (PDF)
- Permalink (EXACTO): chiloe-5d-es
- File: trip-kits/dist/chiloe-5d-es-es.pdf
- Price: $12.90

## Payhip (tienda principal, comisión 5%)
- Nombre de producto: Chiloé en 5 días — Itinerario imprimible (PDF)
- Permalink Payhip: PENDIENTE — el código /b/<CODE> lo genera Payhip al crear el
  producto (NO inventarlo). Una vez creado: pegar la URL en
  `PAYHIP_URLS['chiloe-5d-es']` en `trip-kits/kits.config.mjs`.
- Precio: $12.90
- Descripción: la de arriba (quitar la línea DESCARGA INSTANTÁNEA y dejar
  "Descarga instantánea en PDF. Solo uso personal.").

## Archivos del producto
- PDF: `trip-kits/dist/chiloe-5d-es-es.pdf` (13 páginas A4, 817.834 bytes ~799 KB)
  (sí, doble `-es`: el archivo es `${id}-${lang}.pdf` y el id ya termina en `-es`)
- Mockups listing: `trip-kits/mockups-out/chiloe-5d-es-main.png` (2000x2000)
  + `chiloe-5d-es-preview-1..3.png` (portada, día 1, presupuesto)
- (dist/ y mockups-out/ están gitignored — regenerar con
  `node build-chiloe-5d-es.mjs` si hace falta, sin tocar kits.config.mjs)

## Cableado (PENDIENTE — gate: sin producto real no hay CTA)
El kit NO está en `kits.config.mjs` ni en el MAP del inyector (archivos
compartidos; la definición lista para pegar está en
`trip-kits/kits.config.chiloe-5d-es.mjs`). Una vez creado y verificado el producto:
1. Pegar la entry del kit (y las constantes `CHILOE_DAYS_ES`/`CHILOE_ROUTE_ES`)
   en `kits.config.mjs` + la URL Payhip en `PAYHIP_URLS['chiloe-5d-es']`.
2. MAP del inyector: `chiloe` y `puerto-montt` como arrays EN+ES
   (`['chiloe-lakes-5d', 'chiloe-5d-es']` — ambas guías tienen hoy el CTA del kit
   EN `hdBVf`), y agregar `'chiloe-5d-es'` a `READY_KITS`.
3. Correr `node inject-kit-cta.mjs`: SWAP EN→ES del CTA en `chiloe.html` y
   `puerto-montt.html` (solo las guías ES; `en/`/`pt/` siguen ofreciendo el kit
   EN `chiloe-lakes-5d`). Idempotencia por `utm_campaign=chiloe-5d-es"`.
4. Re-correr los 5 gates, verificar el CTA en prod con curl/DOM vivo y pushear.
5. Cosmético: el mockup `-main.png` de este kit NO presenta el solape badge/título
   de las portadas ES de título largo (título corto de 3 palabras).

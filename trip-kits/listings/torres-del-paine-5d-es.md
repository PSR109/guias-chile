# SKU: torres-del-paine-5d-es — US$12.90 (kit gen-2, ESPAÑOL)

Gemelo en español del kit EN `tdp-no-car` (mismo molde "sin auto": buses + tours de
día + el trekking a Base Torres, copy ES, pulls a las guías ES raíz `torres-del-paine.html`,
`puerto-natales.html` y `punta-arenas.html`). Permalink propio (`torres-del-paine-5d-es`)
para no colisionar con el EN en Gumroad/Payhip. Cero datos inventados: todo el contenido
sale de las guías ES + 10 POIs bonus del catálogo Panoramas con `descripcion_es` editorial
real (Cerro de la Cruz, navegación al Glaciar Grey, Mercado Municipal, Cementerio Sara
Braun, museo salesiano, Seno Otway, Cerro Dorotea, Nao Victoria, Fuerte Bulnes, Reserva
Magallanes — dedup contra los 8 lugares que ya son contenido de los días 1-5 y exclusión
del junk autogenerado, verificado 2026-08-01).
La descripción de marketplace va en español a propósito (kit ES); la sección se llama
"Etsy description" solo para que `gen-product-specs.mjs` la parsee como los kits gen-1.

## Título (Payhip/Gumroad)
Torres del Paine sin auto: 5 días — Itinerario imprimible (PDF)

## Tags / keywords
torres del paine / torres del paine sin auto / puerto natales / base torres /
punta arenas / cueva del milodón / seno última esperanza / isla magdalena /
patagonia chile / itinerario chile / guía de viaje pdf / descarga digital /
imprimible viaje / trekking torres del paine / planificador viaje

## Etsy description
Torres del Paine sin auto y sin circuito de varios días: 5 días entre Punta Arenas y
Puerto Natales con el tour de día completo al parque (lago Grey, Salto Grande, lago
Pehoé y los cuernos), el trekking estrella a Base Torres en el día (~19 km, 8-10 horas),
la Cueva del Milodón, la navegación por el Seno Última Esperanza a los glaciares
Balmaceda y Serrano y la opción de cerrar con los pingüinos de Isla Magdalena — con la
logística real de buses, shuttles y reservas obligatorias.

QUÉ INCLUYE (PDF A4, descarga instantánea):
• Plan día a día: llegada a Punta Arenas y bus a Puerto Natales → preparativos y
  Cueva del Milodón → tour de día completo al parque → trekking a Base Torres →
  día de margen: navegación por Última Esperanza o regreso con Isla Magdalena
• Mapa esquemático de la ruta de 5 días
• 3 tablas de presupuesto 2026 (parque, Puerto Natales y Punta Arenas): entrada al
  parque, tour de día completo, trekking guiado, buses, navegación a los glaciares
  y tours de pingüineras
• Checklist pre-viaje: entrada al parque comprada online CON FECHA, cortaviento real
  para ráfagas de 100+ km/h, efectivo sacado en Puerto Natales (dentro del parque
  casi no hay señal ni pago electrónico)
• 10 lugares bonus de nuestro catálogo de más de 25.000 lugares en Chile
• FAQ: si vale la pena sin trekking de varios días, qué reservar sí o sí, mejor
  época, cuántos días en Puerto Natales, cómo ir al parque sin auto

POR QUÉ CONFIAR: lo compila el equipo detrás de guias.viajesypanoramas.cl, sitio
gratuito de guías de Chile construido sobre un catálogo de más de 25.000 lugares
reales. Este kit destila esas guías en una ruta que puedes seguir sin conexión.

Datos de lugares derivados de OpenStreetMap, (c) colaboradores de OpenStreetMap,
disponibles bajo la Open Database License (ODbL).

DESCARGA INSTANTÁNEA — no se envía ningún producto físico. Imprímelo o llévalo en
el teléfono. Solo para uso personal.

## Gumroad (espejo opcional, comisión 10%)
- Product name: Torres del Paine sin auto: 5 días — itinerario imprimible (PDF)
- Permalink (EXACTO): torres-del-paine-5d-es
- File: trip-kits/dist/torres-del-paine-5d-es-es.pdf
- Price: $12.90

## Payhip (tienda principal, comisión 5%)
- Nombre de producto: Torres del Paine sin auto: 5 días — Itinerario imprimible (PDF)
- Permalink Payhip: PENDIENTE — el código /b/<CODE> lo genera Payhip al crear el
  producto (NO inventarlo). Una vez creado: pegar la URL en
  `PAYHIP_URLS['torres-del-paine-5d-es']` en `trip-kits/kits.config.mjs`.
- Precio: $12.90
- Descripción: la de arriba (quitar la línea DESCARGA INSTANTÁNEA y dejar
  "Descarga instantánea en PDF. Solo uso personal.").

## Archivos del producto
- PDF: `trip-kits/dist/torres-del-paine-5d-es-es.pdf` (15 páginas A4, 635.661 bytes ~621 KB)
  (sí, doble `-es`: el archivo es `${id}-${lang}.pdf` y el id ya termina en `-es`)
- Mockups listing: `trip-kits/mockups-out/torres-del-paine-5d-es-main.png` (2000x2000)
  + `torres-del-paine-5d-es-preview-1..3.png` (portada, día 1, presupuesto)
- (dist/ y mockups-out/ están gitignored — regenerar con `npm run all` si hace falta)

## Cableado (PENDIENTE — gate: sin producto real no hay CTA)
El MAP del inyector ya tiene las 3 guías como array `['tdp-no-car', 'torres-del-paine-5d-es']`
(torres-del-paine, puerto-natales, punta-arenas); el kit está FUERA de `READY_KITS`,
así que nada cambia hasta que exista el producto. Una vez creado y verificado:
1. Pegar la URL Payhip en `PAYHIP_URLS['torres-del-paine-5d-es']`.
2. Agregar `'torres-del-paine-5d-es'` a `READY_KITS` en `inject-kit-cta.mjs`.
3. Correr `node inject-kit-cta.mjs`: SWAP EN→ES del CTA en `torres-del-paine.html`,
   `puerto-natales.html` y `punta-arenas.html` (solo las guías ES; `en/`/`pt/` siguen
   ofreciendo el kit EN `tdp-no-car`). Smoke test del swap ya verificado 2026-08-01
   con fixtures en /tmp (changed=3 en las guías ES, idempotente en 2ª corrida).
4. Re-correr los 5 gates, verificar el CTA en prod con curl/DOM vivo y pushear.

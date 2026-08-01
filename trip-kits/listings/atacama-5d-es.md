# SKU: atacama-5d-es — US$12.90 (kit gen-2, ESPAÑOL)

Gemelo en español del kit EN `atacama-5d` (mismo molde y recorrido de 5 días, copy ES,
pulls a la guía ES raíz `san-pedro-de-atacama.html`). Permalink propio (`atacama-5d-es`)
para no colisionar con el EN en Gumroad/Payhip. Cero datos inventados: todo el contenido
sale de la guía ES + 7 POIs bonus del catálogo Panoramas con `descripcion_es` editorial
real (sandboard, Pukará de Quitor, iglesia de San Pedro, Termas de Puritama, Valle del
Arcoíris, Aldea de Tulor, calle Caracoles — dedup contra los 6 lugares que ya son
contenido de los días 1-5 y exclusion del boilerplate autogenerado "Mirador en
Antofagasta, Chile.", verificado 2026-08-01).
La descripción de marketplace va en español a propósito (kit ES); la sección se llama
"Etsy description" solo para que `gen-product-specs.mjs` la parsee como los kits gen-1.

## Título (Payhip/Gumroad)
Desierto de Atacama en 5 días — Itinerario imprimible (PDF)

## Tags / keywords
san pedro de atacama / desierto de atacama / valle de la luna / géiseres del tatio /
lagunas altiplánicas / piedras rojas / tour astronómico atacama / laguna cejar /
baltinache / itinerario chile / guía de viaje pdf / descarga digital / imprimible viaje /
norte de chile / planificador viaje

## Etsy description
San Pedro de Atacama ordenado día a día: 5 días entre el Valle de la Luna al atardecer,
los géiseres del Tatio al amanecer (el campo geotérmico más alto del mundo, 4.320 m),
las lagunas altiplánicas Miscanti y Miñiques con Piedras Rojas, la flotación en las
lagunas Cejar o Baltinache y el cierre con un tour astronómico bajo el cielo más limpio
del planeta — con la logística real de la altura: excursiones ordenadas de menor a
mayor altitud para aclimatarse bien.

QUÉ INCLUYE (PDF A4, descarga instantánea):
• Plan día a día: llegada a Calama y aclimatación → Valle de la Luna al atardecer →
  géiseres del Tatio al amanecer → lagunas altiplánicas y Piedras Rojas → flotación
  en Cejar y tour astronómico de cierre
• Mapa esquemático de la ruta de 5 días
• Tabla de presupuesto 2026 en CLP: tours a Tatio, Valle de la Luna, lagunas
  altiplánicas + Piedras Rojas y astronómico, con la nota clave de las entradas
  comunitarias (casi nunca incluidas: presupuesta CLP 30.000–50.000 extra)
• Checklist pre-viaje: orden de excursiones por altitud (el Tatio nunca el primer
  día), efectivo para entradas comunitarias, capas para el bajo cero del amanecer,
  plan B para el invierno altiplánico de enero-febrero
• 7 lugares bonus de nuestro catálogo de más de 25.000 lugares en Chile
• FAQ: cuántos días dedicar, si la altura es problema, cuándo reservar

POR QUÉ CONFIAR: lo compila el equipo detrás de guias.viajesypanoramas.cl, sitio
gratuito de guías de Chile construido sobre un catálogo de más de 25.000 lugares
reales. Este kit destila esa guía en una ruta que puedes seguir sin conexión.

Datos de lugares derivados de OpenStreetMap, (c) colaboradores de OpenStreetMap,
disponibles bajo la Open Database License (ODbL).

DESCARGA INSTANTÁNEA — no se envía ningún producto físico. Imprímelo o llévalo en
el teléfono. Solo para uso personal.

## Gumroad (espejo opcional, comisión 10%)
- Product name: Desierto de Atacama en 5 días — itinerario imprimible (PDF)
- Permalink (EXACTO): atacama-5d-es
- File: trip-kits/dist/atacama-5d-es-es.pdf
- Price: $12.90

## Payhip (tienda principal, comisión 5%)
- Nombre de producto: Desierto de Atacama en 5 días — Itinerario imprimible (PDF)
- Permalink Payhip: PENDIENTE — el código /b/<CODE> lo genera Payhip al crear el
  producto (NO inventarlo). Una vez creado: pegar la URL en
  `PAYHIP_URLS['atacama-5d-es']` en `trip-kits/kits.config.mjs`.
- Precio: $12.90
- Descripción: la de arriba (quitar la línea DESCARGA INSTANTÁNEA y dejar
  "Descarga instantánea en PDF. Solo uso personal.").

## Archivos del producto
- PDF: `trip-kits/dist/atacama-5d-es-es.pdf` (14 páginas A4, 640.084 bytes ~625 KB)
  (sí, doble `-es`: el archivo es `${id}-${lang}.pdf` y el id ya termina en `-es`)
- Mockups listing: `trip-kits/mockups-out/atacama-5d-es-main.png` (2000x2000)
  + `atacama-5d-es-preview-1..3.png` (portada, día 1, presupuesto)
- (dist/ y mockups-out/ están gitignored — regenerar con `npm run all` si hace falta)

## Cableado (PENDIENTE — gate: sin producto real no hay CTA)
El MAP del inyector ya tiene la guía como array `['atacama-5d', 'atacama-5d-es']`;
el kit está FUERA de `READY_KITS`, así que nada cambia hasta que exista el producto.
Una vez creado y verificado:
1. Pegar la URL Payhip en `PAYHIP_URLS['atacama-5d-es']`.
2. Agregar `'atacama-5d-es'` a `READY_KITS` en `inject-kit-cta.mjs`.
3. Correr `node inject-kit-cta.mjs`: SWAP EN→ES del CTA en `san-pedro-de-atacama.html`
   (solo la guía ES; `en/`/`pt/` siguen ofreciendo el kit EN `atacama-5d`). Smoke test
   del swap ya verificado 2026-08-01 con fixtures en /tmp (changed=1 en la guía ES,
   idempotente en 2ª corrida).
4. Re-correr los 5 gates, verificar el CTA en prod con curl/DOM vivo y pushear.

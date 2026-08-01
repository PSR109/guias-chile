# SKU: santiago-cajon-4d-es — US$9.90 (kit gen-2, ESPAÑOL)

Gemelo en español del kit EN `santiago-cajon-4d` (mismo molde y misma ruta, copy ES,
pulls a las guías ES raíz `santiago.html` + `cajon-del-maipo.html`). Permalink propio
(`santiago-cajon-es`) para no colisionar con el EN en Gumroad/Payhip. Cero datos
inventados. 10 POIs bonus del catálogo Panoramas con `descripcion_es` real (museos,
mercados, termas de Colina — dedup editorial contra los 5 lugares que ya son contenido
de los días 1-4).
La descripción de marketplace va en español a propósito (kit ES); la sección se llama
"Etsy description" solo para que `gen-product-specs.mjs` la parsee como los kits gen-1.

## Título (Payhip/Gumroad)
Santiago + Cajón del Maipo: 4 días — Itinerario imprimible (PDF)

## Tags / keywords
santiago chile / cajón del maipo / embalse el yeso / baños morales / cerro san cristóbal /
bellavista / itinerario chile / guía de viaje pdf / descarga digital / imprimible viaje /
escapada cordillera / monumento el morado / planificador viaje

## Etsy description
Santiago no necesita una semana: necesita 4 días inteligentes. Este itinerario
imprimible combina lo imperdible de la capital (centro histórico, Bellavista, el
atardecer en el cerro San Cristóbal) con la escapada de montaña más accesible del
país: el Cajón del Maipo, con el Embalse El Yeso turquesa y las termas y glaciares
de Baños Morales, a poco más de una hora del hotel.

QUÉ INCLUYE (PDF A4, descarga instantánea):
• Plan día a día: centro histórico → Bellavista, Lastarria y atardecer en el San
  Cristóbal → Embalse El Yeso y Baños Morales → Cascada de las Ánimas y regreso
• Mapa esquemático de la ruta de 4 días
• Tablas de presupuesto 2026 en CLP: metro, funicular/teleférico, Sky Costanera,
  entrada a El Morado, termas de Baños Morales, colectivos al cajón, alojamiento
• Checklist pre-viaje: tarjeta Bip!, entrada a El Morado en Pases Parques (cupos
  limitados), corte estacional de El Yeso entre abril y agosto
• 10 lugares bonus de nuestro catálogo de más de 25.000 lugares en Chile
• FAQ: cuántos días alcanzan, si se necesita 4x4 para El Yeso, cómo llegar en
  transporte público

POR QUÉ CONFIAR: lo compila el equipo detrás de guias.viajesypanoramas.cl, sitio
gratuito de guías de Chile construido sobre un catálogo de más de 25.000 lugares
reales. Este kit destila esas guías en una ruta que puedes seguir sin conexión.

Datos de lugares derivados de OpenStreetMap, (c) colaboradores de OpenStreetMap,
disponibles bajo la Open Database License (ODbL).

DESCARGA INSTANTÁNEA — no se envía ningún producto físico. Imprímelo o llévalo en
el teléfono. Solo para uso personal.

## Gumroad (espejo opcional, comisión 10%)
- Product name: Santiago + Cajón del Maipo — 4 días, itinerario imprimible (PDF)
- Permalink (EXACTO): santiago-cajon-es  →  https://payhip.com/b/asZlb
- URL Gumroad espejo (verificada LIVE 2026-08-01): https://gumroad.com/l/santiago-cajon-es
- Price: $9.90

## Payhip (tienda principal, comisión 5%)
- Nombre de producto: Santiago + Cajón del Maipo: 4 días — Itinerario imprimible (PDF)
- Permalink Payhip: https://payhip.com/b/asZlb (creado y verificado 2026-08-01, US$9.90)
- Precio: $9.90
- Descripción: la de arriba (quitar la línea DESCARGA INSTANTÁNEA y dejar
  "Descarga instantánea en PDF. Solo uso personal.").

## Archivos del producto
- PDF: `trip-kits/dist/santiago-cajon-4d-es-es.pdf` (13 páginas A4, 724.261 bytes ~707 KB)
  (sí, doble `-es`: el archivo es `${id}-${lang}.pdf` y el id ya termina en `-es`)
- Mockups listing: `trip-kits/mockups-out/santiago-cajon-4d-es-main.png` (2000x2000)
  + `santiago-cajon-4d-es-preview-1..3.png` (portada, día 1, presupuesto)
- (dist/ y mockups-out/ están gitignored — regenerar con `npm run all` si hace falta)

## Cableado (EJECUTADO 2026-08-01) — con swap
URL en `PAYHIP_URLS`, kit en `READY_KITS`, inyector corrido (`changed=3` total):
SWAP EN→ES ejecutado en las guías ES `santiago.html` y `cajon-del-maipo.html`
(UTM `utm_campaign=santiago-cajon-4d-es`; un solo CTA por guía). Las guías
`en/`/`pt/` no se tocaron: siguen ofreciendo el kit EN (`santiago-cajon-4d`).
5 gates verdes. Verificación prod: CTA ES visible en
https://guias.viajesypanoramas.cl/santiago.html y /cajon-del-maipo.html.

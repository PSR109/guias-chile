# NOTES — trip-kits, corrida 2026-07-21 (expansión mientras se espera Gumroad)

Contexto: el plan original `docs/superpowers/plans/2026-07-21-trip-kits-etsy.md`
(10/10 tasks) ya había generado 5 PDFs. El único gate humano real era que
Patricio habilitara los productos en Gumroad. Mientras eso se esperaba, esta
corrida avanzó todo lo autónomo posible en el mismo repo/día.

**ACTUALIZACIÓN 2026-07-28:** la tienda `patagoniatrips` nunca se creó — los
productos se crean bajo la cuenta real `patricio358` (mismos permalinks
`/l/<slug>`, solo cambia el subdominio). Vía automatización CDP (`tools/chrome/`
en la raíz del portfolio) se crearon **5 de 10** hoy: `atacama-5d`,
`carretera-austral-7d`, `chiloe-lakes-5d`, `elqui-stars-4d`, `patagonia-14d`.
Los otros 5 (`tdp-no-car`, `santiago-cajon-4d`, `valpo-wine-4d`,
`pucon-volcano-4d`, `rapa-nui-4d`) chocaron con el límite de **10
productos/día** de Gumroad — quedan para el próximo día. `inject-kit-cta.mjs`
tiene un set `READY_KITS` que gatea qué CTAs se inyectan en las guías; sacar
un kit de ahí en cuanto su producto exista y esté verificado (200 en
`patricio358.gumroad.com/l/<permalink>`).

## Qué se hizo

1. **Catálogo 5 → 10 SKUs.** El pipeline (`extract-guide.mjs` + `panoramas.mjs`
   + `kits.config.mjs` + `compile-html.mjs`) generalizaba bien a cualquier guía
   EN del repo, así que se agregaron 5 kits nuevos de 4 días usando destinos
   que ya tenían guía completa (es/en/pt) pero cero kit:
   - `santiago-cajon-4d` (US$9.90) — Santiago urbano + Cajón del Maipo.
   - `valpo-wine-4d` (US$12.90) — Valparaíso + Ruta del Vino Colchagua + Pichilemu.
   - `pucon-volcano-4d` (US$12.90) — Pucón, volcán Villarrica, rafting, termas.
   - `elqui-stars-4d` (US$14.90) — La Serena/Coquimbo + Valle del Elqui (astroturismo).
   - `rapa-nui-4d` (US$19.90) — Rapa Nui, precio más alto por ser el destino de
     mayor gasto/visitante y logística más compleja (único destino con vuelo
     obligatorio, sin alternativa terrestre).
   Criterio de selección (sin datos de tráfico propios de trip-kits, que no
   existe todavía): se usaron las señales ya documentadas en `agente/ESTADO.md`
   ("Santiago... mayor volumen de búsqueda del país", "La Serena... alto
   volumen", "Rapa Nui... alto gasto por visitante") + criterio de portafolio
   (evitar solapar con los 5 kits existentes, que ya cubren sur/Patagonia/Atacama;
   los 5 nuevos abren Chile central, Lake District norte y Rapa Nui — combinaciones
   origen-destino distintas, más alcance geográfico total).
   Verificado con `pickSections` (falla si el heading no existe exacto): los 10
   kits compilan sin error → `npm run all` genera 10 HTML + 10 PDF + 40 PNG.
   Tamaños de PDF: 318-673 KB (piso 100 KB / techo 20 MB del pipeline, ok).

2. **Metadata embebida en los PDFs** (`build-pdf.mjs`, dependencia nueva
   `pdf-lib`): Title/Author/Subject/Keywords/Creator vía Info dictionary del
   PDF — mejora discoverability si el PDF se comparte o se indexa fuera de
   Etsy/Gumroad (Document Properties del lector, crawlers). Verificado
   releyendo el PDF con `PDFDocument.load()` (nota: un grep de bytes crudos no
   encuentra las strings porque pdf-lib las guarda en object streams
   comprimidos — normal, cualquier lector de PDF real las parsea bien).
   `Producer` queda como "pdf-lib" (la librería lo pisa siempre al hacer
   `.save()`, no hay flag que lo evite en 1.17.x) — inofensivo, no afecta SEO.

3. **Branding: "Patagonia Trip Kits" → "Chile Trip Kits".** El label de marca
   en la portada de cada PDF (`compile-html.mjs`) decía "Patagonia Trip Kits",
   correcto cuando los 5 kits originales eran todos sur de Chile/Atacama. Con
   los 5 nuevos (Santiago, Valparaíso, Rapa Nui, Elqui) ya no aplica. Cambiado
   a "Chile Trip Kits" — es solo texto de portada, NO toca `GUMROAD_BASE`
   (`patricio358.gumroad.com`, cuenta real de Patricio, sin tocar por regla).

4. **Copy de listings.** Escritos los 5 `listings/*.md` nuevos con el mismo
   formato que los 5 originales (título Etsy <140 char, 13 tags <20 char c/u,
   descripción con gancho + bullets + FAQ + cierre de confianza). Además se
   unificó el cierre de confianza en los 3 listings originales que tenían la
   versión corta ("Compiled from... trusted by thousands") a la versión larga
   "WHY TRUST THIS: ..." que ya usaba `tdp-no-car.md` — mismo mensaje, más
   consistente entre los 10 SKUs (CRO: framing explícito de confianza).
   No se inventó ningún feature ni precio; los 5 precios nuevos (9.90-19.90)
   caen dentro del rango ya declarado en el README (9.90-29).

## Qué se evaluó y se dejó fuera (con motivo)

- **Más idiomas (ES/PT) para los kits.** El pipeline técnicamente lo soporta
  (`compile-html.mjs --lang es`), pero el copy de cada kit (intro de cada día,
  checklist, título, subtítulo) está escrito a mano en inglés dentro de
  `kits.config.mjs` — no es contenido derivado de las guías (eso sí es
  multi-idioma), así que una versión ES/PT real requiere traducir ~10 kits ×
  4-14 días de copy, no solo cambiar un flag. Es una tanda de autoría de
  contenido aparte, no una extensión mecánica del pipeline. Se deja fuera de
  esta corrida y documentado aquí como siguiente paso con valor real (Brasil es
  mercado turístico grande para Chile — PT-BR sería el candidato con más
  retorno si se retoma).
- **SEO/landing page pública para los kits.** Se verificó que `main` no tiene
  NINGUNA referencia a trip-kits/Gumroad en ninguna página pública (grep
  limpio). Es intencional: el cross-sell (`inject-kit-cta.mjs`) vive en la
  rama `trip-kits-cta`, gateado hasta que Gumroad esté vivo — publicar un
  structured-data trío (FAQ+Breadcrumb+Article) o una landing page ahora
  implicaría linkear una URL de producto que no existe, lo cual está
  explícitamente fuera de alcance. La mejora de discoverability que SÍ se
  podía hacer sin depender de Gumroad (metadata del PDF, punto 2 arriba) se
  hizo. `trip-kits-cta` NO se tocó ni se le agregaron commits.

## Qué queda (actualizado 2026-07-28)

1. ~~Crear cuenta Gumroad `patagoniatrips`~~ → obsoleto: se usa `patricio358`
   (cuenta real ya existente), 5/10 productos creados hoy vía CDP, 5 quedan
   para mañana (límite 10 productos/día de Gumroad). Ver ACTUALIZACIÓN arriba.
2. Cuando el cupo diario reinicie: crear los 5 restantes (`tdp-no-car`,
   `santiago-cajon-4d`, `valpo-wine-4d`, `pucon-volcano-4d`, `rapa-nui-4d`),
   agregarlos a `READY_KITS` en `inject-kit-cta.mjs`, re-correr el inyector.
3. **CERRADO 2026-07-21 (continuación autónoma)**: `trip-kits-cta` mergeó
   `main` (trae el catálogo 10-kit, `f0eea60`) y `inject-kit-cta.mjs` ya
   inyecta CTA en las 8 guías de los 5 kits nuevos también (24 archivos
   nuevos, 27 preexistentes idempotentes). Commit `d4b4a5e`, pusheado a
   `origin/trip-kits-cta`. Sigue sin mergear a `main` — mismo gate humano.
4. Una vez con URLs de producto reales: recién ahí vale la pena el structured
   data / landing page pública mencionada arriba.
5. **SUPERSEDIDO 2026-07-28**: en vez de mergear `origin/trip-kits-cta` tal
   cual (tenía los 10 kits sin gate — habría creado 5 links muertos a
   productos Gumroad inexistentes), se aplicó a `main` directamente solo el
   fix de dominio + `inject-kit-cta.mjs` con `READY_KITS` filtrando a los 4
   kits con guía mapeada y producto vivo (commit `531328a`). La rama
   `trip-kits-cta` queda stale — no mergear as-is, ya no aporta nada que
   `main` no tenga (y el resto de sus permalinks siguen sin producto real).

## NOTES — 2026-08-01 (kit gen-2 ES: Termas del Sur)

Kit 11 y PRIMERO EN ESPAÑOL: `termas-del-sur-4d` (US$12.90, 4 días). Wedge sobre la
query GSC "termas de chillán" (~79 imp/3sem, pos ~45 — ranking regalado, sin producto
que la capture). Contenido 100% reutilizado de `termas-de-chillan.html` (ES) + POIs del
catálogo Panoramas con `descripcion_es` (cero datos inventados; "punulaf" y
"jardín del corazón" tienen demanda GSC pero NO existe contenido en el repo — quedan
fuera por regla anti-alucinación).

Cambios de pipeline (retrocompatibles: los 10 PDFs EN regeneran idénticos):
- `kits.config.mjs`: campo `lang` por kit (fija idioma, independiente de `--lang`),
  `affQuery` opcional para los links de afiliado, y `PAYHIP_URLS` (las 10 URLs reales
  de la migración 2026-07-30 + la nueva en `null`).
- `compile-html.mjs`: carcasa parametrizada por idioma (`I18N`); las strings EN quedan
  idénticas al gen-1. Sección #pois se omite si el catálogo no tiene cobertura.
- `lib/panoramas.mjs`: `topPois({lang, exclude})` — ES usa `descripcion_es`;
  `exclude` para dedup editorial (el catálogo triplica Termas de Chillán).
- `build-pdf.mjs` / `make-mockups.mjs`: idioma por kit (footer "página", keywords ES,
  badges ES).
- `inject-kit-cta.mjs`: URL de compra = Payhip si existe en `PAYHIP_URLS` (si no,
  permalink Gumroad); kits con `lang` solo se inyectan en guías de ese idioma.
  `termas-de-chillan` mapeada al kit nuevo pero FUERA de `READY_KITS` (gate: sin
  producto real no se publica el link — lección 2026-07-28). Corrida de verificación:
  `changed=0 skipped=51 notReady=1`.

Verificación: `npm test` 5/5; `npm run all` → 11 HTML + 11 PDF + 44 PNG; el PDF ES
tiene 13 páginas A4, 567 KB, metadata ES embebida; revisión visual de portada, día 1
y presupuesto OK. Gates: check-html, check-links, check-affiliate-ids, check-hreflang,
check-sitemap — todos OK.

QUEDA (humano + próxima sesión):
1. Patricio crea el producto en Payhip (ficha completa: `listings/termas-del-sur-4d.md`;
   PDF en `dist/termas-del-sur-4d-es.pdf`, mockups en `mockups-out/termas-del-sur-4d-*`).
   Gumroad espejo opcional (permalink exacto `termas-del-sur-4d`, comisión 10% vs 5%).
2. Con la URL real: pegar en `PAYHIP_URLS['termas-del-sur-4d']`, agregar el kit a
   `READY_KITS`, correr `node inject-kit-cta.mjs` (inyecta solo en la guía ES),
   re-correr los 5 gates y pushear.
3. Cosmético conocido: en `termas-del-sur-4d-main.png` el badge de precio solapa
   levemente el título largo (mismo patrón gen-1; no bloquea).

## NOTES — 2026-08-01 (tanda 2: kits 12-13 ES + bundle "Chile Completo")

Dos kits gen-2 ES nuevos (sin cablear — gate Payhip) + primer producto bundle.

**K12 `radal-siete-tazas-3d` (US$12.90, 3 días, ES).** Wedge GSC: "velo de la novia"
(62 imp, pos ~9). Contenido 100% de `radal-siete-tazas-curico.html` (ES). Curiosidad
editorial: SIN sección de POIs bonus — la cobertura del catálogo Panoramas en
Molina/Curicó es boilerplate autogenerado ("Mirador en Libertador General Bernardo
O'Higgins, Chile." — región errada incluida); `poiComunas: []` → `compile-html.mjs`
omite la sección entera (nada de relleno en un producto de pago). PDF:
`dist/radal-siete-tazas-3d-es.pdf`, 10 páginas A4, 1.021.521 bytes. Mockups OK
(solape leve badge/título, mismo cosmético conocido de termas, no bloquea).

**K13 `santiago-cajon-4d-es` (US$9.90, 4 días, ES).** Gemelo ES de `santiago-cajon-4d`
(mismo molde/ruta, copy ES, pulls a las guías ES raíz). Permalink `santiago-cajon-es`
para no colisionar con el EN. 10 POIs ES reales (dedup editorial: fuera los 5 lugares
que ya son contenido de los días 1-4). PDF: `dist/santiago-cajon-4d-es-es.pdf`
(sí, doble `-es`: `${id}-${lang}`), 13 páginas, 724.261 bytes.

**B1 `chile-completo-bundle` (US$59).** Los 11 kits del corte (10 EN + termas ES;
suma US$163, ahorro 64%) en UN zip: `dist/chile-completo-bundle.zip`
(7.057.399 bytes, 11 PDFs verificados con `unzip -l`). Regenerar tras `npm run all`:
`cd trip-kits/dist && zip -j chile-completo-bundle.zip <los 11 PDFs>`. NO es kit del
pipeline: no va en kits.config ni en el inyector. Sin mockup propio (reusar
`patagonia-14d-main.png` si hace falta portada). Los 2 kits ES de esta tanda NO
entran al bundle (posteriores al corte) — evaluar v2 si se publican.
Punto de inserción en el sitio documentado en el listing (bloque `.cta` del índice,
~línea 431); no implementado: sin URL aún.

**Cambios de pipeline (retrocompatibles — los 11 PDFs anteriores regeneran idénticos):**
- `kits.config.mjs`: entries K12/K13 + `PAYHIP_URLS` de ambos en `null` (productos
  aún no creados; el código /b/<CODE> lo genera Payhip, NO inventarlo).
- `inject-kit-cta.mjs`: `MAP` ahora acepta string o ARRAY de kits por guía. Por
  idioma se elige el kit con `lang` fijo que calce; si no, el gen-1 (sin lang).
  SWAP: si la guía ya tiene el CTA de otro kit, se reemplaza el bloque completo
  (nunca 2 CTAs). Idempotencia por `utm_campaign=<id>"` con borde de comilla
  (`santiago-cajon-4d` es substring de `santiago-cajon-4d-es`). Con los kits nuevos
  FUERA de `READY_KITS`, el inyector corre idéntico a antes (verificado smoke test
  en /tmp con fixtures: changed=0, skip correctos, swap ES solo tras agregar a READY).
- `test/kits-config.test.mjs` (nuevo): invariantes de los 13 kits (ids/permalinks
  únicos, route.length === days.length, pulls/budget/FAQ contra headings reales de
  las guías). `npm test` 7/7.
- `tools/chrome/gen-product-specs.mjs` (repo RAÍZ, cambio local no commiteado ahí):
  honra `- File:` en la sección Gumroad del listing (el bundle entrega zip, no PDF);
  sin ese ajuste el parser lanzaba "Falta PDF" con el listing del bundle presente.

Verificación: `npm run all` → 13 HTML + 13 PDF + 52 PNG; PDFs nuevos re-leídos con
pdf-lib (páginas/metadata ES) + revisión visual de mockups (portada y presupuesto).
Gates: check-html, check-links, check-affiliate-ids, check-hreflang, check-sitemap OK.
NO se corrió el inyector contra las guías reales (gate: sin producto no hay CTA).

QUEDA (humano — crear 3 productos, fichas en `listings/`):
1. Payhip: radal-siete-tazas-3d ($12.90, PDF `-es.pdf`), santiago-cajon-4d-es ($9.90,
   PDF `-es-es.pdf`), chile-completo-bundle ($59, zip). Gumroad espejo opcional
   (permalinks EXACTOS en cada listing).
2. Con las URLs reales: pegar en `PAYHIP_URLS`, agregar ambos kits a `READY_KITS`,
   correr `node inject-kit-cta.mjs`:
   - radal: inyecta CTA nuevo en `radal-siete-tazas-curico.html` (ES).
   - santiago-cajon-4d-es: SWAP del CTA EN por el ES en `santiago.html` y
     `cajon-del-maipo.html` (ES); en/pt siguen con el kit EN.
   - bundle: nada que inyectar (producto puro de marketplace).
3. Re-correr los 5 gates, verificar el CTA en prod con curl/DOM vivo y pushear.

## NOTES — 2026-08-01 (cierre tanda 2: los 3 productos LIVE)

Productos creados y verificados por Patricio (Payhip + espejo Gumroad, ambos LIVE):
radal-siete-tazas-3d → https://payhip.com/b/ZD0xY · santiago-cajon-4d-es →
https://payhip.com/b/asZlb · chile-completo-bundle → https://payhip.com/b/BI8z0.

Cableado ejecutado (commit `cce68a3`, pusheado a main):
- `PAYHIP_URLS` con las 2 URLs reales; ambos kits en `READY_KITS`.
- `inject-kit-cta.mjs` → `changed=3 skipped=50 notReady=0`: CTA nuevo en
  `radal-siete-tazas-curico.html` (ES) + SWAP EN→ES en `santiago.html` y
  `cajon-del-maipo.html` (un solo CTA por guía, UTM `utm_campaign=<id>`).
  en/pt NO tocadas: siguen con el kit EN (`Qrh0p`). Idempotente (2ª corrida changed=0).
- Listings actualizados con las URLs reales (los 3).
- 5 gates verdes. Verificación prod post-deploy (curl):
  ZD0xY ×1 en /radal-siete-tazas-curico.html; asZlb ×1 en /santiago.html y
  /cajon-del-maipo.html; Qrh0p ×1 y asZlb ×0 en en/ y pt/ de ambas.
- Bundle: nada que inyectar (producto puro de marketplace); landing opcional del
  bundle queda diferida (punto de inserción documentado en su listing).

## NOTES — 2026-08-01 (cierre: kit Termas del Sur LIVE)

Producto creado y verificado por Patricio: **Payhip https://payhip.com/b/XDjCS**
(US$12.90, PDF adjunto, "Product Added" confirmado) + espejo Gumroad
https://gumroad.com/l/termas-del-sur-4d (US$12.90, 200 anónimo). Cableado ejecutado:
URL en `PAYHIP_URLS`, kit en `READY_KITS`, `inject-kit-cta.mjs` → `changed=1`
(solo `termas-de-chillan.html` ES, antes de `.promo`, UTM `utm_campaign=termas-del-sur-4d`).
5 gates verdes. Verificación prod (GitHub Pages): CTA visible en
https://guias.viajesypanoramas.cl/termas-de-chillan.html.

## NOTES — 2026-08-01 (growth-agent: puerto-montt sumada a chiloe-lakes-5d)

Con los 13 kits ya cableados y live, revisé qué guías del cluster de un kit ya
LIVE seguían sin CTA (superficie de afiliación sin costo de contenido nuevo ni
gate humano). `puerto-montt.html` (agregada 2026-07-21 como puerta de entrada a
Los Lagos/Chiloé/Carretera Austral) era la única huérfana: sus vecinas directas
(`puerto-varas`, `frutillar`, `chiloe`, `saltos-del-petrohue`) ya ofrecían
`chiloe-lakes-5d` (Payhip `hdBVf`, US$9.9, producto real y en `READY_KITS` desde
la tanda del 2026-07-28) y la guía misma dice textualmente que "la mayoría...
prefiere dormir en Puerto Varas" — mismo viaje, mismo kit.

Cambio: una línea en `MAP` de `inject-kit-cta.mjs`
(`'puerto-montt': 'chiloe-lakes-5d'`) + `node inject-kit-cta.mjs` →
`changed=3` (`puerto-montt.html`, `en/puerto-montt.html`, `pt/puerto-montt.html`,
CTA antes de `.promo`). Idempotente (2ª corrida `changed=0`). No se tocó
`kits.config.mjs`, `READY_KITS` ni ningún otro kit/guía. 5 gates verdes
(`check-html`, `check-links`, `check-affiliate-ids`, `check-hreflang`,
`check-sitemap`). `npm test` no corrió limpio en este sandbox por falta de
`node_modules`/dependencias de red (cheerio no instalado, `panoramas.json` del
repo hermano ausente) — falla preexistente del entorno, no relacionada con este
cambio (no toca `kits.config.mjs` ni `lib/panoramas.mjs`).

## NOTES — 2026-08-01 (tanda 3: kits 14-15 ES)

Dos kits gen-2 ES nuevos (sin cablear — gate Payhip), gemelos de los dos kits EN
mejor rankeados del catálogo. Catálogo final: 15 kits (10 gen-1 EN + 5 gen-2 ES).

**K14 `atacama-5d-es` (US$12.90, 5 días, ES).** Gemelo ES de `atacama-5d` (mismo
molde/recorrido: llegada y aclimatación → Valle de la Luna → Tatio → lagunas
altiplánicas/Piedras Rojas → Cejar + astronómico; copy ES nuevo). Contenido 100%
de `san-pedro-de-atacama.html` (ES, raíz). 7 POIs bonus reales tras dedup
editorial (fuera los 6 lugares que ya son contenido de los días 1-5) y exclusión
del boilerplate autogenerado del catálogo (fichas "Mirador en Antofagasta,
Chile.", stubs de 53 chars, stats Ramsar/Santuario, hostal con reseña EN,
camping duplicado — verificado 2026-08-01; quedan sandboard, Pukará de Quitor,
iglesia, Termas de Puritama, Valle del Arcoíris, Aldea de Tulor, Caracoles).
Permalink `atacama-5d-es` (distinto del EN para no colisionar). PDF:
`dist/atacama-5d-es-es.pdf` (doble `-es`: `${id}-${lang}`), 14 páginas A4,
640.084 bytes, metadata ES embebida (verificado con pdf-lib).

**K15 `torres-del-paine-5d-es` (US$12.90, 5 días, ES).** Gemelo ES de
`tdp-no-car` (mismo ángulo "sin auto": Punta Arenas → Puerto Natales → tour de
día completo → Base Torres en el día → margen: Última Esperanza o Isla
Magdalena; copy ES nuevo). Contenido de `torres-del-paine.html`,
`puerto-natales.html` y `punta-arenas.html` (ES, raíz) — 3 tablas de presupuesto
2026. 10 POIs bonus reales tras dedup editorial (fuera los 8 lugares que ya son
contenido de los días 1-5) y exclusión de junk (stub EN de 52 chars, camping
con reseña EN, ficha stats de hectáreas — verificado 2026-08-01; quedan Cerro de
la Cruz, Glaciar Grey, mercado, Cementerio Sara Braun, museos, Seno Otway,
Dorotea, Nao Victoria, Fuerte Bulnes, Reserva Magallanes). Permalink
`torres-del-paine-5d-es`. PDF: `dist/torres-del-paine-5d-es-es.pdf`, 15 páginas
A4, 635.661 bytes, metadata ES (verificado con pdf-lib).

**Cambios de pipeline (retrocompatibles — los 13 PDFs anteriores regeneran idénticos):**
- `kits.config.mjs`: entries K14/K15 con `lang: 'es'`, `affQuery`, y días/rutas
  ES PROPIOS (`ATACAMA_DAYS_ES`/`ATACAMA_ROUTE_ES`, `TDP_DAYS_ES`/`TDP_ROUTE_ES`
  — mismas coords que los EN, nombres ES; las constantes EN no se tocan para que
  los PDFs EN regenere idénticos). `PAYHIP_URLS` de ambos en `null` (productos
  aún no creados; el código /b/<CODE> lo genera Payhip, NO inventarlo).
- `inject-kit-cta.mjs`: `MAP` de las 4 guías ahora con arrays EN+ES
  (`san-pedro-de-atacama`: `['atacama-5d', 'atacama-5d-es']`; `torres-del-paine`,
  `puerto-natales`, `punta-arenas`: `['tdp-no-car', 'torres-del-paine-5d-es']`).
  Kits nuevos FUERA de `READY_KITS` (gate: sin producto real no hay CTA —
  lección 2026-07-28): el filtro READY deja solo el kit EN y el inyector corre
  idéntico a antes.
- `test/kits-config.test.mjs`: invariante de conteo actualizado a 15 kits.
  `npm test` 7/7 (incluye pulls/budget/FAQ contra headings reales de las guías
  para los 15 kits + topPois de San Pedro de Atacama y Natales).

Verificación: `npm run all` → 15 HTML (`build/`) + 15 PDF (`dist/`) + 60 PNG
(`mockups-out/`). PDFs nuevos re-leídos con pdf-lib (páginas/metadata ES OK) y
revisión visual de mockups (portada `-main.png` y presupuesto `-preview-3.png`
de ambos): contenido correcto; solape leve del badge de precio sobre el título
largo (mismo cosmético conocido de termas/radal/santiago-es, no bloquea). Gates:
check-html, check-links, check-affiliate-ids, check-hreflang, check-sitemap OK.
NO se corrió el inyector contra las guías reales. Smoke test en /tmp con
fixtures: con los kits fuera de READY `changed=0 skipped=4` (idéntico a antes);
simulando READY, SWAP EN→ES solo en las guías ES (`changed=2`), en/pt intactas,
un solo CTA por guía, idempotente en 2ª corrida.

QUEDA (humano — crear 2 productos, fichas en `listings/atacama-5d-es.md` y
`listings/torres-del-paine-5d-es.md`):
1. Payhip: atacama-5d-es ($12.90, PDF `-es-es.pdf`, 14 págs) y
   torres-del-paine-5d-es ($12.90, PDF `-es-es.pdf`, 15 págs). Gumroad espejo
   opcional (permalinks EXACTOS: `atacama-5d-es` y `torres-del-paine-5d-es`).
2. Con las URLs reales: pegar en `PAYHIP_URLS`, agregar ambos kits a
   `READY_KITS`, correr `node inject-kit-cta.mjs`:
   - SWAP EN→ES del CTA en `san-pedro-de-atacama.html` (ES).
   - SWAP EN→ES en `torres-del-paine.html`, `puerto-natales.html` y
     `punta-arenas.html` (ES). en/pt siguen con los kits EN (`lBTyt`, `9CyLp`).
3. Re-correr los 5 gates, verificar el CTA en prod con curl/DOM vivo y pushear.
4. Cosmético conocido (todas las portadas ES): badge de precio solapa levemente
   el título largo en `-main.png` — mismo patrón gen-1, no bloquea; evaluar fix
   global de tipografía de portada si se retocan los mockups.

## NOTES — 2026-08-01 (ronda 4: 7 kits gen-3 ES cableados y LIVE)

Los 7 kits gen-3 ES (construidos en paralelo por agentes constructores, PDFs
verificados) fueron publicados en Payhip y aquí se cablearon los CTAs. Catálogo
final: **21 kits en `KITS`** (10 gen-1 EN + 5 gen-2 ES + 6 gen-3 ES) +
malalcahuello registrado solo en `PAYHIP_URLS` (ver abajo).

| Kit | US$ | Payhip | CTA en guía(s) ES |
|---|---|---|---|
| chiloe-5d-es | 12.90 | https://payhip.com/b/f6KZF | SWAP EN→ES en `chiloe.html` y `puerto-montt.html` |
| pucon-4d-es | 12.90 | https://payhip.com/b/RlCHK | SWAP EN→ES en `pucon-villarrica.html` |
| valparaiso-vina-3d-es | 9.90 | https://payhip.com/b/Itnmo | SWAP EN→ES en `valparaiso.html` |
| carretera-austral-norte-7d-es | 14.90 | https://payhip.com/b/JY2nc | SWAP EN→ES en `carretera-austral.html` |
| valle-elqui-4d-es | 12.90 | https://payhip.com/b/3za2d | SWAP EN→ES en `la-serena-coquimbo.html` y `valle-del-elqui.html` |
| iquique-altiplano-4d-es | 12.90 | https://payhip.com/b/x90rj | CTA NUEVO en `iquique.html` y `arica.html` |
| malalcahuello-conguillio-4d-es | 12.90 | https://payhip.com/b/O7gIr | **nada** — sin guía destino (ver abajo) |

Cableado ejecutado (integrador ronda 4):
- `kits.config.mjs`: 6 entries nuevas (días/rutas ES como constantes propias
  `*_ES`/gen-3, mismo patrón que tanda 3; contenido integrado tal cual lo
  dejaron los constructores — pulls a headings EXACTOS verificados por ellos)
  + 7 URLs en `PAYHIP_URLS`. `test/kits-config.test.mjs`: invariante 15→21.
  `npm test` 7/7.
- `inject-kit-cta.mjs`: `MAP` con arrays EN+ES en las 7 guías de swap +
  entradas nuevas `iquique`/`arica` (string, kit ES-only); los 6 kits a
  `READY_KITS`. Corrida: `changed=9 skipped=49 notReady=0` (7 swaps + 2 CTAs
  nuevos); 2ª corrida `changed=0` (idempotente). en/pt NO tocadas: siguen con
  los kits EN (verificado: `utm_campaign` EN intacto en en/pt; en/pt de
  iquique/arica sin CTA).
- 5 gates verdes: check-html, check-links, check-affiliate-ids, check-hreflang,
  check-sitemap.
- PDFs copiados a `dist/` para uniformidad (orden local, gitignored):
  pucon-4d-es, valparaiso-vina-3d-es, valle-elqui-4d-es, iquique-altiplano-4d-es
  y malalcahuello-conguillio-4d-es (el bundle `bundle-sur-de-chile` referencia
  `dist/`). Los 7 PDFs ya estaban adjuntos en sus productos Payhip.
- Scripts de build de los constructores preservados en repo:
  `build-chiloe-5d-es.mjs` (+ `kits.config.chiloe-5d-es.mjs`),
  `build-valparaiso-vina-3d-es.mjs` (+ `kit-valparaiso-vina-3d-es.config.mjs`),
  `build-iquique-altiplano.mjs` (+ `kits.iquique-altiplano.config.mjs`),
  `build-austral-norte.mjs` (autocontenido). Los generadores de pucon y
  valle-elqui vivían en `build/<slug>/` (gitignored): su contenido ya quedó
  integrado en `kits.config.mjs` — rebuilds futuros por el pipeline estándar.

**malalcahuello-conguillio-4d-es — por qué no está en `KITS` ni en el inyector:**
(a) NO existe guía de la zona en el repo (ni malalcahuello/conguillío/curacautín
tienen HTML raíz/en/pt) — el kit se construyó sin guías fuente, con contenido de
autoría propia: `days` con `html` propio, `budgetRows`, `pois` curados a mano —
shape incompatible con `compile-html.mjs` y con `test/kits-config.test.mjs`;
(b) sin guía destino no hay CTA que inyectar, y NO se inyecta en guías ajenas
con CTA live (regla un CTA por guía). Su build standalone vive en
`build/malalcahuello-conguillio-4d-es/` y su URL Payhip está registrada en
`PAYHIP_URLS`. Acción previa sugerida (de su listing): crear la guía ES
`malalcahuello-conguillio` y cablear con el flujo estándar.

QUEDA:
1. Verificación prod (GitHub Pages, 1-3 min tras push): curl a iquique.html,
   chiloe.html y valle-del-elqui.html confirmando el CTA con la URL Payhip ES.
2. Bundle Sur de Chile (Payhip TZa3f, US$29): ya publicado con su zip; si se
   regenera, incluir los 4 PDFs de `dist/` que le corresponden.
3. Evaluar guía ES `malalcahuello-conguillio` para darle superficie de venta
   al 7º kit (contenido base ya existe en su `kit-data.mjs`).

## NOTES — 2026-08-01 (cierre ronda 4: guía destino para el kit huérfano malalcahuello)

El kit `malalcahuello-conguillio-4d-es` era el único de los 8 de ronda 4 sin guía destino
donde enlazar su Payhip (https://payhip.com/b/O7gIr, LIVE). Se creó la guía ES
`malalcahuello-conguillio.html` (raíz) con contenido derivado de su propio
`build/malalcahuello-conguillio-4d-es/kit-data.mjs` (días, presupuesto, FAQ — mismos
valores "referencia 2026" y la instrucción de confirmar tarifas CONAF en conaf.cl /
pasesparques.cl), esqueleto copiado de `iquique.html` y 4 fotos CC de Wikimedia Commons
verificadas (thumbs 500/960/1280 → 200; Wikimedia ya no sirve tamaños arbitrarios como
480/640/768 en fotos nuevas — los srcset de esta guía usan los buckets vigentes).

Cableado del CTA: el kit NO se integró a `KITS` (sigue con su shape propio incompatible
con `compile-html.mjs` y `test/kits-config.test.mjs`, ver nota ronda 4) ni al `MAP` del
inyector — el CTA quedó escrito a mano en la guía con el formato exacto del inyector
(mismo bloque `.kit-cta`, texto patrón ES, UTM
`utm_source=guias&utm_medium=cta&utm_campaign=malalcahuello-conguillio-4d-es`, antes de
`.promo`). Comentario actualizado en `inject-kit-cta.mjs` para que nadie lo agregue al
MAP sin integrarlo antes en KITS (rompería el inyector). El inyector corre idéntico a
antes (la guía no está en MAP → no la toca).

Cambios sitio: guía nueva + tarjeta en `index.html` (posición norte→sur: entre
Concepción y Pucón; ItemList JSON-LD 25→26 renumerado) + entrada en `sitemap.xml`
(solo hreflang es — guía ES-only, sin en/pt; `check-hreflang.mjs` solo itera pares
desde `en/`, así que no exige nada más) + `img/og/malalcahuello-conguillio.jpg`
(1280×664, derivada de la portada del kit — lautaroj, CC BY 2.0) registrada en
`img/og/credits.json`. En/pt NO existen: tarea futura si se traduce (agregar entradas
hreflang + sitemap en/pt como el resto).

Verificación: 5 gates verdes (check-html, check-links, check-affiliate-ids,
check-hreflang, check-sitemap). Verificación prod post-push: curl 200 en
/malalcahuello-conguillio.html con el link payhip.com/b/O7gIr en el HTML servido.

## NOTES — 2026-08-01 (ronda 6: kit EN malalcahuello-conguillio-4d-en, sin cablear — gate Payhip)

Gemelo ENGLISH del kit ronda 4 `malalcahuello-conguillio-4d-es` (US$12.90, 4 días).
La guía EN `en/malalcahuello-conguillio.html` ya está LIVE (commit `29bec32`) y hoy
enlaza el kit ES (O7gIr) con la nota "currently available in Spanish only" — con el
producto EN publicado, ese CTA pasa a ser pleno.

**Mismo shape custom que el ES, a propósito** (ver nota ronda 4): NO va en `KITS`,
`READY_KITS`, `PAYHIP_URLS` ni en `test/kits-config.test.mjs` — `days` con `html`
propio, `budgetRows` y `pois` curados a mano son incompatibles con `compile-html.mjs`
y con las invariantes del pipeline. Build standalone en
`build/malalcahuello-conguillio-4d-en/` (gitignored, orden local):
- `kit-data.mjs` — traducción real del ES (mismo itinerario/cifras); precios CLP con
  ≈USD a la regla del repo (CLP = USD × 1000) y nota "Referential 2026 prices —
  check conaf.cl/pasesparques.cl" en el intro del presupuesto; km/°C sin convertir.
- `build.mjs` — réplica exacta del `build.mjs` ES con carcasa EN: strings IDÉNTICAS
  a `I18N.en` de `compile-html.mjs`, footer "page", keywords metadata EN, Viator sin
  `/es-CL`. Misma cadena: `../../assets/pdf.css` + `../../lib/chromium.mjs` +
  playwright-core + pdf-lib desde `trip-kits/node_modules`. `node build.mjs` genera
  HTML + PDF en el propio dir; PDF copiado a `dist/malalcahuello-conguillio-4d-en.pdf`
  (uniformidad con los demás dist/, gitignored).
- `CREDITS.md` + `portada-conguillio.jpg` — misma foto CC BY 2.0 (lautaroj, vía
  Wikimedia Commons), atribución impresa EN en la página de recursos del PDF.

Verificación: PDF 13 páginas A4, 884.944 bytes, metadata EN embebida (re-leído con
pdf-lib); preview visual con el mismo mecanismo de `make-mockups.mjs` (element
screenshots Chromium de #cover, #day-1, #budget, #route, #faq) — sin texto cortado
ni overflow. Listing spec: `listings/malalcahuello-conguillio-4d-en.json` (mismo
shape que los listings r4). `npm test` 7/7 (sin tocar KITS ni los invariantes).
Pipeline compartido intacto: `compile-html.mjs`, `kits.config.mjs`, `inject-kit-cta.mjs`
y tests sin cambios.

QUEDA (humano/agente CDP — crear 1 producto, ficha en el listing JSON):
1. Payhip: malalcahuello-conguillio-4d-en ($12.90, PDF `dist/malalcahuello-conguillio-4d-en.pdf`,
   13 págs). Pendiente registrado en `tools/chrome/payhip-pending-r6.json` (repo raíz).
   Gumroad espejo opcional (permalink exacto `malalcahuello-conguillio-4d-en`).
2. Con la URL real /b/<CODE>: actualizar A MANO el CTA de `en/malalcahuello-conguillio.html`
   (NO el inyector — el kit no está en KITS): href → URL nueva, utm_campaign →
   `malalcahuello-conguillio-4d-en`, y QUITAR la nota `<em>...Spanish only.</em>`
   (texto final en `guias_cta.texto_html_template` del listing). La guía ES raíz
   sigue con el kit ES O7gIr — no tocarla; pt/ no existe.
3. Re-correr los 5 gates, verificar el CTA en prod con curl/DOM vivo y pushear.

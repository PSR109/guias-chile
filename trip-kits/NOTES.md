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

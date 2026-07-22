# ESTADO — Guías de Chile

> Archivo de operaciones del sitio. Lo leen el dueño (Patricio) y el agente de
> crecimiento diario (`.github/workflows/growth-agent.yml`). Mantener < 150 líneas.
> Última actualización: 2026-07-21 (SEO técnico: meta description recortada a
> <=160 car. en TdP/Puerto Natales/Punta Arenas/La Serena-Coquimbo/Rapa Nui × 3 idiomas, 15 páginas fuera del trim de `6171dda`; JSON-LD Article sincronizado. Trip-kits en sección 5).

## 1. Estado actual del sitio

- **Qué es:** sitio estático de guías de viaje por Chile, monetizado con afiliados.
- **Hosting:** GitHub Pages, dominio propio **guias.viajesypanoramas.cl** ✅
  (repo `PSR109/guias-chile`, rama `main` publica automáticamente). Certificado
  HTTPS aprobado y `https_enforced: true` verificado.
- **Páginas (69 de guía):** `index.html` (portada) + 23 guías ES (19 + Santiago +
  Puerto Natales + Punta Arenas + La Serena/Coquimbo + Rapa Nui, ciclos
  apps-runner 2026-07-12/13), **todas con versión `en/*.html` recíproca (23/23,
  base PR #27 + guías nuevas) y versión `pt/*.html` recíproca (23/23, base PRs
  #28-#37 + guías nuevas)** · `privacy-policy.html` · `creditos.html`.
  Además: `sitemap.xml` (68 URLs), `robots.txt`, `llms.txt` (discovery para
  crawlers de IA, 24/24 guías ES desde 2026-07-21 — **sin gate de CI**, a mano
  con cada guía nueva), `estilo.css`, `afiliados.js`, `analytics.js`. Las guías
  llevan trío de structured data
  FAQ+Breadcrumb+Article (PRs #38/#43/#44).
- **Plantilla de cada guía:** logo SVG en el header (no emoji — 🇨🇱 no renderiza
  en todas las plataformas, reemplazado 2026-07-08) + `<link rel="icon"
  href="favicon.svg">` en el `<head>` + línea de frescura/autoría bajo el H1
  ("Actualizado <mes año> · Escrito desde Puerto Varas por Patagonia
  SimRacing") + FAQ JSON-LD + tabla de precios orientativos + bloque `.cta`
  con **2 botones de afiliado activos** (`data-afiliado="viator|gyg"`, cada
  uno con `pid`/`partner_id` **hardcodeado en el href** — no depender solo de
  `afiliados.js`, ver nota abajo — y una línea corta `.afiliado-nota`
  diferenciando el proveedor) + bloque `.promo` con cross-link a la app
  Panoramas (`https://viajesypanoramas.cl/`, las 7 páginas de contenido ya lo
  tienen) + nota de transparencia + entrada en `sitemap.xml` + **fotos reales
  con atribución** (ver abajo). Civitatis **no lleva botón** (afiliado sin
  cuenta activa, ver sección 2) — no agregarlo a guías nuevas hasta tener un
  `civitatis_aid` real.
- **Fotos (WP 2.6, ✅ 0 guías sin imagen):** las 7 guías de contenido (+ 5 EN) tienen
  foto hero (`fetchpriority="high"`, sin lazy) y 1-2 fotos intercaladas
  (`loading="lazy"`), todas de Wikimedia Commons (CC BY/BY-SA/CC0), con
  `<figcaption>` de atribución (autor + licencia + link a Commons, requisito
  legal CC) y `og:image` en el `<head>`; `index.html` tiene thumbnail por
  tarjeta. Patrón: API `commons.wikimedia.org/w/api.php`
  (`generator=categorymembers|search`, `prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900`)
  — OJO: Commons *bucketea* `iiurlwidth`, medir el archivo real descargado
  antes de fijar `width`/`height` (si no, layout shift). No commitear
  binarios: enlazar directo a `upload.wikimedia.org`.
- **Monetización:** IDs en `afiliados.js` (`window.PSR_AFILIADOS`), pero el
  `pid`/`partner_id` va **hardcodeado en cada href** del HTML servido (no solo
  vía JS, por copy-link/crawlers); `afiliados.js` queda como red de seguridad
  idempotente.
  - GetYourGuide: **ACTIVO** (`gyg_partner: "BZYZJT4"`).
  - Viator: **ACTIVO** (`viator_pid: "P00308789"`, `pid=...&mcid=42383&medium=link`).
  - Civitatis: pendiente y **sin botón en el sitio** (`civitatis_aid` vacío,
    ver ACCIONES-HUMANAS #4).
- **Analítica:** `analytics.js` (beacon sin cookies) envía `pageview`/`click`
  a `https://viajesypanoramas.cl/api/eventos` (doc. en `privacy-policy.html`).
  Desde 2026-07-12 además **beacon Cloudflare Web Analytics** (cookieless) en
  las 62 páginas — TODA guía nueva debe incluir, junto a `analytics.js`, la
  línea: `<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "713691dd44164a07adfba071603dbf4f"}'></script>`.
  ✅ CORS del lado del Worker de Panoramas resuelto (allowlist incluye
  `https://guias.viajesypanoramas.cl`, `worker/index.js` commit `88b1b25`,
  2026-07-08) — verificado en vivo 2026-07-09: preflight OPTIONS y POST real
  ambos → `204` con `Access-Control-Allow-Origin` correcto. Nota vieja de
  este archivo quedó desactualizada, no era un bloqueo real.
- **CI:** `.github/workflows/ci.yml` valida HTML, links internos, IDs de
  afiliado y reciprocidad hreflang en cada PR y push a `main`.

## 2. ACCIONES HUMANAS pendientes (solo Patricio puede hacerlas)

- [ ] **Civitatis:** registrarse en el programa de afiliados de Civitatis
      (https://www.civitatis.com/es/afiliados/) → pegar el `aid` en
      `afiliados.js` (`civitatis_aid`) y commitear.
- [ ] **Declarar el dominio en los paneles de afiliados:** ahora que
      `guias.viajesypanoramas.cl` sirve con HTTPS válido, declararlo (y
      `viajesypanoramas.cl`) como fuente de tráfico autorizada en los paneles
      de partner de GetYourGuide y Viator (los ToS lo exigen; riesgo de
      retención de comisiones si no se hace).

## 3. BACKLOG del agente diario (elegir 1 ítem por corrida, mayor impacto en ingresos primero)

### Guías (24 destinos, cobertura nacional + insular completa)
✅ Todos los destinos de alto volumen cubiertos (tandas 2026-07-08 a 07-13:
Santiago, Puerto Natales, Punta Arenas, La Serena/Coquimbo, Rapa Nui + 19
previos). Cada guía nace con `en/*.html` + `pt/*.html` recíprocos (19/19 EN
PR #27, 19/19 PT-BR PRs #28-#37; luego +5 con las guías nuevas = 24/24 ambos).
Interlinking "guías cercanas" (PR #46) y CTA temprano de afiliados (commit
`b7755c7`) ya en las 72 páginas. No queda destino pendiente en este backlog.

### Infraestructura / analítica
- [x] Analítica ligera (`analytics.js` → `/api/eventos` del worker de Panoramas, CORS resuelto).
- [x] Links inversos: `app_panoramas` enlaza a estas guías desde `/region/:slug`
      (PR #59 de `app_panoramas`, 2026-07-13).
- [ ] Deep links de afiliados producto-a-producto (requiere API con
      credenciales de GYG/Viator; hoy son búsquedas refinadas).

### Mantenimiento recurrente
- [ ] Refresco anual de precios y tarifas CONAF en todas las tablas
      (etiquetadas "2026" — actualizar a 2027 cuando corresponda).

## 4. Reglas para el agente

- Nunca push directo a `main`: siempre rama + PR. El PR se auto-mergea solo si
  `ci.yml` pasa en verde (gates: HTML, links internos, afiliados, hreflang, sitemap).
- No inventar IDs de afiliado ni tocar secretos/workflows.
- **`index.html` (portada, 2026-07-08):** las tarjetas van ordenadas norte→sur (geografía real
  de Chile, no el orden de creación). Cada `<div class="tarjeta">` lleva `data-region="..."` y
  `data-nombre="..."` (usados por el buscador/filtro JS del pie de la página — no tocar esos
  atributos al copiar el patrón). Al agregar una guía nueva: insertar su tarjeta en la posición
  norte-sur correcta entre las existentes (no siempre al final), con su región real. Si la guía
  nueva tiene versión `en/`, agregar el badge `<a class="idioma-en">` como **hermano** del
  `<a class="tarjeta-link">` (nunca anidar un `<a>` dentro de otro `<a>` — rompe el layout en
  navegadores reales aunque el validador de `check-html.mjs` no lo detecte).
- Toda página nueva: logo SVG + favicon en el `<head>`, línea de frescura bajo
  el H1, FAQ JSON-LD, tabla de precios, **2 CTAs de afiliado** (Viator + GYG,
  con `pid`/`partner_id` hardcodeado en el href + `rel="sponsored noopener"
  target="_blank"` estáticos + línea `.afiliado-nota` — nunca agregar botón
  Civitatis sin `aid` real), bloque `.promo` con link a
  `https://viajesypanoramas.cl/`, `analytics.js` incluido, canonical/og
  (incluyendo `og:image`), tarjeta con thumbnail en `index.html` y entrada en
  `sitemap.xml`. **Ninguna guía nueva nace sin foto real** (mínimo 1 hero de
  Wikimedia Commons con atribución — ver patrón en la sección 1).
- Precios siempre "orientativos" con rango, nunca exactos.

## 5. Trip Kits (PDFs vendibles, Etsy/Gumroad) — `trip-kits/`

Pipeline en `trip-kits/` (README propio ahí) convierte guías EN + catálogo
Panoramas en PDFs de itinerario. **10 SKUs** (5 del plan original 2026-07-21 +
5 nuevos de la misma corrida: Santiago+Cajón del Maipo, Valparaíso+Colchagua,
Pucón-Villarrica, La Serena+Elqui, Rapa Nui — cubren ahora también Chile
central y Rapa Nui, no solo Patagonia/Atacama). Todo verificado local: `npm
test`, `npm run all` (compila HTML→PDF→mockups), 5 gates de `ci.yml` — los 10
kits compilan sin error de heading y los 10 PDFs quedan 300-700 KB (límite
Etsy 20 MB). PDFs llevan metadata propia (Title/Author/Subject/Keywords vía
`pdf-lib`) para discoverability fuera de Etsy/Gumroad. Label de marca en la
portada: "Chile Trip Kits" (ya no "Patagonia Trip Kits" — el catálogo excede
Patagonia; la tienda Gumroad sigue siendo `patagoniatrips.gumroad.com`, cuenta
real de Patricio, sin tocar).

**Bloqueado en 100% humano:** Patricio crea la cuenta Gumroad
(`patagoniatrips`) → sube los 10 PDFs de `trip-kits/dist/` con el copy de
`trip-kits/listings/*.md` → recién ahí mergear `trip-kits-cta` (branch
separada, CTA cross-sell en las guías de los 5 kits originales, NO tocar) y
extenderla a las guías de los 5 kits nuevos (santiago, cajon-del-maipo,
valparaiso, colchagua-pichilemu, pucon-villarrica, la-serena-coquimbo,
valle-del-elqui, rapa-nui × 3 idiomas) — hoy `main` no tiene ninguna referencia
pública a trip-kits (verificado), es intencional: no hay URL de producto real
para linkear todavía. Detalle de decisiones y pendientes en `trip-kits/NOTES.md`.

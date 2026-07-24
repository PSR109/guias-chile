# ESTADO — Guías de Chile

> Archivo de operaciones del sitio. Lo leen el dueño (Patricio) y el agente de
> crecimiento diario (`.github/workflows/growth-agent.yml`). Mantener < 150 líneas.
> Última actualización: 2026-07-21 (auditoría externa de Patricio: newsletter +
> mapa + comentarios agregados a las 25 guías, ver sección 1; commit `bbc1e67`).

## 1. Estado actual del sitio

- **Qué es:** sitio estático de guías de viaje por Chile, monetizado con afiliados.
- **Hosting:** GitHub Pages, dominio propio **guias.viajesypanoramas.cl** ✅
  (repo `PSR109/guias-chile`, rama `main` publica automáticamente). Certificado
  HTTPS aprobado y `https_enforced: true` verificado.
- **Páginas (72 de guía):** `index.html` (portada) + 24 guías ES (23 previas +
  Puerto Montt, 2026-07-21), **todas con versión `en/*.html` recíproca (24/24)
  y versión `pt/*.html` recíproca (24/24)** · `privacy-policy.html` ·
  `creditos.html`. Además: `sitemap.xml` (79 URLs), `robots.txt`, `llms.txt`
  (discovery para crawlers de IA, 25/25 guías ES — **sin gate de CI**, a mano
  con cada guía nueva), `estilo.css`, `afiliados.js`, `analytics.js`. Las guías
  llevan trío de structured data FAQ+Breadcrumb+Article (PRs #38/#43/#44).
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
  ✅ CORS resuelto (allowlist en `worker/index.js` de Panoramas incluye
  `https://guias.viajesypanoramas.cl`) — verificado en vivo 2026-07-09.
- **CI:** `.github/workflows/ci.yml` valida HTML, links internos, IDs de
  afiliado y reciprocidad hreflang en cada PR y push a `main`.
- **Newsletter/mapa/comentarios (2026-07-21, commit `bbc1e67`):** las 25 guías
  (×3 idiomas) llevan mapa embebido (iframe Google Maps sin API key),
  formulario de boletín inline + popup no invasivo (`boletin.js`, POST a
  `/api/eventos` type=`newsletter` — mismo pipeline `public.leads` de
  Panoramas, migración `0024` de ese repo) y sección de comentarios (Giscus:
  Discussions habilitado, repo-id/category-id reales ya cableados).
  **Pendiente 100% humano:** instalar la app en
  https://github.com/apps/giscus → repo `guias-chile`, para que giscus pueda
  publicar hilos (hoy loguea "not installed", no rompe la página).

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

### Guías (25 destinos, cobertura nacional + insular completa)
✅ Todos los destinos de alto volumen cubiertos, + Puerto Montt (2026-07-21,
hallazgo de auditoría: puerta de entrada a Los Lagos/Chiloé/Carretera Austral
mencionada sin link en 2+ guías, ahora con guía propia + interlinking real
desde puerto-varas.html, carretera-austral.html y chiloe.html). Cada guía
nace con `en/*.html` + `pt/*.html` recíprocos (24/24 ambos). Interlinking
"guías cercanas" (PR #46) y CTA temprano de afiliados (commit `b7755c7`) ya
en las páginas. No queda destino evidente pendiente en este backlog.

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
  Civitatis sin `aid` real), bloque `.promo` con **deep link a la página de
  REGIÓN** de Panoramas (ver la regla dedicada abajo — ya no al home pelado),
  `analytics.js` incluido, canonical/og
  (incluyendo `og:image`), tarjeta con thumbnail en `index.html` y entrada en
  `sitemap.xml`. **Ninguna guía nueva nace sin foto real** (mínimo 1 hero de
  Wikimedia Commons con atribución — ver patrón en la sección 1).
- **Article JSON-LD lleva `datePublished` + `dateModified` (2026-07-24):** ambos son
  obligatorios en todo bloque `"@type":"Article"`. Lo exige `checkArticleJsonLd()` dentro de
  `scripts/check-html.mjs`, así que una guía sin ellos sale **CI-roja** — el gate existe
  porque 5 guías (las de mayor valor turístico) se habían quedado sin fechas mientras las
  otras 60 sí las tenían, y nada lo detectaba. `dateModified` se actualiza al editar la guía.
- **El `.promo` deep-linkea a la región, nunca al home (2026-07-24):** el link va a
  `https://viajesypanoramas.cl[/en|/pt]/region/<slug>` con el slug REAL de la región de la guía,
  y el copy nombra esa región. Antes las 25 guías × 3 idiomas mandaban al home pelado: quien
  terminaba de leer Puerto Varas aterrizaba en un buscador nacional vacío y tenía que volver a
  escribir dónde estaba. Además el home no monetiza y la página de región sí (CTA de afiliados +
  paywall de comuna). El mapeo guía→región **se lee de los `data-region` de las tarjetas de
  `index.html`**, que ya existían para el filtro de la portada — no se mantiene una segunda lista
  (ver `scripts/promo-deep-links-2026-07-24.mjs`). Dos slugs NO salen de un slugify mecánico:
  `Metropolitana` → `metropolitana-de-santiago` y `O'Higgins` → `libertador-general-bernardo-o-higgins`.
  **`check-links.mjs` ignora enlaces externos a propósito**, así que un slug mal escrito acá NO
  sale CI-rojo: al agregar o cambiar uno, curlearlo a mano. Los 3 hubs (`index.html`, `en/`, `pt/`)
  siguen apuntando al home — su alcance es nacional.
- Precios siempre "orientativos" con rango, nunca exactos.

## 5. Trip Kits (PDFs vendibles, Etsy/Gumroad) — `trip-kits/`

Pipeline en `trip-kits/` (README propio ahí) convierte guías EN + catálogo
Panoramas en PDFs de itinerario. **10 SKUs** (Patagonia/Atacama + Chile
central + Rapa Nui). Verificado local (`npm test`, `npm run all`, 5 gates
`ci.yml`): los 10 compilan sin error, PDFs 300-700 KB (límite Etsy 20 MB),
metadata propia (`pdf-lib`). Marca en portada: "Chile Trip Kits". Tienda
Gumroad `patagoniatrips.gumroad.com` (cuenta real de Patricio, sin tocar).

**Bloqueado en 100% humano:** Patricio crea la cuenta Gumroad
(`patagoniatrips`) → sube los 10 PDFs de `trip-kits/dist/` con el copy de
`trip-kits/listings/*.md` → recién ahí mergear `trip-kits-cta` (branch
separada, CTA cross-sell en las guías de los 5 kits originales, NO tocar) y
extenderla a las guías de los 5 kits nuevos (santiago, cajon-del-maipo,
valparaiso, colchagua-pichilemu, pucon-villarrica, la-serena-coquimbo,
valle-del-elqui, rapa-nui × 3 idiomas) — hoy `main` no tiene ninguna referencia
pública a trip-kits (verificado), es intencional: no hay URL de producto real
para linkear todavía. Detalle de decisiones y pendientes en `trip-kits/NOTES.md`.

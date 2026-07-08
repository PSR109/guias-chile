# ESTADO — Guías de Chile

> Archivo de operaciones del sitio. Lo leen el dueño (Patricio) y el agente de
> crecimiento diario (`.github/workflows/growth-agent.yml`). Mantener < 150 líneas.
> Última actualización: julio 2026 (WP 2.6 — fotos reales en todas las guías).

## 1. Estado actual del sitio

- **Qué es:** sitio estático de guías de viaje por Chile, monetizado con afiliados.
- **Hosting:** GitHub Pages, dominio propio **guias.viajesypanoramas.cl** ✅
  (repo `PSR109/guias-chile`, rama `main` publica automáticamente). Certificado
  HTTPS aprobado y `https_enforced: true` verificado.
- **Páginas (8):**
  1. `index.html` — portada con tarjetas + CTA Chile general
  2. `puerto-varas.html`
  3. `saltos-del-petrohue.html`
  4. `frutillar.html`
  5. `torres-del-paine.html` (con hreflang a la versión EN)
  6. `san-pedro-de-atacama.html`
  7. `en/torres-del-paine.html` (inglés)
  8. `privacy-policy.html`
  Además: `sitemap.xml`, `robots.txt`, `estilo.css`, `afiliados.js`, `analytics.js`.
- **Plantilla de cada guía:** FAQ JSON-LD + tabla de precios orientativos + bloque
  `.cta` con 3 botones de afiliado (`data-afiliado="viator|civitatis|gyg"`) +
  bloque `.promo` con cross-link a la app Panoramas (`https://viajesypanoramas.cl/`,
  las 7 páginas de contenido ya lo tienen) + nota de transparencia + entrada en
  `sitemap.xml` + **fotos reales con atribución** (ver abajo).
- **Fotos (WP 2.6, ✅ 0 guías sin imagen):** las 6 guías de contenido (+ EN) tienen
  foto hero (`fetchpriority="high"`, sin lazy) y 1-2 fotos intercaladas
  (`loading="lazy"`), todas de Wikimedia Commons (CC BY/BY-SA/CC0), con
  `<figcaption>` de atribución (autor + licencia, enlazando a la página de
  Commons — requisito legal de las licencias CC) y `og:image` en el `<head>`.
  `index.html` también tiene thumbnail por tarjeta. Patrón para páginas nuevas:
  API pública `commons.wikimedia.org/w/api.php` (`action=query&generator=categorymembers`
  o `generator=search`, `prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900`) —
  OJO: Commons *bucketea* `iiurlwidth` a anchos fijos (330/500/960/1280…), el ancho
  real servido no es el pedido — medir el tamaño real del archivo descargado antes
  de fijar `width`/`height` en el `<img>` (si no, layout shift). No commitear
  binarios: enlazar directo a `upload.wikimedia.org`.
- **Monetización:** centralizada en `afiliados.js` (`window.PSR_AFILIADOS`).
  - GetYourGuide: **ACTIVO** (`gyg_partner: "BZYZJT4"`, agrega `partner_id` a los enlaces).
  - Viator: **ACTIVO** (`viator_pid: "P00308789"`, registrado 2026-07-07, agrega `pid`+`mcid`).
  - Civitatis: pendiente (`civitatis_aid` vacío → enlaces sin comisión).
- **Analítica:** `analytics.js` (beacon propio, sin cookies) envía `pageview` +
  `click` por botón de afiliado a `https://viajesypanoramas.cl/api/eventos`.
  Documentado en `privacy-policy.html`. El Worker de Panoramas aún no tiene CORS
  habilitado para este origen (lane del repo `app_panoramas`) — mientras tanto
  el POST se manda igual (Content-Type `text/plain`, sin preflight) y solo se
  pierde la lectura de la respuesta, que no se usa.
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

### Nuevas guías (misma plantilla que las existentes)
- [ ] Chiloé (castro, palafitos, iglesias UNESCO — alto volumen de búsqueda)
- [ ] Pucón – Villarrica (volcán, termas, deportes de aventura)
- [ ] Carretera Austral (ruta, tramos, ferries)
- [ ] Valparaíso (cerros, ascensores, day trip desde Santiago)
- [ ] Cajón del Maipo (embalse El Yeso, termas, day trip desde Santiago)
- [ ] Valle del Elqui (observatorios, pisco, Vicuña)

### Versiones EN (siguiendo el patrón de en/torres-del-paine.html: hreflang recíproco + sitemap)
- [ ] en/san-pedro-de-atacama.html
- [ ] en/puerto-varas.html
- [ ] en/frutillar.html
- [ ] en/saltos-del-petrohue.html
- [ ] en/ + resto de guías a medida que existan

### Infraestructura / analítica
- [x] Analítica ligera: beacon a `/api/eventos` del worker de Panoramas — hecho
      (`analytics.js`). Pendiente del lado de `app_panoramas`: habilitar CORS
      para este origen (fuera del alcance de este repo).
- [ ] Links inversos: que App Panoramas enlace a estas guías desde sus
      fichas de destino (cambio en el repo `app_panoramas`, en curso ahí).
- [ ] Deep links de afiliados producto-a-producto (hoy son búsquedas
      refinadas por atractivo específico, no product ID real — requiere API
      con credenciales de GYG/Viator).

### Mantenimiento recurrente
- [ ] Refresco anual de precios y tarifas CONAF en todas las tablas
      (etiquetadas "2026" — actualizar a 2027 cuando corresponda).

## 4. Reglas para el agente

- Nunca push directo a `main`: siempre rama + PR. El PR se auto-mergea solo si
  `ci.yml` pasa en verde (gates: HTML, links internos, afiliados, hreflang, sitemap).
- No inventar IDs de afiliado ni tocar secretos/workflows.
- Toda página nueva: FAQ JSON-LD, tabla de precios, 3 CTAs de afiliado, bloque
  `.promo` con link a `https://viajesypanoramas.cl/`, `analytics.js` incluido,
  canonical/og (incluyendo `og:image`), tarjeta con thumbnail en `index.html` y
  entrada en `sitemap.xml`. **Ninguna guía nueva nace sin foto real** (mínimo 1
  hero de Wikimedia Commons con atribución — ver patrón en la sección 1).
- Precios siempre "orientativos" con rango, nunca exactos.

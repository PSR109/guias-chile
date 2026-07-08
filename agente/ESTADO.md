# ESTADO — Guías de Chile

> Archivo de operaciones del sitio. Lo leen el dueño (Patricio) y el agente de
> crecimiento diario (`.github/workflows/growth-agent.yml`). Mantener < 150 líneas.
> Última actualización: julio 2026 (en/saltos-del-petrohue.html agregado).

## 1. Estado actual del sitio

- **Qué es:** sitio estático de guías de viaje por Chile, monetizado con afiliados.
- **Hosting:** GitHub Pages, dominio propio **guias.viajesypanoramas.cl** ✅
  (repo `PSR109/guias-chile`, rama `main` publica automáticamente). Certificado
  HTTPS aprobado y `https_enforced: true` verificado.
- **Páginas (12):**
  1. `index.html` — portada con tarjetas + CTA Chile general
  2. `puerto-varas.html` (con hreflang a la versión EN)
  3. `saltos-del-petrohue.html` (con hreflang a la versión EN)
  4. `frutillar.html` (con hreflang a la versión EN)
  5. `torres-del-paine.html` (con hreflang a la versión EN)
  6. `san-pedro-de-atacama.html` (con hreflang a la versión EN)
  7. `en/torres-del-paine.html` (inglés)
  8. `en/san-pedro-de-atacama.html` (inglés)
  9. `en/puerto-varas.html` (inglés)
  10. `en/frutillar.html` (inglés)
  11. `en/saltos-del-petrohue.html` (inglés)
  12. `privacy-policy.html`
  Además: `sitemap.xml`, `robots.txt`, `estilo.css`, `afiliados.js`, `analytics.js`.
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
- **Monetización:** IDs centralizados en `afiliados.js` (`window.PSR_AFILIADOS`),
  pero el `pid`/`partner_id` va **hardcodeado en cada href** del HTML servido
  (no solo agregado por JS) — un audit 2026-07-08 encontró que el HTML crudo
  no llevaba el parámetro, así que copiar-link/crawlers/bots perdían la
  comisión. `afiliados.js` sigue corriendo como red de seguridad idempotente
  (por si algún href nuevo se olvida de hardcodearlo), pero ya no es la única
  fuente de verdad.
  - GetYourGuide: **ACTIVO** (`gyg_partner: "BZYZJT4"` / `partner_id=BZYZJT4` en el href).
  - Viator: **ACTIVO** (`viator_pid: "P00308789"`, registrado 2026-07-07 / `pid=P00308789&mcid=42383&medium=link` en el href).
  - Civitatis: pendiente y **sin botón en el sitio** (`civitatis_aid` vacío,
    sin cuenta — ver ACCIONES-HUMANAS #4). Color/clase CSS se conservan
    dormant para reactivar fácil el día que exista `aid` real.
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
- [x] en/san-pedro-de-atacama.html
- [x] en/puerto-varas.html
- [x] en/frutillar.html
- [x] en/saltos-del-petrohue.html
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

# ESTADO — Guías de Chile

> Archivo de operaciones del sitio. Lo leen el dueño (Patricio) y el agente de
> crecimiento diario (`.github/workflows/growth-agent.yml`). Mantener < 150 líneas.
> Última actualización: 2026-07-11 (ciclo apps-runner — EN 19/19 completo, PT 9/19 en marcha).

## 1. Estado actual del sitio

- **Qué es:** sitio estático de guías de viaje por Chile, monetizado con afiliados.
- **Hosting:** GitHub Pages, dominio propio **guias.viajesypanoramas.cl** ✅
  (repo `PSR109/guias-chile`, rama `main` publica automáticamente). Certificado
  HTTPS aprobado y `https_enforced: true` verificado.
- **Páginas (19 guías):** `index.html` (portada) + 19 guías ES, **todas con
  versión `en/*.html` recíproca (19/19, PR #27)** y 9 con versión `pt/*.html`
  (`san-pedro-de-atacama`, `puerto-varas`, `torres-del-paine`,
  `pucon-villarrica`, `valparaiso`, `chiloe`, `carretera-austral`,
  `cajon-del-maipo`, `valle-del-elqui` — 9/19) · `privacy-policy.html`. Además:
  `sitemap.xml`, `robots.txt`, `estilo.css`, `afiliados.js`, `analytics.js`.
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

### Nuevas guías (misma plantilla que las existentes)
- [x] Chiloé (castro, palafitos, iglesias UNESCO — alto volumen de búsqueda)
- [x] Pucón – Villarrica (volcán, termas, deportes de aventura)
- [x] Carretera Austral (ruta, tramos, ferries)
- [x] Valparaíso (cerros, ascensores, day trip desde Santiago)
- [x] Cajón del Maipo (embalse El Yeso, termas, day trip desde Santiago)
- [x] Valle del Elqui (observatorios, pisco, Vicuña)

**Backlog ampliado 2026-07-09 — cobertura nacional (regiones sin guía todavía):**
- [x] Arica (Región de Arica y Parinacota — playas, Valle de Azapa, geoglifos)
- [x] Iquique (Región de Tarapacá — duna, Zofri, deportes aéreos, pampa)
- [x] Copiapó / Bahía Inglesa (Región de Atacama — astroturismo, playas turquesa)
- [x] Ruta del Vino de Colchagua / Pichilemu (Región de O'Higgins — vino, surf)
- [x] Radal Siete Tazas / Curicó (Región del Maule — ruta del vino, termas)
- [x] Termas de Chillán (Región de Ñuble — nieve, termas)
- [x] Concepción / Salto del Laja (Región del Biobío)
- [x] Valdivia (Región de Los Ríos — ríos, cervecerías, Parque Oncol)

### Versiones EN — ✅ 19/19 completo (PR #27, 2026-07-10)
Toda guía nueva nace ya con su `en/*.html` (regla en sección 4).

### Versiones PT-BR (siguiendo el patrón de pt/torres-del-paine.html: hreflang recíproco es/en/pt + sitemap)
- [x] pt/san-pedro-de-atacama.html
- [x] pt/puerto-varas.html
- [x] pt/torres-del-paine.html
- [x] pt/pucon-villarrica.html
- [x] pt/valparaiso.html
- [x] pt/chiloe.html
- [x] pt/carretera-austral.html
- [x] pt/cajon-del-maipo.html
- [x] pt/valle-del-elqui.html
- [ ] pt/arica.html
- [ ] pt/iquique.html
- [ ] pt/copiapo-bahia-inglesa.html
- [ ] pt/colchagua-pichilemu.html
- [ ] pt/radal-siete-tazas-curico.html
- [ ] pt/termas-de-chillan.html
- [ ] pt/concepcion-salto-del-laja.html
- [ ] pt/valdivia.html
- [ ] pt/saltos-del-petrohue.html
- [ ] pt/frutillar.html

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

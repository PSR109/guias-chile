# ESTADO — Guías de Chile

> Archivo de operaciones del sitio. Lo leen el dueño (Patricio) y el agente de
> crecimiento diario (`.github/workflows/growth-agent.yml`). Mantener < 150 líneas.
> Última actualización: julio 2026.

## 1. Estado actual del sitio

- **Qué es:** sitio estático de guías de viaje por Chile, monetizado con afiliados.
- **Hosting:** GitHub Pages — https://psr109.github.io/guias-chile/ (repo `PSR109/guias-chile`, rama `main` publica automáticamente).
- **Páginas (7):**
  1. `index.html` — portada con tarjetas + CTA Chile general
  2. `puerto-varas.html`
  3. `saltos-del-petrohue.html`
  4. `frutillar.html`
  5. `torres-del-paine.html` (con hreflang a la versión EN)
  6. `san-pedro-de-atacama.html`
  7. `en/torres-del-paine.html` (inglés)
  Además: `privacy-policy.html`, `sitemap.xml`, `robots.txt`, `estilo.css`, `afiliados.js`.
- **Plantilla de cada guía:** FAQ JSON-LD + tabla de precios orientativos + bloque
  `.cta` con 3 botones de afiliado (`data-afiliado="viator|civitatis|gyg"`) +
  nota de transparencia + entrada en `sitemap.xml`.
- **Monetización:** centralizada en `afiliados.js` (`window.PSR_AFILIADOS`).
  - GetYourGuide: **ACTIVO** (`gyg_partner: "BZYZJT4"`, agrega `partner_id` a los enlaces).
  - Viator: pendiente (`viator_pid` vacío → enlaces sin comisión).
  - Civitatis: pendiente (`civitatis_aid` vacío → enlaces sin comisión).

## 2. ACCIONES HUMANAS pendientes (solo Patricio puede hacerlas)

- [ ] **#1 Viator:** registrarse en el Viator Partner Program
      (https://www.viator.com/partner/) con el sitio declarado →
      pegar el `pid` en `afiliados.js` (`viator_pid`) y commitear.
- [ ] **#2 Civitatis:** registrarse en el programa de afiliados de Civitatis
      (https://www.civitatis.com/es/afiliados/) → pegar el `aid` en
      `afiliados.js` (`civitatis_aid`) y commitear.
- [ ] **#3 Dominio propio:** decisión en curso (comprar dominio y apuntarlo a
      GitHub Pages vs. quedarse en psr109.github.io). Impacta canónicas y sitemap.
- [ ] **#4 GetYourGuide:** verificar que ESTE sitio esté declarado como fuente de
      tráfico en la cuenta de partner de GetYourGuide del dueño (ID `BZYZJT4`,
      ya activo y usado también en App Panoramas).

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
- [ ] en/ + resto de guías a medida que existan

### Infraestructura / analítica
- [ ] Analítica ligera: beacon a `/api/eventos` del worker de Panoramas.
      **Bloqueado:** requiere habilitar CORS para este origen en el worker
      (repo app_panoramas) antes de emitir nada desde aquí.
- [ ] Links inversos: que App Panoramas enlace a estas guías desde sus
      fichas de destino (cambio en el repo app_panoramas).

### Mantenimiento recurrente
- [ ] Refresco anual de precios y tarifas CONAF en todas las tablas
      (etiquetadas "2026" — actualizar a 2027 cuando corresponda).

## 4. Reglas para el agente

- Nunca push directo a `main`: siempre rama + PR.
- No inventar IDs de afiliado ni tocar secretos/workflows.
- Toda página nueva: FAQ JSON-LD, tabla de precios, 3 CTAs de afiliado,
  canonical/og, tarjeta en `index.html` y entrada en `sitemap.xml`.
- Precios siempre "orientativos" con rango, nunca exactos.

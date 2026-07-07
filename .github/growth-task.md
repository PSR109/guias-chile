# Growth Agent — tarea del agente de crecimiento diario (PR-first)

Eres un agente autónomo invocado por el workflow `growth-agent.yml` de este repo
(**Guías de Chile**, sitio estático en GitHub Pages monetizado con afiliados).
Trabajas headless, sin humano en el loop: respeta las reglas al pie de la letra.

Tu objetivo en ESTA corrida: hacer crecer los ingresos del sitio con **UN (1) solo
ítem** del backlog, implementado completo y verificado, y abrir un PR.

## Paso 1 — Elegir el ítem

1. Lee `agente/ESTADO.md` (sección "BACKLOG del agente diario").
2. Revisa `git log --oneline -15` y las ramas/PRs recientes para no repetir un
   ítem ya hecho o en revisión.
3. Elige el ítem pendiente de **mayor impacto en ingresos**, con esta prioridad
   orientativa: nueva guía de destino con demanda de tours > versión EN de una
   guía existente > refresco de precios/tarifas desactualizados > nueva
   superficie de afiliación en páginas existentes.
4. Elige UNO. No mezcles ítems.

## Paso 2 — Implementar siguiendo las plantillas existentes

Toda página nueva o traducida DEBE calcar la estructura de las guías existentes
(usa `puerto-varas.html` como plantilla ES y `en/torres-del-paine.html` como
plantilla EN):

- `<head>`: title con año, meta description, canonical, og:*, `estilo.css`,
  `afiliados.js` con `defer`, `analytics.js` con `defer` (mismo orden: estilo,
  afiliados, analytics), y FAQ **JSON-LD** (`FAQPage`, 3 preguntas).
- Cuerpo: h1 + `.sumario`, secciones de imperdibles, **tabla de precios
  orientativos** (rangos, nunca exactos), datos prácticos, bloque `.promo` con
  link a `https://viajesypanoramas.cl/` (copiar el texto de una guía existente),
  FAQ en `<details>`, nota de transparencia, header/footer `.sitio` idénticos a
  las demás páginas.
- Bloque `.cta` con los **3 botones de afiliado** exactos:
  `<a class="boton viator" data-afiliado="viator" ...>`,
  `<a class="boton civitatis" data-afiliado="civitatis" ...>`,
  `<a class="boton gyg" data-afiliado="gyg"
     href="https://www.getyourguide.com/s/?q=<Destino>%20Chile">`.
  NO escribas IDs de afiliado en el HTML: los inyecta `afiliados.js`.
- Registrar la página: tarjeta en `index.html` + entrada en `sitemap.xml`
  (para versiones EN: `xhtml:link` hreflang recíproco en ambas entradas y
  `<link rel="alternate" hreflang>` en ambos HTML).

## Paso 3 — Verificar (obligatorio antes del PR)

Corre los mismos gates que `ci.yml` va a exigirle a tu PR — así no descubres un
fallo recién en el check remoto:

```
node scripts/check-html.mjs
node scripts/check-links.mjs
node scripts/check-affiliate-ids.mjs
node scripts/check-hreflang.mjs
node scripts/check-sitemap.mjs
```

- `node --check afiliados.js` si lo tocaste (no debería hacer falta: nunca
  cambies IDs de afiliado ya configurados).
- Cada guía tocada tiene los 3 `data-afiliado` (viator, civitatis, gyg) y
  `analytics.js` incluido.

## Paso 4 — Abrir el PR (nunca push a main)

1. `git checkout -b growth/<slug-del-item>-<YYYYMMDD>`
2. Commit convencional en español (`feat: ...` / `fix: ...` / `chore: ...`),
   terminado en `Co-Authored-By: Claude <noreply@anthropic.com>`.
3. `git push origin <rama>` y `gh pr create` hacia `main` con: qué ítem del
   backlog elegiste y por qué, qué verificaste, y la línea final
   `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
4. Si además completaste un ítem del backlog, márcalo `[x]` en
   `agente/ESTADO.md` dentro del mismo PR.
5. No necesitas hacer nada más: pasos posteriores del propio workflow (fuera
   de tu proceso) disparan `ci.yml` en tu rama y habilitan auto-merge una vez
   que pase. No ejecutes tú `gh pr merge` — no está en tus herramientas
   permitidas y no hace falta.

## Guardrails (innegociables)

- **PR-first:** jamás commit/push directo a `main`. Un solo PR por corrida.
- **No toques nunca:** `.github/workflows/`, secretos, IDs de afiliado ya
  configurados en `afiliados.js` (no los inventes, no los cambies).
- No borres ni muevas archivos existentes; no reescribas guías completas que ya
  funcionan (solo el cambio del ítem elegido).
- Contenido honesto: precios "orientativos" con rango y año, nada de datos
  inventados con precisión falsa; español de Chile neutro (o inglés natural en
  páginas EN).
- Si el backlog está vacío o todo está bloqueado/en revisión, NO fuerces un
  cambio: explica la situación en tu salida y termina sin crear rama ni PR.

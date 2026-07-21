# Trip Kits — pipeline PDF para Etsy/Gumroad

Convierte las guias EN de este repo + el catalogo de Panoramas en 5 PDFs de itinerario vendibles.

## Comandos (desde trip-kits/)
- `npm test` — tests del extractor y selector de POIs
- `npm run all` — compila HTML (build/), genera PDFs (dist/) y mockups (mockups-out/)
- `node inject-kit-cta.mjs` — inyecta CTAs en las guias (idempotente; vive en branch trip-kits-cta hasta que Gumroad este live)
- `node compile-html.mjs --lang es` — variante es/pt (fuera de alcance v1, el pipeline ya lo soporta)

## Reglas duras
- build/, dist/, mockups-out/ y node_modules/ estan gitignoreados. NUNCA commitear PDFs (repo publico = producto gratis).
- Fotos: solo img/og/*.jpg self-hosted. Nada de Wikimedia.
- Precios y permalinks canonicos: kits.config.mjs. Copy de listings: listings/*.md.
- Chromium: usa el de gstack via lib/chromium.mjs (no descargar navegadores).

## SKUs y precios
Ver kits.config.mjs (5 SKUs, US$9.90-29). Los permalinks Gumroad DEBEN coincidir con gumroadPermalink.

# Trip Kits — pipeline PDF para Etsy/Gumroad

Convierte las guias EN de este repo + el catalogo de Panoramas en PDFs de itinerario vendibles.
10 SKUs (5 originales del plan 2026-07-21 + 5 nuevos del mismo dia, misma corrida —
ver `kits.config.mjs`, seccion "kits nuevos 2026-07-21"): cubren ahora tambien Santiago,
Valparaiso/Colchagua, Pucon-Villarrica, La Serena/Elqui y Rapa Nui (antes solo Patagonia
sur + Atacama). Label de marca en la portada del PDF: "Chile Trip Kits" (no "Patagonia
Trip Kits" — el catalogo ya no es solo Patagonia; la URL de la tienda Gumroad sigue
siendo patagoniatrips.gumroad.com, eso no se toca, es la cuenta real de Patricio).

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
Ver kits.config.mjs (10 SKUs, US$9.90-29). Los permalinks Gumroad DEBEN coincidir con gumroadPermalink.

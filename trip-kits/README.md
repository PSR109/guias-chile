# Trip Kits — pipeline PDF para Etsy/Gumroad

Convierte las guias de este repo + el catalogo de Panoramas en PDFs de itinerario vendibles.
13 SKUs (10 gen-1 EN del 2026-07-21 + 3 gen-2 ES del 2026-08-01: termas-del-sur-4d,
radal-siete-tazas-3d, santiago-cajon-4d-es — ver `kits.config.mjs` y NOTES.md). Los
gen-2 fijan `lang: 'es'` por kit: guia fuente ES raiz + carcasa ES. Label de marca en
la portada del PDF: "Chile Trip Kits" (no "Patagonia Trip Kits" — el catalogo ya no es
solo Patagonia; la URL de la tienda Gumroad sigue siendo patricio358.gumroad.com, eso
no se toca, es la cuenta real de Patricio).

## Comandos (desde trip-kits/)
- `npm test` — tests del extractor y selector de POIs
- `npm run all` — compila HTML (build/), genera PDFs (dist/) y mockups (mockups-out/)
- `node inject-kit-cta.mjs` — inyecta CTAs en las guias (idempotente; vive en branch trip-kits-cta hasta que Gumroad este live)
- `node compile-html.mjs --lang es` — variante es/pt (fuera de alcance v1, el pipeline ya lo soporta)

## Reglas duras
- build/, dist/, mockups-out/ y node_modules/ estan gitignoreados. NUNCA commitear PDFs (repo publico = producto gratis).
- Fotos: solo img/og/*.jpg self-hosted. Nada de Wikimedia.
- Precios y permalinks canonicos: kits.config.mjs. Copy de listings: listings/*.md.
- Chromium: usa el de gstack via lib/chromium.mjs (no descargar navegadores). `chromiumPath()` resuelve la cache de Playwright por OS (Windows/macOS/Linux); si falla con ENOENT, confirma que Playwright ya tenga Chromium instalado en la cache de ese SO.

## SKUs y precios
Ver kits.config.mjs (13 SKUs, US$9.90-29). Los permalinks Gumroad DEBEN coincidir con gumroadPermalink.
El bundle `chile-completo-bundle` (US$59, zip con 11 PDFs) NO es un kit del pipeline:
vive solo en `listings/chile-completo-bundle.md` + `dist/chile-completo-bundle.zip`.

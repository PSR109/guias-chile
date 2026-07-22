#!/usr/bin/env node
// Auditoría externa 2026-07-21 (Patricio) — ejecuta de una vez 3 de los 12
// puntos que resultaron gaps reales tras verificar el codigo (ver respuesta
// completa en el chat): #7 newsletter, #12 mapa, #11 comentarios (Giscus,
// pendiente 1 click humano: instalar la app en github.com/apps/giscus).
// Corre UNA vez, es idempotente (detecta marcador y salta el archivo si ya
// se aplico) — pensado para re-ejecutar seguro si se agrega una guia nueva.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SLUGS = [
  ["arica", "Arica, Chile"],
  ["iquique", "Iquique, Chile"],
  ["san-pedro-de-atacama", "San Pedro de Atacama, Chile"],
  ["copiapo-bahia-inglesa", "Bahía Inglesa, Caldera, Chile"],
  ["la-serena-coquimbo", "La Serena, Chile"],
  ["valle-del-elqui", "Valle del Elqui, Chile"],
  ["valparaiso", "Valparaíso, Chile"],
  ["santiago", "Cerro San Cristóbal, Santiago, Chile"],
  ["cajon-del-maipo", "Cajón del Maipo, Chile"],
  ["colchagua-pichilemu", "Santa Cruz, Valle de Colchagua, Chile"],
  ["radal-siete-tazas-curico", "Radal Siete Tazas, Chile"],
  ["termas-de-chillan", "Termas de Chillán, Chile"],
  ["concepcion-salto-del-laja", "Salto del Laja, Chile"],
  ["pucon-villarrica", "Pucón, Chile"],
  ["valdivia", "Valdivia, Chile"],
  ["frutillar", "Frutillar, Chile"],
  ["saltos-del-petrohue", "Saltos de Petrohué, Chile"],
  ["puerto-varas", "Puerto Varas, Chile"],
  ["puerto-montt", "Puerto Montt, Chile"],
  ["chiloe", "Castro, Chiloé, Chile"],
  ["carretera-austral", "Carretera Austral, Chile"],
  ["torres-del-paine", "Parque Nacional Torres del Paine, Chile"],
  ["puerto-natales", "Puerto Natales, Chile"],
  ["punta-arenas", "Punta Arenas, Chile"],
  ["rapa-nui", "Rapa Nui, Chile"],
];

const GISCUS_REPO_ID = "R_kgDOTPqQVw";
const GISCUS_CATEGORY_ID = "DIC_kwDOTPqQV84DBszv"; // "Announcements" — solo la app crea hilos, cero spam de hilos random

const LOCALES = {
  es: {
    dir: "",
    lang: "es",
    mapaH2: "Ubicación en el mapa",
    mapaTitle: (q) => `Mapa: ${q}`,
    boletinH3: "Recibe los 5 mejores panoramas del fin de semana",
    boletinP: "Un correo a la semana con ideas para tu próximo viaje. Sin spam, cancela cuando quieras.",
    placeholder: "tu@correo.com",
    boton: "Quiero recibirlos",
    comentariosH2: "Comentarios y valoraciones",
    comentariosIntro: "¿Ya fuiste? Cuéntanos qué te pareció.",
  },
  en: {
    dir: "en/",
    lang: "en",
    mapaH2: "Location on the map",
    mapaTitle: (q) => `Map: ${q}`,
    boletinH3: "Get the 5 best weekend trips, every week",
    boletinP: "One email a week with ideas for your next trip. No spam, unsubscribe anytime.",
    placeholder: "you@email.com",
    boton: "Sign me up",
    comentariosH2: "Comments & ratings",
    comentariosIntro: "Been there? Tell us what you thought.",
  },
  pt: {
    dir: "pt/",
    lang: "pt",
    mapaH2: "Localização no mapa",
    mapaTitle: (q) => `Mapa: ${q}`,
    boletinH3: "Receba os 5 melhores passeios do fim de semana",
    boletinP: "Um e-mail por semana com ideias para sua próxima viagem. Sem spam, cancele quando quiser.",
    placeholder: "seu@email.com",
    boton: "Quero receber",
    comentariosH2: "Comentários e avaliações",
    comentariosIntro: "Já foi? Conte o que achou.",
  },
};

const MARKER = "<!-- growth-2026-07-21 -->";

function buildBlock(locale, slug, query) {
  const encoded = encodeURIComponent(query);
  return `${MARKER}
  <section class="mapa">
    <h2>${locale.mapaH2}</h2>
    <div class="mapa-embed">
      <iframe src="https://www.google.com/maps?q=${encoded}&output=embed" width="100%" height="320" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${locale.mapaTitle(query)}"></iframe>
    </div>
  </section>

  <div class="cta boletin">
    <h3>${locale.boletinH3}</h3>
    <p>${locale.boletinP}</p>
    <form class="boletin-form" data-boletin data-fuente="guias-${slug}">
      <input type="email" name="email" required placeholder="${locale.placeholder}" aria-label="Email" autocomplete="email">
      <input type="text" name="contact_time_x9" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button type="submit" class="boton boletin-boton">${locale.boton}</button>
    </form>
    <p class="boletin-estado" role="status" hidden></p>
  </div>

  <section class="comentarios">
    <h2>${locale.comentariosH2}</h2>
    <p class="comentarios-intro">${locale.comentariosIntro}</p>
    <script src="https://giscus.app/client.js"
      data-repo="PSR109/guias-chile"
      data-repo-id="${GISCUS_REPO_ID}"
      data-category="Announcements"
      data-category-id="${GISCUS_CATEGORY_ID}"
      data-mapping="pathname"
      data-strict="1"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="bottom"
      data-theme="preferred_color_scheme"
      data-lang="${locale.lang}"
      crossorigin="anonymous"
      async>
    </script>
  </section>
`;
}

function addSrcset(html) {
  // Fotos de Wikimedia sin srcset (hero EN/PT y TODAS las secundarias
  // ES/EN/PT venian con un solo ancho) -> agrega 480/640/768w + el ancho
  // original, mismo patron que el hero ES ya usaba.
  const RE = /(<img\s+src="(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[^"]+?\/)(\d+)px-([^"\/]+\.(?:jpg|jpeg|png))")([^>]*>)/gi;
  return html.replace(RE, (full, srcAttr, base, width, filename, rest) => {
    if (/srcset=/i.test(rest)) return full; // ya tiene (hero ES)
    const srcset = `480px-${filename} 480w, 640px-${filename} 640w, 768px-${filename} 768w, ${width}px-${filename} ${width}w`
      .split(", ")
      .map((part) => `${base}${part}`)
      .join(", ");
    const sizes = `sizes="(max-width:760px) 100vw, 760px"`;
    return `${srcAttr} srcset="${srcset}" ${sizes}${rest}`;
  });
}

function addBoletinScript(html, dir) {
  const scriptTag = `<script src="${dir}analytics.js" defer></script>`;
  if (!html.includes(scriptTag)) return { html, changed: false };
  const boletinTag = `<script src="${dir}boletin.js" defer></script>`;
  if (html.includes(boletinTag)) return { html, changed: false };
  return { html: html.replace(scriptTag, `${scriptTag}\n${boletinTag}`), changed: true };
}

let filesChanged = 0;
let filesSkipped = 0;

for (const [locKey, locale] of Object.entries(LOCALES)) {
  for (const [slug, query] of SLUGS) {
    const filePath = join(ROOT, locale.dir, `${slug}.html`);
    let html;
    try {
      html = readFileSync(filePath, "utf8");
    } catch {
      console.error(`SKIP (no existe): ${locale.dir}${slug}.html`);
      continue;
    }
    if (html.includes(MARKER)) {
      filesSkipped++;
      continue;
    }
    const notaAnchor = `<p class="nota">`;
    if (!html.includes(notaAnchor)) {
      console.error(`SKIP (sin anchor .nota): ${locale.dir}${slug}.html`);
      continue;
    }
    let out = html.replace(notaAnchor, `${buildBlock(locale, slug, query)}\n  ${notaAnchor}`);
    out = addSrcset(out);
    const withScript = addBoletinScript(out, locale.dir);
    out = withScript.html;
    writeFileSync(filePath, out, "utf8");
    filesChanged++;
  }
}

console.log(`inject-growth-features: ${filesChanged} archivo(s) modificados, ${filesSkipped} ya tenian el marcador (saltados).`);

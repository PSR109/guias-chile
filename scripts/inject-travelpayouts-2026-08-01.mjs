#!/usr/bin/env node
// Monetización afiliados fase 2 (Travelpayouts, marker 747702 — programas YA
// ACTIVOS, ver tools/chrome/travelpayouts-r5.json en el repo raíz):
//
//   1. Airalo eSIM (12%, cookie 30d): bloque CTA junto a la sección práctica
//      ("cómo llegar"/"datos prácticos"/FAQ como fallback) en guías EN y PT.
//      NO en las guías ES: la audiencia local ya tiene SIM chilena, un bloque
//      de eSIM ahí sería ruido sin conversión (decisión registrada en commit).
//   2. Kiwi.com vuelos (3%, cookie 30d): línea contextual "✈️ vuelos a <ciudad
//      gateway>" dentro de la sección "cómo llegar" en las 26 guías de los 3
//      idiomas. Kiwi NO permite deeplinks custom (solo páginas pre-fabricadas),
//      así que el texto no promete una búsqueda pre-rellenada: abre la main
//      page ES (promo 8927, también para PT) o US (promo 3673 para EN).
//
// Los href van completos en el HTML (con marker) para que funcionen sin JS;
// afiliados.js guarda los mismos links como fuente de verdad y re-apunta los
// data-afiliado="airalo"/"kiwi-es"/"kiwi-en" (check-affiliate-ids los vigila).
//
// Idempotente: si el marcador data-inyectado ya está, esa inyección se salta.
// Re-correrlo no duplica bloques.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const MARKER_AIRALO = 'data-inyectado="tp-airalo-2026-08-01"';
const MARKER_KIWI = 'data-inyectado="tp-kiwi-2026-08-01"';

const LINK_AIRALO = "https://airalo.tpx.lt/bReiPeFx";
const LINK_KIWI_ES = "https://tp.media/click?shmarker=747702&promo_id=8927&source_type=link&type=click&campaign_id=111";
const LINK_KIWI_EN = "https://tp.media/click?shmarker=747702&promo_id=3673&source_type=link&type=click&campaign_id=111";

// Ciudad gateway con aeropuerto para el texto "vuelos a X" (Kiwi no acepta
// deeplink a búsqueda; se nombra la ciudad que el viajero buscaría de todos
// modos). Mismo nombre en los 3 idiomas salvo Rapa Nui.
const CIUDAD = {
  "arica": "Arica",
  "cajon-del-maipo": "Santiago",
  "carretera-austral": "Balmaceda",
  "chiloe": "Puerto Montt",
  "colchagua-pichilemu": "Santiago",
  "concepcion-salto-del-laja": "Concepción",
  "copiapo-bahia-inglesa": "Copiapó",
  "frutillar": "Puerto Montt",
  "iquique": "Iquique",
  "la-serena-coquimbo": "La Serena",
  "malalcahuello-conguillio": "Temuco",
  "pucon-villarrica": "Temuco",
  "puerto-montt": "Puerto Montt",
  "puerto-natales": "Puerto Natales",
  "puerto-varas": "Puerto Montt",
  "punta-arenas": "Punta Arenas",
  "radal-siete-tazas-curico": "Santiago",
  "rapa-nui": { es: "Isla de Pascua", en: "Easter Island", pt: "Ilha de Páscoa" },
  "saltos-del-petrohue": "Puerto Montt",
  "san-pedro-de-atacama": "Calama",
  "santiago": "Santiago",
  "termas-de-chillan": "Concepción",
  "torres-del-paine": "Punta Arenas",
  "valdivia": "Valdivia",
  "valle-del-elqui": "La Serena",
  "valparaiso": "Santiago",
};

// Sección práctica donde anclar (primer h2 del documento que aparezca aquí).
// Fallback: el h2 de FAQ (solo frutillar, que no tiene sección logística) —
// ahí ambos bloques van ANTES del h2.
const H2_PRACTICA = {
  es: ["Cómo llegar y cuándo ir", "Cómo llegar", "Datos prácticos", "Logística esencial"],
  en: ["How to get there and when to go", "How to get there", "Practical info", "Essential logistics"],
  pt: ["Como chegar e quando ir", "Como chegar", "Informações práticas", "Logística essencial"],
};
const H2_FAQ = { es: "Preguntas frecuentes", en: "FAQ", pt: "Perguntas frequentes" };

function bloqueAiralo(lang) {
  const t = {
    en: {
      h3: "Stay connected in Chile",
      p: "eSIM with data from the minute you land — no roaming, no physical SIM.",
      boton: "Get a Chile eSIM on Airalo",
      nota: "Activate it before you fly — works in 200+ countries",
    },
    pt: {
      h3: "Fique conectado no Chile",
      p: "eSIM com dados desde o minuto em que você pousa — sem roaming, sem chip físico.",
      boton: "Comprar um eSIM na Airalo",
      nota: "Ative antes de voar — funciona em mais de 200 países",
    },
  }[lang];
  return [
    `  <div class="cta" ${MARKER_AIRALO}>`,
    `    <h3>${t.h3}</h3>`,
    `    <p>${t.p}</p>`,
    `    <div class="boton-fila">`,
    `      <a class="boton airalo" data-afiliado="airalo" rel="sponsored noopener" target="_blank" href="${LINK_AIRALO}">${t.boton}</a>`,
    `      <span class="afiliado-nota">${t.nota}</span>`,
    `    </div>`,
    `  </div>`,
  ];
}

function lineaKiwi(lang, slug) {
  const c = CIUDAD[slug];
  const ciudad = typeof c === "string" ? c : c[lang];
  const t = {
    es: { link: LINK_KIWI_ES, afiliado: "kiwi-es", txt: `Busca vuelos a ${ciudad} en Kiwi.com`, cola: " — compara aerolíneas y fechas." },
    en: { link: LINK_KIWI_EN, afiliado: "kiwi-en", txt: `Find flights to ${ciudad} on Kiwi.com`, cola: " — compare airlines and dates." },
    pt: { link: LINK_KIWI_ES, afiliado: "kiwi-es", txt: `Voos para ${ciudad} na Kiwi.com`, cola: " — compare companhias e datas." },
  }[lang];
  return `  <p ${MARKER_KIWI}>✈️ <a data-afiliado="${t.afiliado}" rel="sponsored noopener" target="_blank" href="${t.link}">${t.txt}</a>${t.cola}</p>`;
}

// Busca el primer h2 (línea propia, sin atributos) que esté en la lista de
// práctica; si no hay ninguno, cae al h2 de FAQ. Devuelve { idx, esFaq }.
function encontrarAncla(lines, lang) {
  const practica = H2_PRACTICA[lang];
  const faq = H2_FAQ[lang];
  for (let i = 0; i < lines.length; i++) {
    const trim = lines[i].trim();
    if (practica.some((t) => trim === `<h2>${t}</h2>`)) return { idx: i, esFaq: false };
    if (trim === `<h2>${faq}</h2>`) return { idx: i, esFaq: true };
  }
  return null;
}

let airaloCount = 0;
let kiwiCount = 0;
const omitidos = [];

for (const lang of ["es", "en", "pt"]) {
  for (const slug of Object.keys(CIUDAD)) {
    const rel = lang === "es" ? `${slug}.html` : `${lang}/${slug}.html`;
    const filePath = join(ROOT, rel);
    if (!existsSync(filePath)) {
      omitidos.push(`${rel}: no existe`);
      continue;
    }
    let html = readFileSync(filePath, "utf8");
    const quiereAiralo = lang !== "es" && !html.includes(MARKER_AIRALO);
    const quiereKiwi = !html.includes(MARKER_KIWI);
    if (!quiereAiralo && !quiereKiwi) continue;

    const lines = html.split("\n");
    const ancla = encontrarAncla(lines, lang);
    if (!ancla) {
      omitidos.push(`${rel}: sin h2 práctico ni FAQ reconocido, se omite a mano`);
      continue;
    }

    // Orden de splices: primero el de índice mayor para no desplazar el otro.
    // Kiwi va DESPUÉS del h2 práctico; si el ancla es FAQ, va ANTES junto con
    // Airalo (la línea de vuelos no es una respuesta de FAQ).
    if (quiereKiwi && !ancla.esFaq) {
      lines.splice(ancla.idx + 1, 0, lineaKiwi(lang, slug));
      kiwiCount++;
    }
    if (quiereAiralo || (quiereKiwi && ancla.esFaq)) {
      const bloque = [];
      if (quiereAiralo) bloque.push(...bloqueAiralo(lang));
      if (quiereKiwi && ancla.esFaq) {
        if (bloque.length) bloque.push("");
        bloque.push(lineaKiwi(lang, slug));
        kiwiCount++;
      }
      if (quiereAiralo) airaloCount++;
      // Respeta el aire existente: una línea en blanco antes y después.
      const prefix = lines[ancla.idx - 1] && lines[ancla.idx - 1].trim() !== "" ? [""] : [];
      lines.splice(ancla.idx, 0, ...prefix, ...bloque, "");
    }

    writeFileSync(filePath, lines.join("\n"));
  }
}

console.log(`travelpayouts: Airalo en ${airaloCount} guías (EN+PT), Kiwi en ${kiwiCount} guías (ES+EN+PT)`);
for (const s of omitidos) console.log(`OMITIDO ${s}`);

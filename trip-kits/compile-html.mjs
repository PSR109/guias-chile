import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractGuide, pickSections } from './lib/extract-guide.mjs';
import { topPois } from './lib/panoramas.mjs';
import { KITS } from './kits.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, 'build');
const LANG = process.argv.includes('--lang')
  ? process.argv[process.argv.indexOf('--lang') + 1]
  : 'en';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Strings de la carcasa del PDF por idioma (kit gen-2 ES, 2026-08-01).
// REGLA: las strings EN deben quedar IDENTICAS a las del gen-1 (10 kits ya a la
// venta) — tocarlas regenera esos PDFs con copy distinto al del listing vendido.
const I18N = {
  en: {
    locale: 'en-US',
    free: 'Free',
    viatorPath: '',
    dayWord: 'Day',
    coverLabel: 'Chile Trip Kits · Printable Itinerary',
    coverBrand: 'By the team behind guias.viajesypanoramas.cl &amp; viajesypanoramas.cl · 2026 edition',
    tocTitle: (n) => `Your ${n}-day route at a glance`,
    tocNote: 'Every section below is condensed from our full free guides, curated into a day-by-day order you can actually follow. Links are clickable in the digital version.',
    routeTitle: 'Day-by-day route map',
    routeNote: 'Schematic overview generated from the itinerary stops — use it to understand the shape of the trip, not to navigate.',
    routeAria: 'Route overview',
    routeCaption: 'Schematic route — distances not to scale. North is up.',
    budgetTitle: 'Budget: what things actually cost (2026)',
    budgetNote: 'Prices are reference values in Chilean pesos with approximate USD; always confirm before booking.',
    checklistTitle: 'Pre-trip checklist',
    poisTitle: 'Bonus: extra ideas along the route',
    poisNote: 'Hand-picked from our Panoramas catalog of 25,000+ places in Chile:',
    faqTitle: 'FAQ',
    resourcesTitle: 'Book ahead &amp; keep exploring',
    toursBox: 'Tours with free cancellation:',
    appsBox: 'Free companion apps:',
    guidesLabel: 'Full guides (updated):',
    guidesUrl: 'https://guias.viajesypanoramas.cl/en/',
    guidesText: 'guias.viajesypanoramas.cl/en',
    nearbyLabel: 'What to do nearby, today:',
    affiliateNote: "Some links are affiliate links: booking through them supports this kit at no extra cost to you. &copy; 2026 viajesypanoramas.cl. Personal use only; please don't redistribute this file.",
    odblNote: 'Place data derived from OpenStreetMap. &copy; OpenStreetMap contributors, available under the',
  },
  es: {
    locale: 'es-CL',
    free: 'Gratis',
    viatorPath: '/es-CL',
    dayWord: 'Día',
    coverLabel: 'Chile Trip Kits · Itinerario imprimible',
    coverBrand: 'Del equipo detrás de guias.viajesypanoramas.cl y viajesypanoramas.cl · edición 2026',
    tocTitle: (n) => `Tu ruta de ${n} días de un vistazo`,
    tocNote: 'Cada sección está condensada desde nuestras guías completas y gratuitas, ordenada en un plan día a día que puedes seguir. Los enlaces son clicables en la versión digital.',
    routeTitle: 'Mapa de la ruta día a día',
    routeNote: 'Esquema generado desde las paradas del itinerario — úsalo para entender la forma del viaje, no para navegar.',
    routeAria: 'Vista general de la ruta',
    routeCaption: 'Ruta esquemática — distancias no a escala. El norte está arriba.',
    budgetTitle: 'Presupuesto: cuánto cuestan las cosas (2026)',
    budgetNote: 'Precios de referencia en pesos chilenos; confirma siempre los valores vigentes antes de reservar.',
    checklistTitle: 'Checklist pre-viaje',
    poisTitle: 'Bonus: más ideas a lo largo de la ruta',
    poisNote: 'Seleccionados desde nuestro catálogo Panoramas de más de 25.000 lugares en Chile:',
    faqTitle: 'Preguntas frecuentes',
    resourcesTitle: 'Reserva con anticipación y sigue explorando',
    toursBox: 'Tours con cancelación gratis:',
    appsBox: 'Apps gratuitas complementarias:',
    guidesLabel: 'Guías completas (actualizadas):',
    guidesUrl: 'https://guias.viajesypanoramas.cl/',
    guidesText: 'guias.viajesypanoramas.cl',
    nearbyLabel: 'Qué hacer cerca, hoy:',
    affiliateNote: 'Algunos enlaces son de afiliado: reservar a través de ellos apoya este kit sin costo extra para ti. &copy; 2026 viajesypanoramas.cl. Solo para uso personal; no redistribuir este archivo.',
    odblNote: 'Datos de lugares derivados de OpenStreetMap. &copy; colaboradores de OpenStreetMap, disponibles bajo la',
  },
};

const fmtClp = (n, T) => (n > 0 ? `CLP ${n.toLocaleString(T.locale)}` : T.free);

const AFF = {
  viator: (q, T) => `https://www.viator.com${T.viatorPath}/searchResults/all?text=${encodeURIComponent(q)}&pid=P00308789&mcid=42383&medium=link`,
  gyg: (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=BZYZJT4`,
};

// Mapa esquematico de ruta: SVG inline autogenerado desde kit.route (lat/lon aprox).
// Proyeccion equirectangular simple sobre un viewBox fijo — es un ESQUEMA, no cartografia,
// y no hace ningun request externo (cero tiles, funciona bajo file:// y en el PDF).
function routeMapSvg(route, T) {
  const W = 640, H = 420, PAD = 46;
  const lats = route.map((s) => s.lat);
  const lons = route.map((s) => s.lon);
  const minLat = Math.min(...lats), minLon = Math.min(...lons);
  const spanLat = Math.max(Math.max(...lats) - minLat, 0.2);
  const spanLon = Math.max(Math.max(...lons) - minLon, 0.2);
  const x = (lon) => PAD + ((lon - minLon) / spanLon) * (W - 2 * PAD);
  const y = (lat) => H - PAD - ((lat - minLat) / spanLat) * (H - 2 * PAD);

  // Dias consecutivos en la misma parada se agrupan en un solo nodo (ej: D10·D11).
  const stops = [];
  for (const s of route) {
    const last = stops[stops.length - 1];
    if (last && last.name === s.name) { last.days.push(s.day); continue; }
    stops.push({ name: s.name, lat: s.lat, lon: s.lon, days: [s.day] });
  }
  const pts = stops.map((s) => `${x(s.lon).toFixed(1)},${y(s.lat).toFixed(1)}`).join(' ');
  const nodes = stops
    .map((s, i) => {
      const cx = x(s.lon), cy = y(s.lat);
      const label = s.days.map((d) => `D${d}`).join('·');
      const ty = i % 2 === 0 ? cy - 10 : cy + 19; // alterna arriba/abajo para reducir colisiones
      return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="6" fill="#0d6e6e"/>
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.4" fill="#fff"/>
<text x="${cx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-family="-apple-system, Segoe UI, Arial, sans-serif" font-size="11" font-weight="700" fill="#c0512f">${label}</text>`;
    })
    .join('\n');
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${T.routeAria}">
<rect width="${W}" height="${H}" fill="#f2f6f8" rx="10"/>
<polyline points="${pts}" fill="none" stroke="#0d6e6e" stroke-width="2.5" stroke-dasharray="7 5" stroke-linejoin="round"/>
${nodes}
<text x="${PAD}" y="${H - 14}" font-family="-apple-system, Segoe UI, Arial, sans-serif" font-size="10" fill="#5b6b7b">${T.routeCaption}</text>
</svg>`;
}

function buildKitHtml(kit, lang) {
  const T = I18N[lang] ?? I18N.en;
  const cache = {};
  const g = (slug) => (cache[slug] ??= extractGuide(lang, slug));

  const daysHtml = kit.days
    .map((day, i) => {
      const body = day.pulls.map((p) => pickSections(g(p.guide), p.headings)).join('\n');
      return `<section class="day" id="day-${i + 1}">
  <span class="day-num">${T.dayWord.toUpperCase()} ${i + 1}</span>
  <h2>${esc(day.title)}</h2>
  <p class="intro">${esc(day.intro)}</p>
  ${body}
</section>`;
    })
    .join('\n');

  const toc = kit.days
    .map((d, i) => `<li><b>${T.dayWord} ${i + 1}:</b> ${esc(d.title)}</li>`)
    .join('\n');

  const routeLegend = kit.route
    .map((s) => `<li><b>${T.dayWord} ${s.day}:</b> ${esc(s.name)}</li>`)
    .join('\n');

  const budget = kit.budget
    .map((b) => `<h4>${esc(g(b.guide).title)}</h4>\n${pickSections(g(b.guide), [b.heading])}`)
    .join('\n');

  const checklist = kit.checklist.map((c) => `<li>${esc(c)}</li>`).join('\n');

  const pois = topPois({ comunas: kit.poiComunas, limit: kit.poiLimit, lang, exclude: kit.poiExclude ?? [] })
    .map(
      (p) => `<div class="poi"><b>${esc(p.nombre)}</b>
  <div class="meta">${esc(p.categoria)}${p.horas ? ` · ~${p.horas}h` : ''} · ${fmtClp(p.precioClp, T)}</div>
  <div>${esc(p.descripcion)}</div></div>`
    )
    .join('\n');

  // Si no hay POIs (comunas sin cobertura en el catalogo), la seccion se omite
  // entera — nada de secciones vacias en un producto de pago.
  const poisSection = pois
    ? `<section id="pois" class="block">
  <h2>${T.poisTitle}</h2>
  <p>${T.poisNote}</p>
  ${pois}
</section>`
    : '';

  const faqSeen = new Set();
  const faq = kit.faqFrom
    .flatMap((slug) => g(slug).faq)
    .filter((x) => !faqSeen.has(x.q) && faqSeen.add(x.q))
    .map((x) => `<div class="qa"><p class="q">${esc(x.q)}</p><p class="a">${esc(x.a)}</p></div>`)
    .join('\n');

  // Query de afiliados: por default el titulo del kit (gen-1); affQuery permite
  // una busqueda mas util (ej. "Chillán" en vez del titulo completo en español).
  const q = kit.affQuery ?? kit.title;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(kit.title)}</title>
<link rel="stylesheet" href="../assets/pdf.css">
</head>
<body>
<section id="cover">
  <div class="label">${T.coverLabel}</div>
  <h1>${esc(kit.title)}</h1>
  <p class="subtitle">${esc(kit.subtitle)}</p>
  <img src="../../img/og/${kit.coverImage}" alt="${esc(kit.title)}">
  <p class="brand">${T.coverBrand}</p>
</section>
<section id="toc" class="block">
  <h2>${T.tocTitle(kit.days.length)}</h2>
  <ol>${toc}</ol>
  <p class="footer-note">${T.tocNote}</p>
</section>
<section id="route" class="block">
  <h2>${T.routeTitle}</h2>
  ${routeMapSvg(kit.route, T)}
  <ol class="route-legend">${routeLegend}</ol>
  <p class="footer-note">${T.routeNote}</p>
</section>
${daysHtml}
<section id="budget" class="block">
  <h2>${T.budgetTitle}</h2>
  ${budget}
  <p class="footer-note">${T.budgetNote}</p>
</section>
<section id="checklist" class="block">
  <h2>${T.checklistTitle}</h2>
  <ul class="checklist">${checklist}</ul>
</section>
${poisSection}
<section id="faq" class="block">
  <h2>${T.faqTitle}</h2>
  ${faq}
</section>
<section id="resources" class="block resources">
  <h2>${T.resourcesTitle}</h2>
  <div class="box"><b>${T.toursBox}</b><br>
    Viator: <a href="${AFF.viator(q, T)}">${esc(AFF.viator(q, T))}</a><br>
    GetYourGuide: <a href="${AFF.gyg(q)}">${esc(AFF.gyg(q))}</a>
  </div>
  <div class="box"><b>${T.appsBox}</b><br>
    ${T.guidesLabel} <a href="${T.guidesUrl}">${T.guidesText}</a><br>
    ${T.nearbyLabel} <a href="https://viajesypanoramas.cl/">viajesypanoramas.cl</a>
  </div>
  <p class="footer-note">${T.affiliateNote}</p>
  <!-- Atribucion ODbL (2026-07-27). NO es opcional ni cosmetica: los lugares de
       estos kits salen del catalogo de Panoramas, que es 98,82% OpenStreetMap
       (30.012 de 30.369 fichas CL, contado el 2026-07-27). ODbL exige atribuir
       en cualquier obra derivada, y este es un producto DE PAGO — venderlo sin
       el credito es incumplimiento de licencia, no un descuido de formato. La
       app web ya atribuye; el PDF no atribuia en ninguna parte. -->
  <p class="footer-note">${T.odblNote} <a href="https://opendatacommons.org/licenses/odbl/">Open Database License (ODbL)</a>.</p>
</section>
</body>
</html>`;
}

mkdirSync(BUILD, { recursive: true });
for (const kit of KITS) {
  // kit.lang (gen-2) fija el idioma del kit; si no, manda el flag --lang (default en).
  const lang = kit.lang ?? LANG;
  const html = buildKitHtml(kit, lang);
  const out = join(BUILD, `${kit.id}-${lang}.html`);
  writeFileSync(out, html);
  console.log(`build: ${out} (${(html.length / 1024).toFixed(0)} KB)`);
}

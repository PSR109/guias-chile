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
const fmtClp = (n) => (n > 0 ? `CLP ${n.toLocaleString('en-US')}` : 'Free');

const AFF = {
  viator: (q) => `https://www.viator.com/searchResults/all?text=${encodeURIComponent(q)}&pid=P00308789&mcid=42383&medium=link`,
  gyg: (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=BZYZJT4`,
};

// Mapa esquematico de ruta: SVG inline autogenerado desde kit.route (lat/lon aprox).
// Proyeccion equirectangular simple sobre un viewBox fijo — es un ESQUEMA, no cartografia,
// y no hace ningun request externo (cero tiles, funciona bajo file:// y en el PDF).
function routeMapSvg(route) {
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
<text x="${cx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="700" fill="#c0512f">${label}</text>`;
    })
    .join('\n');
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Route overview">
<rect width="${W}" height="${H}" fill="#f2f6f8" rx="10"/>
<polyline points="${pts}" fill="none" stroke="#0d6e6e" stroke-width="2.5" stroke-dasharray="7 5" stroke-linejoin="round"/>
${nodes}
<text x="${PAD}" y="${H - 14}" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#5b6b7b">Schematic route — distances not to scale. North is up.</text>
</svg>`;
}

function buildKitHtml(kit, lang) {
  const cache = {};
  const g = (slug) => (cache[slug] ??= extractGuide(lang, slug));

  const daysHtml = kit.days
    .map((day, i) => {
      const body = day.pulls.map((p) => pickSections(g(p.guide), p.headings)).join('\n');
      return `<section class="day" id="day-${i + 1}">
  <span class="day-num">DAY ${i + 1}</span>
  <h2>${esc(day.title)}</h2>
  <p class="intro">${esc(day.intro)}</p>
  ${body}
</section>`;
    })
    .join('\n');

  const toc = kit.days
    .map((d, i) => `<li><b>Day ${i + 1}:</b> ${esc(d.title)}</li>`)
    .join('\n');

  const routeLegend = kit.route
    .map((s) => `<li><b>Day ${s.day}:</b> ${esc(s.name)}</li>`)
    .join('\n');

  const budget = kit.budget
    .map((b) => `<h4>${esc(g(b.guide).title)}</h4>\n${pickSections(g(b.guide), [b.heading])}`)
    .join('\n');

  const checklist = kit.checklist.map((c) => `<li>${esc(c)}</li>`).join('\n');

  const pois = topPois({ comunas: kit.poiComunas, limit: kit.poiLimit })
    .map(
      (p) => `<div class="poi"><b>${esc(p.nombre)}</b>
  <div class="meta">${esc(p.categoria)}${p.horas ? ` · ~${p.horas}h` : ''} · ${fmtClp(p.precioClp)}</div>
  <div>${esc(p.descripcion)}</div></div>`
    )
    .join('\n');

  const faqSeen = new Set();
  const faq = kit.faqFrom
    .flatMap((slug) => g(slug).faq)
    .filter((x) => !faqSeen.has(x.q) && faqSeen.add(x.q))
    .map((x) => `<div class="qa"><p class="q">${esc(x.q)}</p><p class="a">${esc(x.a)}</p></div>`)
    .join('\n');

  const q = kit.title;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${esc(kit.title)}</title>
<link rel="stylesheet" href="../assets/pdf.css">
</head>
<body>
<section id="cover">
  <div class="label">Chile Trip Kits · Printable Itinerary</div>
  <h1>${esc(kit.title)}</h1>
  <p class="subtitle">${esc(kit.subtitle)}</p>
  <img src="../../img/og/${kit.coverImage}" alt="${esc(kit.title)}">
  <p class="brand">By the team behind guias.viajesypanoramas.cl &amp; viajesypanoramas.cl · 2026 edition</p>
</section>
<section id="toc" class="block">
  <h2>Your ${kit.days.length}-day route at a glance</h2>
  <ol>${toc}</ol>
  <p class="footer-note">Every section below is condensed from our full free guides, curated into a day-by-day order you can actually follow. Links are clickable in the digital version.</p>
</section>
<section id="route" class="block">
  <h2>Day-by-day route map</h2>
  ${routeMapSvg(kit.route)}
  <ol class="route-legend">${routeLegend}</ol>
  <p class="footer-note">Schematic overview generated from the itinerary stops — use it to understand the shape of the trip, not to navigate.</p>
</section>
${daysHtml}
<section id="budget" class="block">
  <h2>Budget: what things actually cost (2026)</h2>
  ${budget}
  <p class="footer-note">Prices are reference values in Chilean pesos with approximate USD; always confirm before booking.</p>
</section>
<section id="checklist" class="block">
  <h2>Pre-trip checklist</h2>
  <ul class="checklist">${checklist}</ul>
</section>
<section id="pois" class="block">
  <h2>Bonus: extra ideas along the route</h2>
  <p>Hand-picked from our Panoramas catalog of 25,000+ places in Chile:</p>
  ${pois}
</section>
<section id="faq" class="block">
  <h2>FAQ</h2>
  ${faq}
</section>
<section id="resources" class="block resources">
  <h2>Book ahead &amp; keep exploring</h2>
  <div class="box"><b>Tours with free cancellation:</b><br>
    Viator: <a href="${AFF.viator(q)}">${esc(AFF.viator(q))}</a><br>
    GetYourGuide: <a href="${AFF.gyg(q)}">${esc(AFF.gyg(q))}</a>
  </div>
  <div class="box"><b>Free companion apps:</b><br>
    Full guides (updated): <a href="https://guias.viajesypanoramas.cl/en/">guias.viajesypanoramas.cl/en</a><br>
    What to do nearby, today: <a href="https://viajesypanoramas.cl/">viajesypanoramas.cl</a>
  </div>
  <p class="footer-note">Some links are affiliate links: booking through them supports this kit at no extra cost to you. &copy; 2026 viajesypanoramas.cl. Personal use only; please don't redistribute this file.</p>
</section>
</body>
</html>`;
}

mkdirSync(BUILD, { recursive: true });
for (const kit of KITS) {
  const html = buildKitHtml(kit, LANG);
  const out = join(BUILD, `${kit.id}-${LANG}.html`);
  writeFileSync(out, html);
  console.log(`build: ${out} (${(html.length / 1024).toFixed(0)} KB)`);
}

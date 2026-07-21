import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

// trip-kits/lib/ -> raiz del repo guias-chile
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE_URL = 'https://guias.viajesypanoramas.cl';

export function guidePath(lang, slug) {
  return lang === 'es' ? join(ROOT, `${slug}.html`) : join(ROOT, lang, `${slug}.html`);
}

export function extractGuide(lang, slug) {
  const raw = readFileSync(guidePath(lang, slug), 'utf8');
  const $ = cheerio.load(raw);
  const title = $('h1').first().text().trim();

  // 1) Ruido fuera: afiliados, promos, fotos hotlinkeadas (regla: foto exacta self-hosted o nada),
  //    guias cercanas, notas de disclosure, scripts.
  $('.cta, .promo, .nota, section.cercanas, figure.foto, script, .boton-fila').remove();

  // 2) FAQ: capturar y convertir <details> (colapsan en PDF) a divs visibles.
  const faq = [];
  $('div.faq details').each((_, d) => {
    const q = $(d).find('summary').text().trim();
    const a = $(d).find('p').map((_, p) => $(p).text().trim()).get().join(' ');
    faq.push({ q, a });
    $(d).replaceWith(`<div class="qa"><p class="q">${q}</p><p class="a">${a}</p></div>`);
  });

  // 3) Links relativos -> absolutos al sitio de guias.
  $('main a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (/^(https?:|#|mailto:)/.test(href)) return;
    const clean = href.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
    const prefix = lang === 'es' ? '' : `${lang}/`;
    $(el).attr('href', `${BASE_URL}/${prefix}${clean}`);
  });

  // 4) Seccionar por h2/h3 (hijos directos de <main>, estructura plana verificada).
  const sections = [];
  let current = null;
  $('main').children().each((_, el) => {
    const tag = (el.tagName || '').toLowerCase();
    if (tag === 'h1') return;
    if (tag === 'h2' || tag === 'h3') {
      current = { heading: $(el).text().trim(), level: tag === 'h2' ? 2 : 3, html: '' };
      sections.push(current);
    } else if (current) {
      current.html += $.html(el);
    }
  });
  return { title, sections, faq };
}

export function pickSections(guideData, headings) {
  return headings
    .map((h) => {
      const s = guideData.sections.find((x) => x.heading === h);
      if (!s) {
        const avail = guideData.sections.map((x) => x.heading).join(' | ');
        throw new Error(`Heading no encontrado: "${h}". Disponibles: ${avail}`);
      }
      const clean = s.heading.replace(/^\d+\.\s*/, '');
      return `<h4>${clean}</h4>\n${s.html}`;
    })
    .join('\n');
}

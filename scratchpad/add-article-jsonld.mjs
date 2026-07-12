// Adds an Article JSON-LD block to every guide page in the 3 locales
// (ES = repo root, EN = en/, PT = pt/). Completes the Article + Breadcrumb +
// FAQ trio Google recommends for guide/article pages.
//
// Every field is derived ONLY from each page's EXISTING tags (zero invention):
//   headline           = og:title, trailing site-name suffix stripped
//   description        = <meta name="description">
//   image              = og:image
//   inLanguage         = es-CL | en | pt-BR  (by locale)
//   mainEntityOfPage   = <link rel=canonical> (fallback og:url)
//   isPartOf           = WebSite "Guías de Chile"
//   publisher / author = Organization from root index.html JSON-LD (verbatim);
//                        publisher.logo.url = Organization logo if present in
//                        index, else the page's own og:image (valid fallback).
//
// datePublished / dateModified are OMITTED entirely: no page carries a
// machine-readable date (no article:published_time / <time datetime>), and a
// fabricated date is a citation/quality risk. Omitting is valid schema.
//
// Idempotent: skips any file that already has an Article ld+json block, and
// inserts the new block right AFTER the existing BreadcrumbList block (else
// after FAQPage, else before </head>). Does NOT touch FAQPage/BreadcrumbList.
//
// Scope note: index.html, creditos.html and privacy-policy.html are non-guide
// pages and are excluded.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const EXCLUDE = new Set(['index.html', 'creditos.html', 'privacy-policy.html']);
const IN_LANGUAGE = { es: 'es-CL', en: 'en', pt: 'pt-BR' };

// (locale, directory) pairs — ES lives in the repo root, EN/PT in subfolders.
const LOCALE_DIRS = [
  { locale: 'es', dir: ROOT },
  { locale: 'en', dir: path.join(ROOT, 'en') },
  { locale: 'pt', dir: path.join(ROOT, 'pt') },
];

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&#x0*27;|&apos;/gi, "'");
}

function extractTitle(html) {
  let m = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
  let raw = m ? m[1] : null;
  if (!raw) {
    m = html.match(/<title>([^<]*)<\/title>/i);
    raw = m ? m[1] : null;
  }
  if (!raw) return null;
  raw = decodeEntities(raw).trim();
  // Strip a trailing site-name suffix separated by " | " or " · " (middot).
  // Colons and dashes/ampersands inside the guide name are preserved.
  raw = raw.replace(/\s*[|·]\s.*$/, '').trim();
  return raw || null;
}

function extractDescription(html) {
  const m = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  return m ? decodeEntities(m[1]).trim() : null;
}

function extractOgImage(html) {
  // property="og:image" with the closing quote right after `image` avoids
  // matching og:image:width / og:image:height / og:image:alt.
  const m = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
  return m ? m[1].trim() : null;
}

function extractCanonical(html) {
  let m = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  if (m) return m[1];
  m = html.match(/<meta\s+property="og:url"\s+content="([^"]*)"/i);
  if (m) return m[1];
  return null;
}

// Tempered-greedy: matches ONE ld+json block of the given @type regardless of
// its position relative to other ld+json blocks (never crosses a </script>).
function ldBlockRe(type) {
  return new RegExp(
    '<script type="application/ld\\+json">\\s*\\{(?:(?!<\\/script>)[\\s\\S])*?"@type":"' +
      type +
      '"(?:(?!<\\/script>)[\\s\\S])*?<\\/script>',
    'i'
  );
}
const BREADCRUMB_RE = ldBlockRe('BreadcrumbList');
const FAQ_RE = ldBlockRe('FAQPage');

// --- Read publisher (Organization) from root index.html JSON-LD, verbatim ---
function readOrganization() {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const blocks = indexHtml.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
  ) || [];
  for (const b of blocks) {
    const json = b.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
    let data;
    try {
      data = JSON.parse(json);
    } catch {
      continue;
    }
    const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    for (const node of nodes) {
      if (node && node['@type'] === 'Organization' && node.name) {
        let logo = null;
        if (node.logo) {
          logo = typeof node.logo === 'string' ? node.logo : node.logo.url || null;
        }
        return { name: node.name, logo };
      }
    }
  }
  throw new Error('No Organization node found in index.html JSON-LD');
}

const ORG = readOrganization();
console.log(`Publisher/author name: "${ORG.name}"`);
console.log(`Publisher logo in index: ${ORG.logo ? ORG.logo : '(none) → fallback to page og:image'}`);

let changedByLocale = { es: 0, en: 0, pt: 0 };
const skipped = [];
const longHeadlines = [];

for (const { locale, dir } of LOCALE_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.html') && !EXCLUDE.has(f))
    .sort();

  for (const name of files) {
    const abs = path.join(dir, name);
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    let html = fs.readFileSync(abs, 'utf8');

    if (/"@type"\s*:\s*"Article"/.test(html)) {
      skipped.push(`${rel}: ya tiene Article (idempotente)`);
      continue;
    }

    const headline = extractTitle(html);
    const description = extractDescription(html);
    const image = extractOgImage(html);
    const canonical = extractCanonical(html);

    if (!headline) { skipped.push(`${rel}: sin og:title ni <title> — OMITIDO`); continue; }
    if (!description) { skipped.push(`${rel}: sin meta description — OMITIDO`); continue; }
    if (!image) { skipped.push(`${rel}: sin og:image — OMITIDO`); continue; }
    if (!canonical) { skipped.push(`${rel}: sin canonical ni og:url — OMITIDO`); continue; }

    if (headline.length > 110) longHeadlines.push(`${rel}: ${headline.length} chars — "${headline}"`);

    const article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      image,
      inLanguage: IN_LANGUAGE[locale],
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      isPartOf: {
        '@type': 'WebSite',
        name: 'Guías de Chile',
        url: 'https://guias.viajesypanoramas.cl/',
      },
      publisher: {
        '@type': 'Organization',
        name: ORG.name,
        logo: { '@type': 'ImageObject', url: ORG.logo || image },
      },
      author: { '@type': 'Organization', name: ORG.name },
    };
    const block = `\n<script type="application/ld+json">\n${JSON.stringify(article)}\n</script>`;

    if (BREADCRUMB_RE.test(html)) {
      html = html.replace(BREADCRUMB_RE, (m) => m + block);
    } else if (FAQ_RE.test(html)) {
      html = html.replace(FAQ_RE, (m) => m + block);
    } else if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `${block}\n</head>`);
    } else {
      skipped.push(`${rel}: sin BreadcrumbList ni FAQPage ni </head> — OMITIDO`);
      continue;
    }

    fs.writeFileSync(abs, html);
    changedByLocale[locale]++;
  }
}

console.log('\nArticle JSON-LD injected:');
console.log(`  ES: ${changedByLocale.es}`);
console.log(`  EN: ${changedByLocale.en}`);
console.log(`  PT: ${changedByLocale.pt}`);
console.log(`  TOTAL changed: ${changedByLocale.es + changedByLocale.en + changedByLocale.pt}`);
console.log(`  Skipped: ${skipped.length}`);
for (const s of skipped) console.log('   - ' + s);
console.log(`  Long headlines (>110 chars): ${longHeadlines.length}`);
for (const w of longHeadlines) console.log('   ! ' + w);

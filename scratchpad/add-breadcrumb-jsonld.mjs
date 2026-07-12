// Adds a BreadcrumbList JSON-LD block to every guide page in the 3 locales
// (ES = repo root, EN = en/, PT = pt/). 2-level crumb:
//   1. Home  (localized name, item = site root — the x-default home)
//   2. Page  (name = og:title, item = canonical URL)
// All fields are read from each page's EXISTING tags (zero invention).
// Idempotent: skips any file that already has a BreadcrumbList block, and
// inserts the new block right AFTER the existing FAQPage ld+json block if
// present, else right before </head>. Does NOT touch the FAQPage block.
//
// Scope note: index.html, creditos.html and privacy-policy.html are non-guide
// pages and are excluded (privacy-policy has no en/pt counterpart either).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const EXCLUDE = new Set(['index.html', 'creditos.html', 'privacy-policy.html']);
const HOME_NAME = { es: 'Inicio', en: 'Home', pt: 'Início' };

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
  // Colons and dashes inside the guide name are preserved.
  raw = raw.replace(/\s*[|·]\s.*$/, '').trim();
  return raw || null;
}

function extractCanonical(html) {
  let m = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  if (m) return m[1];
  m = html.match(/<meta\s+property="og:url"\s+content="([^"]*)"/i);
  if (m) return m[1];
  return null;
}

const FAQ_RE = /<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":"FAQPage"[\s\S]*?<\/script>/i;

let changedByLocale = { es: 0, en: 0, pt: 0 };
const skipped = [];

for (const { locale, dir } of LOCALE_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.html') && !EXCLUDE.has(f))
    .sort();

  for (const name of files) {
    const abs = path.join(dir, name);
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    let html = fs.readFileSync(abs, 'utf8');

    if (/"@type"\s*:\s*"BreadcrumbList"/.test(html)) {
      skipped.push(`${rel}: ya tiene BreadcrumbList (idempotente)`);
      continue;
    }

    const canonical = extractCanonical(html);
    if (!canonical) {
      skipped.push(`${rel}: sin canonical ni og:url — OMITIDO`);
      continue;
    }
    const title = extractTitle(html);
    if (!title) {
      skipped.push(`${rel}: sin og:title ni <title> — OMITIDO`);
      continue;
    }

    const origin = new URL(canonical).origin; // https://guias.viajesypanoramas.cl
    const homeItem = origin + '/';            // x-default home (only real index.html)
    const homeName = HOME_NAME[locale];

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeName, item: homeItem },
        { '@type': 'ListItem', position: 2, name: title, item: canonical },
      ],
    };
    const block = `\n<script type="application/ld+json">\n${JSON.stringify(breadcrumb)}\n</script>`;

    if (FAQ_RE.test(html)) {
      html = html.replace(FAQ_RE, (m) => m + block);
    } else if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `${block}\n</head>`);
    } else {
      skipped.push(`${rel}: sin FAQPage ni </head> — OMITIDO`);
      continue;
    }

    fs.writeFileSync(abs, html);
    changedByLocale[locale]++;
  }
}

console.log('BreadcrumbList injected:');
console.log(`  ES: ${changedByLocale.es}`);
console.log(`  EN: ${changedByLocale.en}`);
console.log(`  PT: ${changedByLocale.pt}`);
console.log(`  TOTAL changed: ${changedByLocale.es + changedByLocale.en + changedByLocale.pt}`);
console.log(`  Skipped: ${skipped.length}`);
for (const s of skipped) console.log('   - ' + s);

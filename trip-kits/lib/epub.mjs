// lib/epub.mjs — convierte el HTML compilado de un trip kit a ePub 3 reflowable
// (WP 10K.7.10, PoC ebooks KDP/Play Books). NO usa conversores: empaqueta el
// contenido con `zip` del sistema en la estructura ePub estándar:
//   mimetype (sin comprimir, primera entrada) · META-INF/container.xml ·
//   OEBPS/content.opf · nav.xhtml + toc.ncx (compat EPUB2) · 1 xhtml por sección
//   · css/epub.css · images/cover.jpg + route-map.png
// Funciona con CUALQUIER kit (pipeline estándar y shape custom): todos comparten
// las secciones cover/toc/route/day-N/budget/checklist/pois/faq/resources.
// Decisiones para KDP/ebooks:
//   - texto reflowable (un xhtml por sección, nada de fixed-layout ni mm)
//   - SVG del mapa de ruta rasterizado a PNG con Chromium (Kindle no garantiza
//     SVG inline); portada e imágenes re-encodadas a <=127 KB vía sips
//   - sin fonts externas (stacks Georgia/Arial del sistema)
//   - serialización XHTML propia desde el DOM (escapa entidades, cierra void
//     elements como <br/>) — el HTML fuente no es XML-válido tal cual
// Uso:  node lib/epub.mjs <kit.html> [--out salida.epub] [--no-preview]
// Salida por defecto: trip-kits/dist-ebooks/<id>.epub (id = nombre del archivo
// html; si se llama kit.html, el nombre de su carpeta).

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { chromium } from 'playwright-core';
import { chromiumPath } from './chromium.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TRIPKITS = dirname(HERE);
const MAXIMG = 127 * 1024; // recomendación KDP para imágenes de ebooks

const args = process.argv.slice(2);
if (!args[0] || args[0].startsWith('--')) {
  console.error('Uso: node lib/epub.mjs <kit.html> [--out salida.epub] [--no-preview]');
  process.exit(1);
}
const htmlPath = resolve(args[0]);
let outPath = null;
let preview = true;
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--out') outPath = resolve(args[++i]);
  else if (args[i] === '--no-preview') preview = false;
}
const base = basename(htmlPath, '.html');
const id = base === 'kit' ? basename(dirname(htmlPath)) : base;
if (!outPath) outPath = join(TRIPKITS, 'dist-ebooks', `${id}.epub`);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- 1. Extraer secciones con Chromium (DOM real: entidades ya resueltas) ----
const browser = await chromium.launch({ executablePath: chromiumPath() });
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });

// Rasterizar el mapa SVG antes de tocar el DOM (Kindle-safe: PNG plano)
const svgEl = page.locator('#route svg');
let routePng = null;
if ((await svgEl.count()) > 0) routePng = await svgEl.screenshot({ type: 'png' });

const kit = await page.evaluate(() => {
  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  const escT = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escA = (s) => escT(s).replace(/"/g, '&quot;');
  const ser = (n) => {
    if (n.nodeType === 3) return escT(n.nodeValue);
    if (n.nodeType !== 1) return ''; // comentarios fuera
    const tag = n.localName;
    let at = '';
    for (const a of n.attributes) at += ` ${a.name}="${escA(a.value)}"`;
    const inner = [...n.childNodes].map(ser).join('');
    if (inner === '' || VOID.has(tag)) return `<${tag}${at}/>`;
    return `<${tag}${at}>${inner}</${tag}>`;
  };
  const coverImg = document.querySelector('#cover img');
  const coverSrc = coverImg ? decodeURIComponent(new URL(coverImg.getAttribute('src'), location.href).pathname) : null;
  if (coverImg) coverImg.setAttribute('src', '../images/cover.jpg');
  const svg = document.querySelector('#route svg');
  if (svg) {
    const img = document.createElement('img');
    img.setAttribute('src', '../images/route-map.png');
    img.setAttribute('alt', svg.getAttribute('aria-label') || 'Route map');
    svg.replaceWith(img);
  }
  const sections = [...document.querySelectorAll('body > section')].map((s) => {
    const h = s.querySelector('h1, h2');
    return { id: s.id, heading: h ? h.textContent.trim() : s.id, xhtml: ser(s) };
  });
  return {
    lang: document.documentElement.getAttribute('lang') || 'en',
    title: document.querySelector('#cover h1')?.textContent.trim() || document.title,
    subtitle: document.querySelector('#cover .subtitle')?.textContent.trim() || '',
    coverSrc,
    sections,
  };
});
const { lang, title, subtitle, coverSrc, sections } = kit;
if (!sections.length) throw new Error(`Sin secciones <section> en ${htmlPath} — shape de kit desconocido`);

// ---- 2. Staging con la estructura ePub ----
const staging = mkdtempSync(join(tmpdir(), `epub-${id}-`));
mkdirSync(join(staging, 'META-INF'), { recursive: true });
mkdirSync(join(staging, 'OEBPS/xhtml'), { recursive: true });
mkdirSync(join(staging, 'OEBPS/css'), { recursive: true });
mkdirSync(join(staging, 'OEBPS/images'), { recursive: true });
const w = (rel, content) => writeFileSync(join(staging, rel), content);

w('mimetype', 'application/epub+zip');
w('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
`);

// Portada: re-encode a <=127 KB. Primero baja calidad, luego dimensión (una
// foto de portada detallada no cabe en 127 KB a 1600px ni con calidad 30).
if (coverSrc && existsSync(coverSrc)) {
  const coverOut = join(staging, 'OEBPS/images/cover.jpg');
  let ok = false;
  for (const q of [70, 60, 50, 45, 40, 35]) {
    for (const z of [1600, 1400, 1200, 1000, 800]) {
      execFileSync('sips', ['-Z', String(z), '-s', 'format', 'jpeg', '-s', 'formatOptions', String(q), coverSrc, '--out', coverOut], { stdio: 'pipe' });
      if (statSync(coverOut).size <= MAXIMG) { ok = true; break; }
    }
    if (ok) break;
  }
  if (!ok) console.warn(`aviso: portada quedó en ${(statSync(coverOut).size / 1024).toFixed(0)} KB (>127 KB)`);
} else {
  console.warn(`aviso: portada no encontrada (${coverSrc}) — el ePub queda sin cover-image`);
}
if (routePng) {
  const routeOut = join(staging, 'OEBPS/images/route-map.png');
  writeFileSync(routeOut, routePng);
  if (statSync(routeOut).size > MAXIMG) {
    execFileSync('sips', ['-Z', '1000', routeOut], { stdio: 'pipe' });
    console.warn('aviso: route-map.png pasaba de 127 KB, re-escalado a 1000px');
  }
}

// CSS reflowable (identidad visual de assets/pdf.css, sin mm/@page/vars CSS)
w('OEBPS/css/epub.css', `/* Trip Kits — ePub reflowable (derivado de assets/pdf.css, sin print CSS) */
body { font-family: Georgia, 'Times New Roman', serif; color: #1d2733; line-height: 1.55; }
h1, h2, h3, h4, .label { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; }
a { color: #0d6e6e; text-decoration: none; }
img { max-width: 100%; }
#cover { text-align: center; }
#cover .label { letter-spacing: 3px; text-transform: uppercase; font-size: 0.75em; color: #c0512f; font-weight: 600; }
#cover h1 { font-size: 1.9em; margin: 0.5em 0 0.2em; line-height: 1.15; }
#cover .subtitle { color: #5b6b7b; font-size: 1.1em; }
#cover img { width: 92%; border-radius: 8px; }
#cover .brand { margin-top: 1.6em; color: #5b6b7b; font-size: 0.8em; }
#toc li { margin: 0.4em 0; }
.day .day-num { display: inline-block; background: #0d6e6e; color: #fff; font-family: -apple-system, 'Segoe UI', Arial, sans-serif; font-weight: 700; padding: 0.15em 0.6em; border-radius: 4px; font-size: 0.8em; }
.day h2 { margin: 0.4em 0 0.2em; font-size: 1.4em; }
.day .intro { font-style: italic; color: #5b6b7b; border-left: 3px solid #0d6e6e; padding-left: 0.8em; margin: 0.6em 0 1em; }
h4 { color: #c0512f; font-size: 1.05em; margin: 1.2em 0 0.3em; }
section.block > h2 { font-size: 1.4em; border-bottom: 1px solid #d8e0e8; padding-bottom: 0.3em; }
table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 0.85em; }
th, td { border: 1px solid #d8e0e8; padding: 0.3em 0.55em; text-align: left; vertical-align: top; }
th { background: #f2f6f8; font-family: -apple-system, 'Segoe UI', Arial, sans-serif; }
.qa { margin: 0.8em 0; }
.qa .q { font-weight: 700; margin: 0; font-family: -apple-system, 'Segoe UI', Arial, sans-serif; }
.qa .a { margin: 0.2em 0 0; }
ul.checklist { list-style: none; padding-left: 0; }
ul.checklist li { margin: 0.55em 0; padding-left: 1.4em; text-indent: -1.4em; }
ul.checklist li::before { content: '\\2610\\00a0 '; color: #0d6e6e; }
#route img { width: 100%; margin: 0.6em 0; }
ol.route-legend { padding-left: 1.5em; font-size: 0.85em; }
.poi { margin: 0.8em 0; padding: 0.7em; background: #f2f6f8; border-radius: 4px; }
.poi b { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; }
.poi .meta { color: #5b6b7b; font-size: 0.8em; }
.resources .box { border: 1px solid #d8e0e8; border-radius: 4px; padding: 0.8em; margin: 0.8em 0; }
.footer-note { color: #5b6b7b; font-size: 0.8em; margin-top: 1.6em; }
`);

// Capítulos xhtml (1 por sección, en orden del documento)
const chapter = (s) => `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}">
<head>
<title>${esc(s.heading)}</title>
<link rel="stylesheet" type="text/css" href="../css/epub.css"/>
</head>
<body>
${s.xhtml}
</body>
</html>
`;
for (const s of sections) w(`OEBPS/xhtml/${s.id}.xhtml`, chapter(s));

// nav.xhtml (EPUB3) + toc.ncx (compat lectores EPUB2)
const TL = lang === 'es'
  ? { contents: 'Contenido', landmarks: 'Hitos', cover: 'Portada', start: 'Inicio' }
  : { contents: 'Contents', landmarks: 'Landmarks', cover: 'Cover', start: 'Start' };
const navLis = sections.map((s) => `      <li><a href="xhtml/${s.id}.xhtml">${esc(s.heading)}</a></li>`).join('\n');
const firstDay = sections.find((s) => s.id === 'day-1') ?? sections[1] ?? sections[0];
w('OEBPS/nav.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}">
<head>
<title>${TL.contents}</title>
<link rel="stylesheet" type="text/css" href="css/epub.css"/>
</head>
<body>
<nav epub:type="toc" id="toc">
  <h1>${TL.contents}</h1>
  <ol>
${navLis}
  </ol>
</nav>
<nav epub:type="landmarks" hidden="">
  <h1>${TL.landmarks}</h1>
  <ol>
    <li><a epub:type="cover" href="xhtml/cover.xhtml">${TL.cover}</a></li>
    <li><a epub:type="bodymatter" href="xhtml/${firstDay.id}.xhtml">${TL.start}</a></li>
  </ol>
</nav>
</body>
</html>
`);

const uuid = randomUUID();
const now = new Date();
const dateIso = now.toISOString().slice(0, 10);
const modified = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
const navPoints = sections
  .map(
    (s, i) => `    <navPoint id="navPoint-${i + 1}" playOrder="${i + 1}">
      <navLabel><text>${esc(s.heading)}</text></navLabel>
      <content src="xhtml/${s.id}.xhtml"/>
    </navPoint>`
  )
  .join('\n');
w('OEBPS/toc.ncx', `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${esc(title)}</text></docTitle>
  <navMap>
${navPoints}
  </navMap>
</ncx>
`);

// content.opf
const hasCover = existsSync(join(staging, 'OEBPS/images/cover.jpg'));
const hasRouteMap = existsSync(join(staging, 'OEBPS/images/route-map.png'));
const manifestItems = [
  `    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
  `    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`,
  `    <item id="css" href="css/epub.css" media-type="text/css"/>`,
  hasCover ? `    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>` : null,
  hasRouteMap ? `    <item id="route-map" href="images/route-map.png" media-type="image/png"/>` : null,
  ...sections.map((s) => `    <item id="${s.id}" href="xhtml/${s.id}.xhtml" media-type="application/xhtml+xml"/>`),
].filter(Boolean).join('\n');
const spineItems = [...sections.map((s) => `    <itemref idref="${s.id}"/>`), `    <itemref idref="nav"/>`].join('\n');
w('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="${lang}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:${uuid}</dc:identifier>
    <dc:title>${esc(title)}</dc:title>
    <dc:creator>Chile Trip Kits — viajesypanoramas.cl</dc:creator>
    <dc:language>${lang}</dc:language>
    <dc:date>${dateIso}</dc:date>
    <dc:publisher>viajesypanoramas.cl</dc:publisher>
    <dc:description>${esc(subtitle)}</dc:description>
    <dc:rights>© ${dateIso.slice(0, 4)} viajesypanoramas.cl. ${lang === 'es' ? 'Solo uso personal.' : 'Personal use only.'}</dc:rights>
    <meta property="dcterms:modified">${modified}</meta>
${hasCover ? '    <meta name="cover" content="cover-image"/>' : ''}
  </metadata>
  <manifest>
${manifestItems}
  </manifest>
  <spine toc="ncx">
${spineItems}
  </spine>
</package>
`);

// ---- 3. Empaquetar (mimetype primero, SIN comprimir) ----
mkdirSync(dirname(outPath), { recursive: true });
if (existsSync(outPath)) rmSync(outPath);
execSync(`zip -X0 "${outPath}" mimetype`, { cwd: staging, stdio: 'pipe' });
execSync(`zip -rX9D "${outPath}" META-INF OEBPS`, { cwd: staging, stdio: 'pipe' });

// ---- 4. Validar estructura (manual, sin epubcheck) ----
const names = execSync(`unzip -Z1 "${outPath}"`, { encoding: 'utf8' }).split('\n').filter(Boolean);
if (names[0] !== 'mimetype') throw new Error(`mimetype no es la primera entrada del zip (es "${names[0]}")`);
const verbose = execSync(`unzip -v "${outPath}"`, { encoding: 'utf8' });
const mimeLine = verbose.split('\n').find((l) => l.includes('mimetype'));
if (!mimeLine || !mimeLine.includes('Stored')) throw new Error('mimetype no está Stored (sin comprimir)');
execSync(
  `find "${staging}" \\( -name '*.xml' -o -name '*.xhtml' -o -name '*.opf' -o -name '*.ncx' \\) -print0 | xargs -0 xmllint --noout`,
  { stdio: 'pipe' }
);

// ---- 5. Preview visual (portada + día 1) ----
let previewPaths = [];
if (preview) {
  const prevDir = join(dirname(outPath), 'previews');
  mkdirSync(prevDir, { recursive: true });
  await page.setViewportSize({ width: 800, height: 1100 });
  for (const sec of ['cover', 'day-1']) {
    const f = join(staging, `OEBPS/xhtml/${sec}.xhtml`);
    if (!existsSync(f)) continue;
    await page.goto(pathToFileURL(f).href, { waitUntil: 'load' });
    const p = join(prevDir, `${id}-${sec}.png`);
    await page.screenshot({ path: p });
    previewPaths.push(p);
  }
}
await browser.close();

// ---- 6. Resumen ----
const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
console.log(`epub: ${outPath} (${kb(statSync(outPath).size)})`);
console.log(`  lang: ${lang} · capítulos: ${sections.length} (${sections.map((s) => s.id).join(', ')})`);
if (hasCover) console.log(`  cover.jpg: ${kb(statSync(join(staging, 'OEBPS/images/cover.jpg')).size)}`);
if (hasRouteMap) console.log(`  route-map.png: ${kb(statSync(join(staging, 'OEBPS/images/route-map.png')).size)}`);
for (const p of previewPaths) console.log(`  preview: ${p}`);
console.log('  validación: mimetype primero y Stored ✓ · xmllint bien formado ✓');
rmSync(staging, { recursive: true, force: true });

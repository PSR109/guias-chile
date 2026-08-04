#!/usr/bin/env node
// Generador de las páginas de TIENDA: tienda.html (ES), en/tienda.html (EN) y
// pt/tienda.html (PT).
//
// Por qué existe (medido el 2026-08-03): la cuenta tenía 32 productos LIVE en
// Gumroad (los 32 verificados 200 por curl) pero el sitio sólo enlazaba 21.
// Los 11 huérfanos incluían los tickets MÁS ALTOS del catálogo:
// chile-poi-dataset (US$49), senderos-chile (US$29), costos-ruta-cl-arg (US$29),
// patagonia-14d (US$29) y bundle-sur-de-chile (US$29). Inventario ya construido,
// ya publicado y cobrando exactamente 0 porque no había ni un enlace hacia él.
//
// Encima, el ÚNICO CTA comercial de la portada mandaba al perfil público de
// Gumroad, que sólo exhibe 9 de los 32 productos (el resto está LIVE por URL
// pero oculto del perfil — ver trip-kits/gumroad-live.json → tienda.nota). O sea
// el camino de compra por defecto escondía dos tercios del catálogo.
//
// Estas páginas son el escaparate propio: TODOS los productos comprables del
// idioma de la página, con precio real y enlace directo al permalink.
//
// Reglas que respeta (las mismas que hace cumplir scripts/check-cta-checkout.mjs):
//   - Política de idioma de trip-kits/alias-map.json: es→es, en→en, pt→pt|en.
//     Una página ES jamás lista un PDF en inglés.
//   - Precio: sale de trip-kits/gumroad-live.json → precio_usd, que se leyó del
//     og:price:amount real de cada producto. NUNCA se inventa un precio: si a un
//     producto le falta precio_usd, este script FALLA en vez de publicar un número
//     inventado (un precio equivocado en la página es peor que no mostrarlo).
//   - utm_campaign = slug del producto, igual que el resto de los CTAs del sitio,
//     para que trip-kits/build-alias-map.mjs los reconozca.
//
// Uso:  node scripts/build-tienda.mjs
//       node scripts/build-tienda.mjs --check   (no escribe; sale 1 si está stale)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOMAIN = "https://guias.viajesypanoramas.cl";

const catalogo = JSON.parse(readFileSync(join(ROOT, "trip-kits/gumroad-live.json"), "utf8"));
const alias = JSON.parse(readFileSync(join(ROOT, "trip-kits/alias-map.json"), "utf8"));
const POLITICA = alias.politica_idioma.reglas;
const LIVE = catalogo.productos;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Precio formateado tal como lo escribe el resto del sitio: US$12.9 / US$29.
const precio = (n) => `US$${Number.isInteger(n) ? n : String(n).replace(/0+$/, "").replace(/\.$/, "")}`;

// --- textos por idioma -------------------------------------------------------
const T = {
  es: {
    lang: "es",
    file: "tienda.html",
    url: `${DOMAIN}/tienda.html`,
    title: "Trip Kits PDF de Chile — catálogo completo | Guías de Chile",
    desc:
      "Todos los itinerarios PDF imprimibles de Chile: plan día a día, presupuesto 2026 y checklist. Descarga inmediata, pago seguro con tarjeta. Catálogo completo con precios.",
    h1: "Trip Kits PDF — catálogo completo",
    intro:
      "Itinerarios imprimibles para llevar sin conexión: plan día a día, costos reales 2026, mapas y checklist de equipaje. Pago único, descarga inmediata, sin suscripción.",
    volver: "← Volver a Guías de Chile",
    destacado: "Lo más completo",
    seccionKits: "Itinerarios por destino",
    seccionOtros: "Guías largas y packs",
    comprar: "Ver y comprar",
    nota: "Pago seguro con tarjeta vía Gumroad · descarga inmediata · factura por correo",
    incluye: "Incluye 4 trip kits del sur",
  },
  en: {
    lang: "en",
    file: "en/tienda.html",
    url: `${DOMAIN}/en/tienda.html`,
    title: "Chile Trip Kits & Datasets — full catalogue | Guías de Chile",
    desc:
      "Every printable Chile itinerary and travel dataset: day-by-day plans, 2026 budget tables and checklists. Instant download, one-off payment. Full catalogue with prices.",
    h1: "Trip Kits & Datasets — full catalogue",
    intro:
      "Printable itineraries you can carry offline: day-by-day plans, real 2026 costs, maps and packing checklists. One-off payment, instant download, no subscription.",
    volver: "← Back to Guías de Chile",
    destacado: "Most complete",
    seccionKits: "Itineraries by destination",
    seccionOtros: "Long guides & data packs",
    comprar: "View and buy",
    nota: "Secure card payment via Gumroad · instant download · emailed receipt",
    incluye: "Bundles 4 southern trip kits",
  },
  pt: {
    lang: "pt-BR",
    file: "pt/tienda.html",
    url: `${DOMAIN}/pt/tienda.html`,
    title: "Trip Kits do Chile — catálogo completo | Guías de Chile",
    desc:
      "Todos os roteiros PDF imprimíveis do Chile: plano dia a dia, orçamento 2026 e checklist. Download imediato, pagamento único. Catálogo completo com preços.",
    h1: "Trip Kits — catálogo completo",
    intro:
      "Roteiros imprimíveis para levar offline: plano dia a dia, custos reais de 2026, mapas e checklist de bagagem. Pagamento único, download imediato, sem assinatura.",
    volver: "← Voltar para Guías de Chile",
    destacado: "Mais completo",
    seccionKits: "Roteiros por destino",
    seccionOtros: "Guias longos e pacotes de dados",
    comprar: "Ver e comprar",
    nota: "Pagamento seguro com cartão via Gumroad · download imediato · recibo por e-mail",
    incluye: "Reúne 4 trip kits do sul",
    aviso:
      "Ainda não temos catálogo em português: os materiais abaixo estão em inglês. O conteúdo prático (mapas, tabelas de custos, distâncias) é legível sem problema, mas dizemos antes da compra para você decidir.",
  },
};

// Datasets y guías largas van en su propia sección: no son itinerarios de un
// destino, y mezclarlos con los trip kits confunde al comprador.
const NO_ITINERARIO = new Set([
  "chile-poi-dataset",
  "senderos-chile",
  "playas-chile",
  "termas-chile",
  "ferias-mercados-chile",
  "costos-ruta-cl-arg",
  "aso-keyword-pack",
  "chile-low-cost-30d",
  "guia-chile-en-auto",
]);

function productosDe(idioma) {
  const permitidos = POLITICA[idioma] ?? [idioma];
  const filas = Object.entries(LIVE)
    .filter(([, p]) => permitidos.includes(p.idioma))
    .map(([slug, p]) => {
      if (typeof p.precio_usd !== "number" || !Number.isFinite(p.precio_usd)) {
        throw new Error(
          `${slug}: falta precio_usd verificado en trip-kits/gumroad-live.json. ` +
            `Leerlo del og:price:amount real del producto; no inventarlo.`,
        );
      }
      return { slug, ...p };
    });
  // Orden: primero el ticket más alto (el bundle y los datasets caros), y a
  // igualdad de precio, alfabético por título. Poner adelante lo más caro es
  // deliberado: es el inventario que hoy no se enlazaba desde ninguna página.
  filas.sort((a, b) => b.precio_usd - a.precio_usd || a.titulo.localeCompare(b.titulo));
  return filas;
}

function tarjeta(p, t) {
  const url = `${p.url}?utm_source=guias&utm_medium=tienda&utm_campaign=${p.slug}`;
  const destacado = p.slug === "bundle-sur-de-chile";
  return [
    `<li class="kit-item${destacado ? " kit-item-destacado" : ""}">`,
    destacado ? `<span class="kit-badge">${esc(t.destacado)}</span>` : "",
    `<h3><a href="${esc(url)}" rel="sponsored noopener" target="_blank">${esc(p.titulo)}</a></h3>`,
    `<p class="kit-precio"><span class="kit-price">${precio(p.precio_usd)}</span></p>`,
    destacado ? `<p class="kit-nota">${esc(t.incluye)}</p>` : "",
    `<p><a class="boton" href="${esc(url)}" rel="sponsored noopener" target="_blank">${esc(t.comprar)}</a></p>`,
    `</li>`,
  ]
    .filter(Boolean)
    .join("\n");
}

function alternates(t) {
  return [
    `<link rel="alternate" hreflang="es" href="${T.es.url}">`,
    `<link rel="alternate" hreflang="en" href="${T.en.url}">`,
    `<link rel="alternate" hreflang="pt-BR" href="${T.pt.url}">`,
    `<link rel="alternate" hreflang="x-default" href="${T.es.url}">`,
  ].join("\n");
}

function pagina(idiomaClave) {
  const t = T[idiomaClave];
  const prods = productosDe(idiomaClave === "pt" ? "pt" : idiomaClave);
  const itinerarios = prods.filter((p) => !NO_ITINERARIO.has(p.slug));
  const otros = prods.filter((p) => NO_ITINERARIO.has(p.slug));
  const raiz = idiomaClave === "es" ? "" : "../";
  const home = idiomaClave === "es" ? "index.html" : "index.html";

  // ItemList de schema.org: le dice a Google que esto es un catálogo con
  // precios, no una página de texto. Cada oferta lleva su precio real.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.h1,
    numberOfItems: prods.length,
    itemListElement: prods.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.titulo,
        url: p.url,
        offers: {
          "@type": "Offer",
          price: String(p.precio_usd),
          priceCurrency: p.moneda ?? "USD",
          availability: "https://schema.org/InStock",
          url: p.url,
        },
      },
    })),
  };

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${t.url}">
<meta name="robots" content="index, follow">
${alternates(t)}
<link rel="icon" href="${raiz}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${raiz}estilo.css">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${t.url}">
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
</head>
<body>
<main style="max-width:900px;margin:0 auto;padding:1.5rem">
<h1>${esc(t.h1)}</h1>
<p>${esc(t.intro)}</p>
${t.aviso ? `<p class="afiliado-nota">${esc(t.aviso)}</p>` : ""}

<h2>${esc(t.seccionKits)}</h2>
<ul class="kit-lista">
${itinerarios.map((p) => tarjeta(p, t)).join("\n")}
</ul>

<h2>${esc(t.seccionOtros)}</h2>
<ul class="kit-lista">
${otros.map((p) => tarjeta(p, t)).join("\n")}
</ul>

<p class="afiliado-nota">${esc(t.nota)}</p>
<p style="margin-top:1.5rem"><a href="${home}">${esc(t.volver)}</a></p>
</main>
</body>
</html>
`;
}

const soloCheck = process.argv.includes("--check");
let stale = 0;
for (const clave of ["es", "en", "pt"]) {
  const t = T[clave];
  const destino = join(ROOT, t.file);
  const html = pagina(clave);
  if (soloCheck) {
    let actual = null;
    try {
      actual = readFileSync(destino, "utf8");
    } catch {
      /* no existe */
    }
    if (actual !== html) {
      console.error(`build-tienda --check: ${t.file} está desactualizado. Correr: node scripts/build-tienda.mjs`);
      stale++;
    }
  } else {
    writeFileSync(destino, html);
    const n = productosDe(clave).length;
    console.log(`build-tienda: ${t.file} — ${n} productos con precio verificado`);
  }
}
if (stale) process.exit(1);
if (soloCheck) console.log("build-tienda --check: OK (las 3 tiendas están al día)");

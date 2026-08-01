// Kit gen-3 ES (ronda 4, WP 10K.5.16, 2026-08-01): 'Iquique + Altiplano' 4 dias.
//
// ARCHIVO PROPIO de la ronda 4 — NO editar kits.config.mjs (archivo compartido,
// otros agentes trabajan en paralelo). El objeto KIT tiene EXACTAMENTE el mismo
// shape que las entradas de kits.config.mjs, para que un mantenedor pueda
// mergearlo alla cuando se cablee el producto (PAYHIP_URLS + READY_KITS).
// El build corre con build-iquique-altiplano.mjs (pipeline propio que reusa
// lib/extract-guide.mjs, lib/panoramas.mjs y lib/chromium.mjs sin tocarlos).
//
// Fuentes (cero datos inventados, verificado 2026-08-01):
// - Dias 1-3: pulls de la guia ES raiz iquique.html (Cavancha, Duna del Dragon,
//   Zofri, Humberstone, Pampa del Tamarugal, llegada, presupuesto).
// - Dia 4 (altiplano): iquique.html NO tiene contenido de altiplano; la guia ES
//   arica.html si: Ruta 11 / paso Chungara / Parque Nacional Lauca por sobre los
//   4.500 msnm (seccion 'Como llegar y cuando ir') + FAQ explicita ("Sumar un
//   cruce al altiplano (Lauca, Putre) conviene con 1-2 dias mas, por la
//   aclimatacion"). El cruce se plantea como dia completo desde Arica (300 km /
//   ~4 h desde Iquique por Ruta 5, dato de ambas guias), durmiendo en Arica la
//   noche anterior (tag dia-completo del catalogo, h=10).
// - POIs bonus: catalogo Panoramas con descripcion_es EDITORIAL real. Los 4 POIs
//   estrella del altiplano (Lauca/Chungara, Cotacotani, Parinacota, Payachatas)
//   NO se excluyen pese a ser el destino del dia 4: el cuerpo del dia 4 (pulls
//   de arica.html) cubre logistica/contexto y no duplica el texto de las fichas
//   — sin ellas el altiplano desapareceria del PDF, que es la promesa del titulo.
// - Dedup editorial: fuera los 7 lugares que ya son contenido de los dias 1-3
//   (Cavancha, Cerro Dragon, parapente, ZOFRI, Humberstone, Pintados, Tamarugal).
// - Excluido el boilerplate autogenerado verificado 2026-08-01: fichas
//   "Cascada, lago o cuerpo de agua en Tarapaca/Arica y Parinacota, Chile.",
//   stubs "Mirador en ..." de 27-37 chars, y fichas stats/template (Ramsar,
//   Santuarios, "es un panorama de Naturaleza y Parques en ..."). Con el
//   scoring de topPois (imperdible+foto+largo) ese junk nunca entra al top-12,
//   pero las stats-fichas con foto+>120 chars si compiten: van en poiExclude.

const D = (title, intro, pulls) => ({ title, intro, pulls });
const R = (day, name, lat, lon) => ({ day, name, lat, lon });

const IQUIQUE_ALTIPLANO_DAYS = [
  D('Llegada a Iquique: Cavancha y el borde costero',
    'Aterriza en el Aeropuerto Diego Aracena (IQQ), a unos 40 km del centro, e instálate frente al mar. La tarde es para Playa Cavancha — arena ancha y aguas tranquilas aptas para nadar todo el año — con caminata por la costanera al atardecer y cena de pescados frente a la península.',
    [
      { guide: 'iquique', headings: ['Cómo llegar y cuándo ir', '1. Qué es Iquique', '2. Playa Cavancha y el borde costero'] },
    ]),
  D('Duna del Dragón: sandboard o parapente + tarde libre en la Zofri',
    'Mañana de adrenalina en la Duna del Dragón, la duna urbana de más de 300 metros que domina la ciudad: clase de sandboard o vuelo en parapente biplaza con piloto certificado, siempre con escuelas establecidas. La tarde queda libre para la Zofri, la zona franca libre de impuestos que mueve la economía local desde 1975.',
    [
      { guide: 'iquique', headings: ['3. Duna del Dragón: sandboard y parapente', '4. Zofri: la zona franca más grande del norte'] },
    ]),
  D('Humberstone, Santa Laura y los geoglifos de la pampa',
    'Mañana de pampa: las oficinas salitreras Humberstone y Santa Laura — Patrimonio de la Humanidad UNESCO desde 2005 — a 45 minutos de la ciudad, más el bosque de tamarugos y el campo de geoglifos de Pintados; los tours de medio día cubren el circuito completo. De vuelta en Iquique, la tarde queda para el centro histórico de la época del salitre o la playa. Ojo: a mediados de julio la Fiesta de La Tirana llena los accesos a la pampa.',
    [
      { guide: 'iquique', headings: ['5. Humberstone y Santa Laura: salitreras Patrimonio de la Humanidad', '6. Pampa del Tamarugal: bosque, geoglifos y desierto absoluto'] },
    ]),
  D('Cruce al altiplano: Arica, Putre y el Parque Nacional Lauca',
    'El salto al altiplano: bus Iquique → Arica (300 km, unas 4 horas por la Ruta 5 — tómalo la tarde del día 3 para dormir allá) y el cruce de día completo por la Ruta 11 al Parque Nacional Lauca: lago Chungará, los volcanes Payachatas y el pueblo de Parinacota, por sobre los 4.500 msnm. La subida es rápida, así que tómate los días previos con calma e hidrátate bien. Como cierre, puedes volar de vuelta desde Arica sin repetir camino.',
    [
      { guide: 'arica', headings: ['1. Qué es Arica', 'Cómo llegar y cuándo ir'] },
    ]),
];

// Coordenadas aproximadas (esquema, no cartografia). route.length === days.length.
const IQUIQUE_ALTIPLANO_ROUTE = [
  R(1, 'Iquique', -20.214, -70.152),
  R(2, 'Duna del Dragón', -20.252, -70.108),
  R(3, 'Humberstone / Pampa del Tamarugal', -20.291, -69.796),
  R(4, 'P.N. Lauca / Lago Chungará (vía Arica)', -18.243, -69.157),
];

export const KIT = {
  id: 'iquique-altiplano-4d-es',
  lang: 'es',
  title: 'Iquique + Altiplano: 4 días',
  subtitle: 'Playa Cavancha, la Duna del Dragón, las salitreras Patrimonio de la Humanidad y el cruce al Parque Nacional Lauca y el lago Chungará por sobre los 4.500 msnm — la ruta completa con presupuesto 2026',
  priceUsd: 12.9,
  gumroadPermalink: 'iquique-altiplano-4d-es',
  affQuery: 'Iquique',
  coverImage: 'iquique.jpg',
  days: IQUIQUE_ALTIPLANO_DAYS,
  route: IQUIQUE_ALTIPLANO_ROUTE,
  checklist: [
    'Vuelo a Iquique (IQQ) reservado: el aeropuerto Diego Aracena queda a unos 40 km del centro — coordina transfer o arriendo de auto con anticipación',
    'Sandboard o parapente en la Duna del Dragón reservado con escuela u operador establecido; en fines de semana largos el parapente se agota',
    'Tour o transporte a Humberstone y Santa Laura definido: la entrada incluye ambas oficinas y los tours de medio día suman los geoglifos de Pintados',
    'Bus Iquique → Arica (300 km, unas 4 horas por la Ruta 5) comprado para la tarde del día 3: el cruce al altiplano es de día completo y conviene dormir en Arica la noche anterior',
    'Aclimatación tomada en serio: la Ruta 11 al lago Chungará sube por sobre los 4.500 msnm — primeros días con calma, buena hidratación y, si eres sensible a la altura, considera dormir en Putre',
    'Capas y cortaviento: la costa se mantiene en 18-25 °C casi todo el año, pero el altiplano sobre 4.500 msnm exige abrigo real incluso en verano',
    'Efectivo en CLP para entradas (salitreras, geoglifos, termas) y compras menores fuera de la ciudad',
    'Si viajas a mediados de julio: la Fiesta de La Tirana llena los accesos a la Pampa del Tamarugal — reserva alojamiento con mucha anticipación',
  ],
  budget: [
    { guide: 'iquique', heading: 'Precios orientativos (2026)' },
    { guide: 'arica', heading: 'Precios orientativos (2026)' },
  ],
  faqFrom: ['iquique', 'arica'],
  poiComunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica', 'Huara', 'Putre'],
  // Dedup editorial (7 primeros: contenido de los dias 1-3) + junk/stats
  // verificado 2026-08-01 (fichas Ramsar/Santuario/template "es un panorama de",
  // stubs). Seleccion final simulada con topPois: 12 POIs todos editoriales —
  // Lauca/Chungara, Cotacotani, Parinacota, Payachatas, Mercado Centenario,
  // Mirador Alto Hospicio, Jurasi, Cocha Resbaladero, Mamiña, Oasis de Pica,
  // Gigante de Tarapaca, Paseo Baquedano.
  poiExclude: [
    'Playa Cavancha', 'Cerro Dragón', 'Parapente en Alto Hospicio',
    'Zona Franca de Iquique (ZOFRI)',
    'Oficinas Salitreras de Humberstone y Santa Laura', 'Geoglifos de Pintados',
    'Reserva Nacional Pampa del Tamarugal',
    'Santuario de la Naturaleza Cerro Dragón', 'Sitio Ramsar Salar de Surire',
    'Sitio Ramsar y Santuario de la Naturaleza Salar de Huasco',
    'Parque Nacional Salar del Huasco', 'Bien Nacional Protegido Cerro Unita',
    'Santuario de la Naturaleza Quebrada de Chacarilla',
    'Santuario de la Naturaleza Oasis de Niebla Punta Gruesa',
    'Humedal Urbano Playa Blanca',
    'Reserva Nacional Pampa del Tamarugal - Salar de Llamara',
    'Cerro Santiago', 'Gabriela Mistral',
  ],
  poiLimit: 12,
};

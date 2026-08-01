// Kit gen-3 ES (ronda 4, WP 10K.5.13, 2026-08-01): Valparaíso + Viña del Mar, 3 días.
// Archivo PROPIO (no editar kits.config.mjs — compartido entre agentes). Mismo molde
// que los kits gen-2 ES de kits.config.mjs (lang:'es', affQuery, pulls a headings
// EXACTOS de la guia ES raiz valparaiso.html). Se compila con
// build-valparaiso-vina-3d-es.mjs → build/valparaiso-vina-3d-es/.

const D = (title, intro, pulls) => ({ title, intro, pulls });
const R = (day, name, lat, lon) => ({ day, name, lat, lon });

// Coordenadas aproximadas (esquema, no cartografia). route.length === days.length SIEMPRE.
const VALPO_VINA_ROUTE = [
  R(1, 'Valparaíso (Cerro Alegre)', -33.0427, -71.6245),
  R(2, 'Cerro Bellavista (La Sebastiana)', -33.0562, -71.6206),
  R(3, 'El plan + Viña del Mar', -33.0245, -71.5518),
];

// Todos los pulls referencian headings EXACTOS de valparaiso.html (ES, raiz),
// verificados 2026-08-01. No existe guia propia de Viña del Mar: toda la
// cobertura ES de Viña del repo vive en el heading 5 de esta guia.
const VALPO_VINA_DAYS = [
  D('Llegada a Valparaíso y los cerros Alegre y Concepción',
    'Desde Santiago son unos 120 km por la Ruta 68 (1 h 30-2 h): buses cada 15-20 minutos desde los terminales Alameda o San Borja. Instálate en un hostal de Cerro Alegre o Concepción y dedica la tarde a perderte a pie por los dos cerros patrimoniales: escaleras empedradas, miradores sobre la bahía y cafés con vista.',
    [{ guide: 'valparaiso', headings: ['Cómo llegar y cuándo ir', '1. Qué es Valparaíso', '2. Cerro Alegre y Cerro Concepción'] }]),
  D('Ascensores centenarios, La Sebastiana y el arte callejero',
    'El día de los clásicos porteños: sube en uno de los ascensores que siguen operando desde fines del siglo XIX (Concepción, Artillería, El Peral o Reina Victoria), recorre La Sebastiana —la casa de Pablo Neruda en Cerro Bellavista, conviene comprar la entrada online— y sigue el rastro de los murales de gran formato del propio cerro.',
    [{ guide: 'valparaiso', headings: ['3. Los ascensores, patrimonio en movimiento', '4. La Sebastiana y el arte callejero de Cerro Bellavista'] }]),
  D('El plan portuario y la tarde en Viña del Mar',
    'Baja al plan: la Plaza Sotomayor con el Monumento a los Héroes de Iquique, mariscos frescos en el Mercado Puerto o el Mercado Cardonal y una caminata por el Muelle Barón y el barrio Puerto. En la tarde cruza a Viña del Mar —15-20 minutos en auto o colectivo— para el Reloj de Flores, la Quinta Vergara y la costanera al atardecer.',
    [{ guide: 'valparaiso', headings: ['5. Plaza Sotomayor, el plan y Viña del Mar'] }]),
];

export const KIT = {
  id: 'valparaiso-vina-3d-es',
  lang: 'es',
  title: 'Valparaíso + Viña del Mar: 3 días',
  subtitle: 'Cerros patrimoniales, ascensores centenarios, la casa de Neruda, el plan portuario y un día completo entre Viña del Mar y sus playas — la ruta completa con presupuesto 2026',
  priceUsd: 9.9,
  gumroadPermalink: 'valparaiso-vina-3d-es',
  affQuery: 'Valparaíso',
  coverImage: 'valparaiso.jpg',
  days: VALPO_VINA_DAYS,
  route: VALPO_VINA_ROUTE,
  checklist: [
    'Bus Santiago–Valparaíso definido: salidas cada 15-20 minutos desde Terminal Alameda o San Borja (Turbus, Pullman Bus, Condor Bus); en enero-febrero y fines de semana largo conviene comprar antes',
    'Alojamiento reservado en Cerro Alegre o Cerro Concepción (CLP 35.000–80.000 la noche en hostal boutique; para Año Nuevo se agota con meses de anticipación)',
    'Entrada a La Sebastiana comprada online con anticipación (CLP 7.000–9.000; se agota en temporada alta y fines de semana largo)',
    'Efectivo en CLP para los ascensores: algunos solo aceptan efectivo y la tarifa varía de un cerro a otro (CLP 300–1.000 por viaje)',
    'Efectivo para el colectivo a Viña del Mar (15-20 minutos desde el plan)',
    'Calzado cómodo para subir y bajar cerros empedrados todo el día',
    'Capas: la nubosidad costera de la mañana suele despejar al mediodía, pero el borde costero pide cortaviento',
    'Bloqueador solar para la tarde de costanera y playas de Viña',
  ],
  budget: [{ guide: 'valparaiso', heading: 'Precios orientativos (2026)' }],
  faqFrom: ['valparaiso'],
  poiComunas: ['Valparaíso', 'Viña del Mar'],
  // Dedup editorial (verificado 2026-08-01 contra el catalogo):
  // - Primer bloque: lugares que YA son contenido de los dias 1-3 (La Sebastiana
  //   x3 fichas, el museo a cielo abierto de Bellavista, y lo nombrado en el
  //   heading 5: Plaza Sotomayor, ambos mercados, Muelle Baron) — el bonus es EXTRA.
  // - Segundo bloque: bustos/estatuas con descripcion de placa ("Consiste en un
  //   busto de granito..."), humedales con ficha de hectareas, evento de fecha
  //   fija (29 jun) y stubs autogenerados de 27-52 chars ("Mirador en Valparaíso,
  //   Chile.") — incluidos los de Viña cuyo texto dice "en Valparaíso, Chile."
  //   (comuna errada en el stub).
  // Quedan 10 POIs reales y vigentes: miradores clasicos, Caleta Portales, los
  // iconos de Viña (Reloj de Flores, Casino, Renaca, Jardin Botanico con precios
  // 2026) y los dos castillos con su estado real (Wulff cerrado por restauracion,
  //   Brunet solo jornadas especiales — info que evita un viaje perdido).
  poiExclude: [
    'Casa Museo La Sebastiana', 'La Sebastiana (Casa de Pablo Neruda)', 'La Sebastiana',
    'Museo a Cielo Abierto, Cerro Bellavista',
    'Plaza Sotomayor', 'Mercado Puerto', 'Mercado Cardonal', 'Muelle Barón',
    'Micaela Cáceres', 'Gabriela Mistral', 'Isabel La Católica',
    'Obelisco a Diego Portales', 'Dr. Ernesto Quiros W.',
    'Capitán de Ejército Alberto Larraguibel', 'Gran Chascón', 'Día uno', 'Por Favor',
    'Humedal Urbano Kan Kan', 'Humedal Urbano Estero Reñaca',
    'Humedal Urbano Laguna El Criquet y Quebrada Honda',
    'Procesión de San Pedro en Caleta Portales',
    'Laguna Sausalito', 'Mirador Castillo Wolff', 'Mirador Padre Hurtado',
    'Mirador Castillo Brunet', 'Puente Casino', 'Playa Los Marineros',
    'Reñaca', 'Balneario Las Salinas', 'Playa Cochoa',
  ],
  poiLimit: 10,
};

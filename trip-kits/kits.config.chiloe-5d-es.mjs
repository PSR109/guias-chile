// WP 10K.5.11 (2026-08-01, ronda 4): kit gen-2 ES `chiloe-5d-es` (US$12.90, 5 días).
//
// Este archivo NO se importa desde kits.config.mjs (archivo compartido — lo cablea
// el integrador). ES la definición completa y lista para pegar ahí: entry del array
// KITS + constantes CHILOE_DAYS_ES / CHILOE_ROUTE_ES, con el mismo formato de los
// kits gen-2 (termas-del-sur-4d, atacama-5d-es, torres-del-paine-5d-es).
// La compilación aislada la hace build-chiloe-5d-es.mjs reutilizando el pipeline
// real (compile-html.mjs + build-pdf.mjs) con este archivo como config.
//
// Contenido 100% del repo (cero datos inventados): pulls a las guías ES raíz
// chiloe.html y puerto-montt.html (headings EXACTOS verificados 2026-08-01) +
// 4 POIs bonus del catálogo Panoramas con descripcion_es editorial real.
// A diferencia del kit EN `chiloe-lakes-5d` (Puerto Varas + volcán Osorno +
// Frutillar + 2 días de isla), este kit es 100% Chiloé: los 5 días entre el
// cruce del Chacao y el regreso, con Puerto Montt solo como puerta de entrada/salida.

const D = (title, intro, pulls) => ({ title, intro, pulls });
const R = (day, name, lat, lon) => ({ day, name, lat, lon });

// Ruta esquemática (coords aprox, una parada por día; route.length === days.length).
export const CHILOE_ROUTE_ES = [
  R(1, 'Ancud (cruce del Chacao)', -41.87, -73.83),
  R(2, 'Castro', -42.48, -73.76),
  R(3, 'Achao (isla Quinchao)', -42.47, -73.49),
  R(4, 'Dalcahue', -42.38, -73.65),
  R(5, 'Chonchi', -42.62, -73.77),
];

// Todos los pulls referencian headings EXACTOS de chiloe.html y puerto-montt.html
// (ES, raíz del repo — verificados 2026-08-01 con grep de <h2>/<h3>).
export const CHILOE_DAYS_ES = [
  D('Llegada a Puerto Montt y cruce del Canal de Chacao',
    'Vuela a Puerto Montt (PMC), el aeropuerto por donde entra la mayoría de los vuelos al sur de Chile, y sigue por tierra a Pargua (~1 h, unos 57 km) para el cruce en ferry por el Canal de Chacao (~30 min, salidas frecuentes todo el día; en bus hay servicios directos Puerto Montt–Castro que incluyen el ferry en el pasaje). Del desembarco a Ancud o Castro es otra ~1 h a 1 h 15: hoy toca llegar, instalarse y dejar listas las reservas.',
    [
      { guide: 'puerto-montt', headings: ['4. El aeropuerto El Tepual, puerta de entrada al sur', '5. Rumbo a Chiloé o a la Carretera Austral'] },
      { guide: 'chiloe', headings: ['Cómo llegar y cuándo ir'] },
    ]),
  D('Castro: palafitos y la Iglesia de San Francisco',
    'El día de la capital de la provincia: los palafitos de la costanera de los ríos Gamboa y Ten Ten —casas de madera de colores sobre pilotes, pensadas para que los pescadores subieran sus botes bajo la propia vivienda— y, frente a la plaza, la Iglesia de San Francisco, amarilla y lila, una de las 16 iglesias chilotas Patrimonio de la Humanidad. Tarde libre entre cafés y tiendas de artesanía instalados en los propios palafitos.',
    [{ guide: 'chiloe', headings: ['1. Castro: palafitos y la Iglesia de San Francisco'] }]),
  D('Las iglesias Patrimonio de la Humanidad',
    'El paseo cultural clásico de la isla: un día completo recorriendo dos o tres de las 16 iglesias de madera construidas por misiones jesuitas y franciscanas entre los siglos XVII y XIX, con la técnica local de tejuelas de alerce sin clavos. Además de San Francisco en Castro, las más visitadas son Achao —la más antigua, en la isla Quinchao—, Tenaún, Vilupulli y Colo.',
    [{ guide: 'chiloe', headings: ['2. Iglesias de Chiloé, Patrimonio de la Humanidad'] }]),
  D('Dalcahue, las islas menores y el curanto',
    'A 20 minutos de Castro, Dalcahue suma su feria artesanal (más fuerte los domingos) y el embarcadero hacia la isla Quinchao y las islas menores del archipiélago, como Mechuque: caletas con más palafitos y mucho menos turismo que Castro. El almuerzo se resuelve con el plato insular: curanto al hoyo si te toca una preparación comunitaria, o la versión de restaurante —curanto en olla o pulmay— disponible todos los días.',
    [{ guide: 'chiloe', headings: ['5. Dalcahue y las islas menores', '3. Curanto, el sabor de la isla'] }]),
  D('Mitología chilota y regreso por Puerto Montt',
    'Cierre con el imaginario de la isla —el Trauco, la Pincoya, el Caleuche— que museos y guías locales de Castro y Chonchi cuentan en detalle, y regreso al continente con parada en Puerto Montt: las cocinerías y la artesanía en lana y madera del mercado de Angelmó, la costanera frente al Seno de Reloncaví y la Catedral de la Plaza de Armas antes del vuelo.',
    [
      { guide: 'chiloe', headings: ['4. Mitología chilota'] },
      { guide: 'puerto-montt', headings: ['1. Angelmó', '3. La costanera y la Plaza de Armas'] },
    ]),
];

export const KIT_CHILOE_5D_ES = {
  id: 'chiloe-5d-es',
  lang: 'es',
  title: 'Chiloé en 5 días',
  subtitle: 'Cruce del Canal de Chacao en ferry, palafitos e iglesias Patrimonio de la Humanidad, Dalcahue y las islas menores, curanto y mitología chilota — la ruta completa con presupuesto 2026',
  priceUsd: 12.9,
  gumroadPermalink: 'chiloe-5d-es',
  affQuery: 'Chiloe Chile',
  coverImage: 'chiloe.jpg',
  days: CHILOE_DAYS_ES,
  route: CHILOE_ROUTE_ES,
  checklist: [
    'Pasaje a la isla definido: bus directo Puerto Montt–Castro (incluye el ferry en el pasaje, ~4 h total) o auto + ferry Pargua–Chacao (el cruce del auto se paga aparte, CLP 15.000–16.000)',
    'Nada de puente Chacao: sigue en obra (entrega estimada 2028) — el cruce es en ferry desde Pargua, no asumas paso en auto sin ferry',
    'Alojamiento reservado en Castro, la base con más oferta de hospedaje y restaurantes de la isla',
    'Cortaviento e impermeable SIEMPRE: clima de selva valdiviana, llueve en cualquier época del año, incluso en enero',
    'Un día completo libre para el circuito de iglesias UNESCO (dos o tres templos + Dalcahue es el paseo cultural clásico)',
    'Si puedes cuadrar un domingo en Dalcahue: la feria artesanal es más fuerte ese día',
    'Curanto al hoyo coordinado con anticipación (es preparación comunitaria) o curanto en olla/pulmay en restaurante como plan B diario',
    'Efectivo en CLP para ferias artesanales, cocinerías y caletas de las islas menores',
    'Horarios del embarcadero de Dalcahue confirmados para el cruce a Quinchao (Achao) o Mechuque',
    'Si las pingüineras de Puñihuil entran en tus planes (bonus): la temporada de pingüinos es septiembre-marzo',
  ],
  budget: [
    { guide: 'chiloe', heading: 'Precios orientativos (2026, por persona)' },
    { guide: 'puerto-montt', heading: 'Precios orientativos (2026)' },
  ],
  faqFrom: ['chiloe', 'puerto-montt'],
  poiComunas: ['Ancud', 'Castro', 'Dalcahue', 'Chonchi', 'Quinchao', 'Puerto Montt'],
  // Dedup editorial (verificado 2026-08-01 contra el catálogo completo): los 4
  // primeros nombres ya son contenido de los días 1-5 (San Francisco y palafitos
  // del día 2, Angelmó del día 5, feria de Dalcahue del día 4) — el bonus tiene
  // que ser EXTRA. El resto de la exclusión es boilerplate autogenerado: fichas
  // stats de hectáreas (humedales/santuarios), la ficha UNESCO-stats duplicada
  // "Iglesia San Francisco", un camping con reseña EN ("Vista Hermosa"), el busto
  // "Gabriela Mistral" con descripción de pedestal y el mirador "Barranco...
  // Lamecura" con texto cortado a mitad de palabra. Quedan 4 POIs editoriales
  // reales: PN Alerce Andino, Pingüineras de Puñihuil, Iglesia Ntra. Sra. del
  // Rosario (Chonchi) y Muestra Costumbrista de Castro. (Parque Privado
  // Tepuhueico y Melipulli también son editoriales, pero salir a buscarlos
  // exigía excluir otras ~50 fichas junk mejor rankeadas — costo desproporcionado;
  // evaluable si el catálogo mejora.)
  poiExclude: [
    'Iglesia San Francisco de Castro', 'Palafitos de Castro (Gamboa y Pedro Montt)',
    'Mercado y Cocinerías de Angelmó', 'Feria Artesanal y Costanera de Dalcahue',
    'Barranco Anais Orellana Caicheo, Lamecura', 'Gabriela Mistral',
    'Memorial de Detenidos Desaparecidos y Ejecutados Políticos de Ancud',
    'Vista Hermosa', 'Humedal Marino de Chamiza', 'Parque Tepuhueico',
    'Santuario de la Naturaleza Parque Katalapi', 'Sitio RHRAP Humedal Marino de Coihuín',
    'Santuario de la Naturaleza Humedal Bahía de Quinchao', 'Iglesia San Francisco',
  ],
  poiLimit: 4,
};

// El pipeline (compile-html.mjs / build-pdf.mjs) itera `KITS`; los drivers de
// compilación aislada apuntan ese import a este archivo.
export const KITS = [KIT_CHILOE_5D_ES];

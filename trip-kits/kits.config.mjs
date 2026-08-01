// 5 SKUs. Los "pulls" referencian headings EXACTOS de los HTML en /en/ (verificados 2026-07-21).
// El numero de dia lo pone el compilador (Day 1..N), aqui solo va el titulo del dia.

export const GUMROAD_BASE = 'https://patricio358.gumroad.com/l';

// URLs Payhip REALES de los 10 kits gen-1 (productos creados 2026-07-30; los CTAs
// en guias migraron Gumroad -> Payhip ese dia, comision 5% vs 10%). Fuente: listings/*.md.
// El inyector (inject-kit-cta.mjs) las prefiere sobre el permalink Gumroad.
// null = producto aun no creado; el codigo /b/<CODE> lo genera Payhip, NO inventarlo.
export const PAYHIP_URLS = {
  'atacama-5d': 'https://payhip.com/b/lBTyt',
  'carretera-austral-7d': 'https://payhip.com/b/MxXD4',
  'chiloe-lakes-5d': 'https://payhip.com/b/hdBVf',
  'elqui-stars-4d': 'https://payhip.com/b/uy4v9',
  'patagonia-14d': 'https://payhip.com/b/jwes1',
  'pucon-volcano-4d': 'https://payhip.com/b/WjFp0',
  'rapa-nui-4d': 'https://payhip.com/b/b97TX',
  'santiago-cajon-4d': 'https://payhip.com/b/Qrh0p',
  'tdp-no-car': 'https://payhip.com/b/9CyLp',
  'valpo-wine-4d': 'https://payhip.com/b/ydz2j',
  'termas-del-sur-4d': 'https://payhip.com/b/XDjCS', // creado y verificado 2026-08-01
  // Kits gen-2 ES de la tanda 2026-08-01 (radal + gemelo ES de santiago-cajon):
  // creados y verificados 2026-08-01 (Gumroad espejo: /l/radal-siete-tazas-3d y /l/santiago-cajon-es).
  'radal-siete-tazas-3d': 'https://payhip.com/b/ZD0xY',
  'santiago-cajon-4d-es': 'https://payhip.com/b/asZlb',
  // Kits gen-2 ES de la tanda 3 (2026-08-01, gemelos ES de atacama-5d y tdp-no-car):
  // creados y verificados 2026-08-01 (Payhip; espejo Gumroad: atacama listo, tdp pendiente por cupo 10/dia).
  'atacama-5d-es': 'https://payhip.com/b/ONobC',
  'torres-del-paine-5d-es': 'https://payhip.com/b/VysH7',
  // Kits gen-3 ES de la ronda 4 (2026-08-01): creados y verificados en Payhip
  // (fuente: tools/chrome/payhip-results-r4.jsonl del repo raiz).
  // malalcahuello-conguillio-4d-es NO tiene guia destino (documentado en su
  // listing): URL registrada aqui, pero no va al MAP del inyector.
  'chiloe-5d-es': 'https://payhip.com/b/f6KZF',
  'pucon-4d-es': 'https://payhip.com/b/RlCHK',
  'valparaiso-vina-3d-es': 'https://payhip.com/b/Itnmo',
  'carretera-austral-norte-7d-es': 'https://payhip.com/b/JY2nc',
  'valle-elqui-4d-es': 'https://payhip.com/b/3za2d',
  'iquique-altiplano-4d-es': 'https://payhip.com/b/x90rj',
  'malalcahuello-conguillio-4d-es': 'https://payhip.com/b/O7gIr',
};

const D = (title, intro, pulls) => ({ title, intro, pulls });

// ---------- Rutas para el mapa esquematico (una parada por dia) ----------
// Coordenadas aproximadas (esquema, no cartografia). route.length === days.length SIEMPRE.

const R = (day, name, lat, lon) => ({ day, name, lat, lon });

const TDP_ROUTE = [
  R(1, 'Punta Arenas', -53.163, -70.917),
  R(2, 'Puerto Natales', -51.729, -72.498),
  R(3, 'Torres del Paine (road loop)', -51.06, -73.0),
  R(4, 'Base Torres trailhead', -50.95, -72.86),
  // Nudge deliberado (~0.2°) respecto del dia 1 para que los badges D1 y D5 no se superpongan en el SVG:
  R(5, 'Punta Arenas (return)', -53.35, -70.6),
];

const AUSTRAL_ROUTE = [
  R(1, 'Hornopirén', -41.94, -72.43),
  R(2, 'Chaitén / Pumalín', -42.92, -72.71),
  R(3, 'Futaleufú', -43.19, -71.87),
  R(4, 'Coyhaique', -45.57, -72.07),
  R(5, 'Villa Cerro Castillo', -46.12, -72.16),
  R(6, 'Puerto Río Tranquilo', -46.62, -72.68),
  R(7, 'Balmaceda', -45.91, -71.69),
];

const LAKES_ROUTE = [
  R(1, 'Puerto Varas', -41.32, -72.98),
  R(2, 'Osorno Volcano', -41.1, -72.49),
  R(3, 'Frutillar', -41.13, -73.06),
  R(4, 'Ancud', -41.87, -73.83),
  R(5, 'Castro', -42.48, -73.76),
];

const ATACAMA_ROUTE = [
  R(1, 'San Pedro de Atacama', -22.91, -68.2),
  R(2, 'Valle de la Luna', -22.92, -68.3),
  R(3, 'El Tatio geysers', -22.33, -68.01),
  R(4, 'Piedras Rojas', -23.75, -67.78),
  R(5, 'Laguna Cejar', -22.97, -68.22),
];

const PATAGONIA14_ROUTE = [
  R(1, 'Puerto Varas', -41.32, -72.98),
  R(2, 'Osorno Volcano', -41.1, -72.49),
  R(3, 'Frutillar', -41.13, -73.06),
  R(4, 'Ancud', -41.87, -73.83),
  R(5, 'Castro', -42.48, -73.76),
  R(6, 'Coyhaique (fly to Balmaceda)', -45.57, -72.07),
  R(7, 'Villa Cerro Castillo', -46.12, -72.16),
  R(8, 'Puerto Río Tranquilo', -46.62, -72.68),
  R(9, 'Punta Arenas (fly south)', -53.163, -70.917),
  R(10, 'Puerto Natales', -51.729, -72.498),
  R(11, 'Puerto Natales', -51.729, -72.498),
  R(12, 'Torres del Paine (road loop)', -51.06, -73.0),
  R(13, 'Base Torres trailhead', -50.95, -72.86),
  // Nudge deliberado (~0.2°) respecto del dia 9 para que los badges D9 y D14 no se superpongan en el SVG:
  R(14, 'Punta Arenas (return)', -53.35, -70.6),
];

// ---------- Dias reutilizables (se comparten con el kit 14 dias) ----------

const TDP_DAYS = [
  D('Land in Punta Arenas, bus to Puerto Natales',
    'Fly into Punta Arenas (PUQ), grab lunch downtown, then take the 3-hour bus to Puerto Natales — the gateway town to Torres del Paine. Buses run several times a day; book online the week before.',
    [
      { guide: 'punta-arenas', headings: ['How to get there', '5. Historic downtown and Plaza Muñoz Gamero'] },
      { guide: 'puerto-natales', headings: ['How to get there'] },
    ]),
  D('Puerto Natales: gear up + Milodon Cave',
    'Use today to buy your dated park entrance online, confirm tours, and stretch your legs at the Milodon Cave. Evening: waterfront sunset and a calafate sour.',
    [
      { guide: 'puerto-natales', headings: ['2. Milodón Cave (half a day)', '5. The town itself', 'Essential logistics'] },
    ]),
  D('Torres del Paine full-day tour (no car needed)',
    'The classic road loop: Lake Grey, Pehoe, Salto Grande and the horns — all from a guided van picked up at your hostel. This is the day you photograph the postcard without hiking 20 km.',
    [
      { guide: 'torres-del-paine', headings: ['1. Full-day tour (the accessible format)'] },
    ]),
  D('Base Torres day hike',
    'The star trek, done as a long day hike using the early shuttle from Puerto Natales. Roughly 8-10 hours round trip; start before dawn and carry layers for all four seasons.',
    [
      { guide: 'torres-del-paine', headings: ['2. Base Torres day hike (the star trek)', 'Essential logistics'] },
    ]),
  D('Buffer day: Ultima Esperanza boat or early return',
    'Legs destroyed? Take the boat on Ultima Esperanza Sound or visit Puerto Bories. Otherwise bus back to Punta Arenas for penguins at Magdalena Island before your flight.',
    [
      { guide: 'puerto-natales', headings: ['4. Boat trips on Última Esperanza Sound', '3. Puerto Bories (1-2 hours)'] },
      { guide: 'punta-arenas', headings: ['1. Magdalena Island (penguins, half a day)'] },
    ]),
];

const AUSTRAL_DAYS = [
  D('Puerto Montt to Hornopiren',
    'Pick up the rental in Puerto Montt (tell the agency you are driving the Carretera Austral), stock up, and drive the easy first 110 km to Hornopiren. Sleep there: the ferry leaves early.',
    [
      { guide: 'carretera-austral', headings: ['1. What the Carretera Austral is', 'How to get there and when to go'] },
    ]),
  D('Ferry to Caleta Gonzalo + Pumalin Park',
    'The two-sailing crossing to Caleta Gonzalo drops you inside Pumalin Park: ancient alerce forest, short waterfall trails and views of Chaiten volcano. Sleep in Chaiten.',
    [
      { guide: 'carretera-austral', headings: ['2. Puerto Montt–Hornopirén and the crossing to Pumalín', 'Ferries: which ones are unavoidable'] },
    ]),
  D('Futaleufu detour',
    'Side trip to one of the best rafting rivers on the planet. Not a rafter? The turquoise valley, horseback rides and fly fishing justify the detour anyway.',
    [
      { guide: 'carretera-austral', headings: ['3. Futaleufú: world-class rafting'] },
    ]),
  D('Long drive south to Coyhaique',
    'Transit day through La Junta and Puyuhuapi (thermal springs if you have time). Coyhaique is the only real city on the route: refuel everything — tank, pantry, cash.',
    [
      { guide: 'carretera-austral', headings: ['How to get there and when to go'] },
    ]),
  D('Cerro Castillo',
    'Drive the pass to Villa Cerro Castillo. If you are fit, the day hike to the glacial lagoon under the rock spires is the best single-day trek of the route.',
    [
      { guide: 'carretera-austral', headings: ['5. Cerro Castillo and Villa O\'Higgins: the end of the road'] },
    ]),
  D('Puerto Rio Tranquilo: Marble Caves',
    'Morning boat or kayak to the Capillas de Marmol on Lake General Carrera — go early for the best light on the blue marble veins.',
    [
      { guide: 'carretera-austral', headings: ['4. Puerto Río Tranquilo and the Marble Caves'] },
    ]),
  D('Return via Balmaceda (or push to Cochrane)',
    'Loop back north to Balmaceda airport (near Coyhaique) to drop the car and fly out — or add days and push to Cochrane and Villa O\'Higgins, the true end of the road.',
    [
      { guide: 'carretera-austral', headings: ['Ferries: which ones are unavoidable'] },
    ]),
];

const LAKES_DAYS = [
  D('Puerto Varas: lakefront base camp',
    'Settle into Puerto Varas, walk the lakefront with Osorno volcano across the water, and book tomorrow\'s tour. German-colonial architecture, craft beer, kuchen.',
    [
      { guide: 'puerto-varas', headings: ['1. The lakefront and downtown', 'Practical info'] },
    ]),
  D('Osorno Volcano + Saltos del Petrohue',
    'The classic combo day: the emerald rapids of Petrohue and the ski-center viewpoints halfway up Osorno volcano. Doable by tour or rental car.',
    [
      { guide: 'puerto-varas', headings: ['2. Osorno Volcano'] },
      { guide: 'saltos-del-petrohue', headings: ['The essentials', 'Local tips'] },
    ]),
  D('Frutillar: kuchen + Teatro del Lago',
    'Half day in Frutillar: the lakeside theater, the German Colonial Museum and the kuchen trail. Back in Puerto Varas for sunset.',
    [
      { guide: 'frutillar', headings: ['1. Teatro del Lago', '4. The kuchen trail', 'Suggested itinerary (half day)'] },
    ]),
  D('Into Chiloe: Ancud and the penguins',
    'Cross the Chacao channel to Chiloe island. Ancud first, then the Punihuil penguin colonies (the only place where Humboldt and Magellanic penguins nest together).',
    [
      { guide: 'chiloe', headings: ['How to get there and when to go'] },
    ]),
  D('Castro and the World Heritage churches',
    'Stilt houses (palafitos), the yellow-and-purple San Francisco church, curanto for lunch, and the wooden churches circuit via Dalcahue.',
    [
      { guide: 'chiloe', headings: ['1. Castro: stilt houses and the San Francisco church', '2. The churches of Chiloé, a World Heritage Site', '3. Curanto, the taste of the island'] },
    ]),
];

const ATACAMA_DAYS = [
  D('Arrive in San Pedro, acclimatize',
    'Fly to Calama, transfer 1h to San Pedro (2.400 m). Take it easy today — altitude is real. Walk the adobe streets, book tours for the week, sunset at the edge of town.',
    [
      { guide: 'san-pedro-de-atacama', headings: ['Practical info'] },
    ]),
  D('Valle de la Luna at sunset',
    'Short morning (archaeology museum or Pukara de Quitor), then the Moon Valley tour for dunes, salt caves and THE sunset of northern Chile.',
    [
      { guide: 'san-pedro-de-atacama', headings: ['2. Valle de la Luna (Moon Valley)'] },
    ]),
  D('El Tatio geysers at dawn',
    'The 4 AM wake-up call that is worth it: the world\'s third-largest geyser field, at its best at sunrise at 4.300 m. Afternoon: nap, then thermal soak.',
    [
      { guide: 'san-pedro-de-atacama', headings: ['1. El Tatio Geysers'] },
    ]),
  D('Altiplano lagoons + Piedras Rojas',
    'The long, spectacular day south: flamingos on the salt flat, the altiplanic lagoons Miscanti and Miniques, and the red rocks against turquoise water.',
    [
      { guide: 'san-pedro-de-atacama', headings: ['3. Altiplano lagoons and Piedras Rojas'] },
    ]),
  D('Float in Cejar + stargazing finale',
    'Morning float in the salt lagoons (Cejar or Baltinache), afternoon free, and close the trip with an astronomy tour under the clearest sky on Earth.',
    [
      { guide: 'san-pedro-de-atacama', headings: ['5. Cejar or Baltinache lagoons', '4. Astronomy tour'] },
    ]),
];

const SANTIAGO_CAJON_ROUTE = [
  R(1, 'Santiago (downtown)', -33.4372, -70.6506),
  R(2, 'Santiago (Bellavista / San Cristóbal)', -33.4258, -70.6329),
  R(3, 'Cajón del Maipo — El Yeso', -33.68, -70.1),
  R(4, 'Cajón del Maipo — San Alfonso', -33.75, -70.35),
];

const VALPO_WINE_ROUTE = [
  R(1, 'Valparaíso', -33.0472, -71.6127),
  R(2, 'Viña del Mar', -33.0245, -71.5518),
  R(3, 'Santa Cruz (Colchagua Valley)', -34.6389, -71.3647),
  R(4, 'Pichilemu', -34.3833, -72.0),
];

const PUCON_ROUTE = [
  R(1, 'Pucón (town + volcano views)', -39.2823, -71.9758),
  R(2, 'Hot springs near Pucón', -39.38, -71.75),
  R(3, 'Río Trancura', -39.3, -71.7),
  R(4, 'Huerquehue National Park', -39.15, -71.68),
];

const ELQUI_ROUTE = [
  R(1, 'La Serena', -29.9027, -71.2519),
  R(2, 'Coquimbo / Punta de Choros', -29.9533, -71.3436),
  R(3, 'Vicuña (Elqui Valley)', -30.0319, -70.7081),
  R(4, 'Pisco Elqui / Cochiguaz', -30.1275, -70.4922),
];

const RAPA_NUI_ROUTE = [
  R(1, 'Hanga Roa', -27.1547, -109.43),
  R(2, 'Ahu Tongariki / Rano Raraku', -27.1259, -109.2769),
  R(3, 'Orongo', -27.1836, -109.4442),
  R(4, 'Anakena Beach', -27.0722, -109.3253),
];

// ---------- Dias — kits nuevos 2026-07-21 (expansion de catalogo) ----------

const SANTIAGO_CAJON_DAYS = [
  D('Historic downtown Santiago',
    'Start in the Plaza de Armas and work outward: the Cathedral, the Palacio de La Moneda, Cerro Santa Lucía\'s hidden gardens. Half a day is enough if you keep moving — save the rest for jet lag or a pisco sour.',
    [{ guide: 'santiago', headings: ['1. Historic downtown (half a day)'] }]),
  D('Bellavista, Lastarria & San Cristóbal at sunset',
    'Wander Bellavista\'s murals and Lastarria\'s cafes in the afternoon, then ride the funicular or cable car up San Cristóbal hill for the best sunset view of the Andes skyline in the city.',
    [{ guide: 'santiago', headings: ['2. Bellavista, Lastarria and Providencia (afternoon-evening)', '3. San Cristóbal hill (sunset)'] }]),
  D('Into the Andes: El Yeso Reservoir & Baños Morales',
    'An hour and a half from Santiago the city disappears: turquoise water at El Yeso Reservoir, then the hot pools and glacier views of Baños Morales and El Morado. Plan for a 4x4-friendly ride on the last stretch.',
    [{ guide: 'cajon-del-maipo', headings: ['1. What Cajón del Maipo is', '2. El Yeso Reservoir, the turquoise pool', '3. Baños Morales and El Morado Natural Monument'] }]),
  D('Cascada de las Ánimas & back to the city',
    'Close the loop lower in the canyon: the waterfall trail at Cascada de las Ánimas, a stop in San José de Maipo\'s plaza, then back to Santiago in time for a late dinner.',
    [{ guide: 'cajon-del-maipo', headings: ['4. Cascada de las Ánimas and San Alfonso', '5. San José de Maipo and the rest of the canyon'] }]),
];

const VALPO_WINE_DAYS = [
  D('Valparaíso: hills and funiculars',
    'Get lost on purpose in Cerro Alegre and Cerro Concepción, then ride one of the century-old funiculars still climbing the hills of this UNESCO port city.',
    [{ guide: 'valparaiso', headings: ['1. What Valparaíso is', '2. Cerro Alegre and Cerro Concepción', '3. The funiculars, heritage in motion'] }]),
  D('La Sebastiana, street art & Viña del Mar',
    'Tour Pablo Neruda\'s hillside house, La Sebastiana, then follow the open-air murals of Cerro Bellavista before crossing into neighboring Viña del Mar for the beach promenade at sunset.',
    [{ guide: 'valparaiso', headings: ['4. La Sebastiana and the street art of Cerro Bellavista', '5. Plaza Sotomayor, the lower town and Viña del Mar'] }]),
  D('South to Santa Cruz: a day of wine',
    'Drive 2.5-3 hours south into the Colchagua Valley, Chile\'s most awarded wine route. Taste Carmenere in Santa Cruz, then spend the afternoon at the Colchagua Museum — dinosaur fossils to the Fenix rescue capsule.',
    [{ guide: 'colchagua-pichilemu', headings: ['1. The Colchagua Valley: Chile\'s most awarded wine route', '2. Santa Cruz: wineries, tours and tastings', '3. Colchagua Museum: Chile\'s largest private museum'] }]),
  D('Pichilemu: Chile\'s surf capital',
    'Close the trip on the Pacific: Punta de Lobos, one of South America\'s most respected waves, and the easygoing surf-town pace of Pichilemu — just over an hour from Santa Cruz.',
    [{ guide: 'colchagua-pichilemu', headings: ['4. Pichilemu: Chile\'s surf capital and Punta de Lobos'] }]),
];

const PUCON_DAYS = [
  D('Arrival & Villarrica volcano views',
    'Settle into Pucón with the smoking cone of Villarrica volcano watching over the town. If conditions allow, book the guided summit trek for later in the trip — it fills up and depends on the weather.',
    [{ guide: 'pucon-villarrica', headings: ['1. Villarrica volcano'] }]),
  D('Hot springs day',
    'Recovery day: soak in one of the thermal springs scattered around the volcano\'s flanks. Pick a rustic pool or a full resort circuit — both are within a short drive of town.',
    [{ guide: 'pucon-villarrica', headings: ['2. Hot springs: the volcano\'s other face'] }]),
  D('Whitewater rafting & black-sand beaches',
    'Morning rafting or hydrospeed on the Trancura river, afternoon cooling off on Lake Villarrica\'s black volcanic-sand beaches back in town.',
    [{ guide: 'pucon-villarrica', headings: ['3. Adventure sports on the Trancura river', '4. Lake Villarrica and its black-sand beaches'] }]),
  D('Huerquehue National Park & Ojos del Caburgua',
    'Hike among araucaria trees and alpine lakes in Huerquehue National Park, then cool off at the turquoise sinkhole pools of Ojos del Caburgua on the way back.',
    [{ guide: 'pucon-villarrica', headings: ['5. Huerquehue National Park and Ojos del Caburgua'] }]),
];

const ELQUI_DAYS = [
  D('La Serena: lighthouse & neocolonial downtown',
    'Walk the Monumental Lighthouse boardwalk and the neocolonial arcades of downtown La Serena, one of Chile\'s oldest cities — a gentle first day before the desert and the mountains.',
    [{ guide: 'la-serena-coquimbo', headings: ['1. La Serena: beaches, the Monumental Lighthouse, and the neocolonial downtown'] }]),
  D('Coquimbo & Punta de Choros penguins',
    'Cross into Coquimbo for the giant Cruz del Tercer Milenio and Barrio Inglés, then head north to Punta de Choros for a boat trip through the Humboldt Penguin National Reserve — book the dated tour ahead.',
    [{ guide: 'la-serena-coquimbo', headings: ['2. Coquimbo: Cruz del Tercer Milenio, Barrio Inglés, and Islote Pájaros Niños', '3. Punta de Choros and the Humboldt Penguin National Reserve'] }]),
  D('Into the Elqui Valley: Vicuña & the pisco route',
    'Drive an hour inland into the Elqui Valley. Vicuña\'s Gabriela Mistral museum in the morning, then an afternoon on the pisco route tasting at the distilleries around Pisco Elqui.',
    [{ guide: 'valle-del-elqui', headings: ['1. What the Elqui Valley is', '4. Vicuña and the Gabriela Mistral museum', '3. The pisco route: Pisco Elqui and its distilleries'] }]),
  D('Stargazing night: the clearest sky in the world',
    'Close the trip the way the valley is famous for: a night tour at a tourist observatory, from Mamalluca to Cerro Tololo, under skies with close to zero light pollution.',
    [
      { guide: 'valle-del-elqui', headings: ['2. Observatories: from Mamalluca to Cerro Tololo'] },
      { guide: 'la-serena-coquimbo', headings: ['4. Tourist observatories: Mamalluca, Collowara, and Cerro Mayu'] },
    ]),
];

const RAPA_NUI_DAYS = [
  D('Fly in and settle into Hanga Roa',
    'The only way in is a 5-hour flight from Santiago. Land, check into Hanga Roa, buy your dated national park ticket if you have not already, and ease into island time.',
    [{ guide: 'rapa-nui', headings: ['How to get there', 'Essential logistics'] }]),
  D('Ahu Tongariki at sunrise & the Rano Raraku quarry',
    'The fifteen restored moai of Ahu Tongariki at first light, then the volcanic quarry at Rano Raraku where nearly 400 moai were carved and abandoned mid-production.',
    [{ guide: 'rapa-nui', headings: ['1. Ahu Tongariki: the fifteen restored moai', '2. Rano Raraku: the quarry where the moai were born'] }]),
  D('Orongo: the birdman ceremonial village',
    'Perched on the rim of the Rano Kau crater, Orongo\'s stone houses were the stage for the Tangata Manu birdman competition — one of the most striking sites on the island.',
    [{ guide: 'rapa-nui', headings: ['3. Orongo: the birdman ceremonial village'] }]),
  D('Anakena: the white-sand beach',
    'Finish where the first Rapa Nui settlers are believed to have landed: the palm-lined white sand of Anakena, with moai wearing their red pukao topknots a few steps from the water.',
    [{ guide: 'rapa-nui', headings: ['4. Anakena: the white-sand beach and moai with pukao'] }]),
];

// ---------- Dias — kit gen-2 ES 2026-08-01 (wedge GSC: "termas de chillán") ----------

const TERMAS_SUR_ROUTE = [
  R(1, 'Valle Las Trancas', -36.9, -71.48),
  R(2, 'Termas de Chillán', -36.905, -71.41),
  R(3, 'Reserva Nacional Ñuble', -36.96, -71.45),
  R(4, 'Chillán (ciudad)', -36.607, -72.103),
];

// Todos los pulls referencian headings EXACTOS de termas-de-chillan.html (ES, raiz).
const TERMAS_SUR_DAYS = [
  D('Llegada a Chillán y subida al Valle Las Trancas',
    'Desde Santiago son unos 400 km por la Ruta 5 Sur hasta Chillán (4,5-5 horas en auto, bus o vuelo); desde la ciudad se suben los 80 km finales a Las Trancas, el poblado con cabañas, restaurantes y arriendo de equipos que funciona como base. Hoy toca instalarse y dejar las reservas listas.',
    [{ guide: 'termas-de-chillan', headings: ['Cómo llegar y cuándo ir', '3. Valle Las Trancas: la puerta de entrada'] }]),
  D('Termas de Chillán: día completo de aguas termales',
    'El día central del viaje: piscinas termales exteriores con vista a la montaña, spa y tratamientos con barro volcánico, alimentadas por el mismo complejo volcánico de los Nevados de Chillán. Sin alojarse en el hotel se puede comprar entrada de día — en temporada alta hay que reservar con anticipación porque el aforo es limitado.',
    [{ guide: 'termas-de-chillan', headings: ['1. Termas de Chillán: aguas termales de origen volcánico'] }]),
  D('Nieve en invierno o trekking en la Reserva Ñuble',
    'Según la temporada: esquí en Nevados de Chillán (junio a octubre, con la pista El Otto de unos 13 km bajando entre araucarias) o senderismo en la Reserva Nacional Ñuble, mejor entre noviembre y abril — el sendero corto Los Pretiles para toda la familia, o la caminata larga hacia la Laguna Fea.',
    [{ guide: 'termas-de-chillan', headings: ['2. Nevados de Chillán: el centro de esquí más grande de Chile', '4. Senderismo en la Reserva Nacional Ñuble y el volcán Chillán'] }]),
  D('Chillán: mercado, longaniza y murales antes de volver',
    'Baja a la ciudad para el cierre gastronómico y cultural: el histórico mercado techado con la longaniza con Denominación de Origen y los murales de Siqueiros y Guerrero en la Escuela México. Desde ahí, bus o vuelo de regreso.',
    [{ guide: 'termas-de-chillan', headings: ['5. Chillán: longaniza, mercado y los murales de la Escuela México'] }]),
];

// ---------- Dias — kits gen-2 ES 2026-08-01 (tanda 2: radal + gemelo ES santiago-cajon) ----------

const RADAL_ROUTE = [
  R(1, 'Curicó', -34.983, -71.239),
  R(2, 'P.N. Radal Siete Tazas', -35.457, -71.032),
  R(3, 'Molina / Lontué (Ruta del Vino)', -35.114, -71.282),
];

// Todos los pulls referencian headings EXACTOS de radal-siete-tazas-curico.html (ES, raiz).
const RADAL_DAYS = [
  D('Llegada a Curicó, la puerta de entrada del Maule',
    'Desde Santiago son unos 200 km por la Ruta 5 Sur hasta Curicó (2,5 horas en auto, o bus desde el Terminal Alameda). Hoy toca instalarse, recorrer la Plaza de Armas de palmeras con su kiosco de fierro y dejar compradas las entradas del parque: se venden solo online en pasesparques.cl, sin venta de tickets en el lugar.',
    [{ guide: 'radal-siete-tazas-curico', headings: ['3. Curicó: la puerta de entrada con historia propia', 'Cómo llegar y cuándo ir'] }]),
  D('Radal Siete Tazas: pozones del río Claro, Salto La Leona y Velo de la Novia',
    'El día central del viaje. Desde Curicó o Molina son unos 65 km por la ruta L-27, en su mayor parte pavimentada, hasta los pozones turquesa del río Claro; de ahí el sendero corto al Salto La Leona y, ya en el sector Parque Inglés, el Velo de la Novia. Entre diciembre y marzo el río está más bajo y templado para meterse a los pozones.',
    [{ guide: 'radal-siete-tazas-curico', headings: ['1. Parque Nacional Radal Siete Tazas: los pozones del río Claro', '2. Salto la Leona y Velo de la Novia: las cascadas del parque'] }]),
  D('Ruta del Vino de Curicó y cierre termal en Panimávida',
    'El cierre entre viñas y aguas termales: cata en el valle de Lontué —Viña San Pedro, Valdivieso o Miguel Torres, mejor con reserva— y, para bajar el cuerpo después del trekking, las Termas de Panimávida o Quinamávida, unos 85 km al sur, cerca de Linares.',
    [{ guide: 'radal-siete-tazas-curico', headings: ['4. Ruta del Vino Valles de Curicó: Lontué, Molina y Sagrada Familia', '5. Termas de Panimávida y Quinamávida: el cierre relajado de la ruta'] }]),
];

// Gemelo ES de SANTIAGO_CAJON_DAYS (mismo molde, copy ES). Pulls a los headings
// EXACTOS de santiago.html y cajon-del-maipo.html (ES, raiz) — distintos de los EN.
// La ruta se reusa tal cual: SANTIAGO_CAJON_ROUTE (coords, no texto).
const SANTIAGO_CAJON_DAYS_ES = [
  D('Centro histórico de Santiago',
    'Parte en la Plaza de Armas y despliega desde ahí: la Catedral, el Palacio de La Moneda, los jardines del cerro Santa Lucía. Medio día alcanza si te mantienes en movimiento — guarda el resto para el jet lag o un pisco sour.',
    [{ guide: 'santiago', headings: ['1. Centro histórico (medio día)'] }]),
  D('Bellavista, Lastarria y atardecer en el cerro San Cristóbal',
    'Recorre los murales de Bellavista y los cafés de Lastarria en la tarde, y luego sube en funicular o teleférico al cerro San Cristóbal: la mejor vista del atardecer sobre la ciudad con la cordillera de fondo.',
    [{ guide: 'santiago', headings: ['2. Bellavista, Lastarria y Providencia (tarde-noche)', '3. Cerro San Cristóbal (atardecer)'] }]),
  D('A la cordillera: Embalse El Yeso y Baños Morales',
    'A una hora y media de Santiago la ciudad desaparece: agua turquesa en el Embalse El Yeso y, siguiendo el Camino al Volcán, las piscinas termales de Baños Morales y el sendero del Monumento Natural El Morado hacia el Glaciar San Francisco. El tramo final es de ripio: conviene un vehículo con buena altura.',
    [{ guide: 'cajon-del-maipo', headings: ['1. Qué es el Cajón del Maipo', '2. Embalse El Yeso, el reservorio turquesa', '3. Baños Morales y Monumento Natural El Morado'] }]),
  D('Cascada de las Ánimas y regreso a la ciudad',
    'Cierra el circuito más abajo del cajón: la caminata liviana a la cascada en la reserva de Cascada de las Ánimas (o canopy y rafting si queda energía), una parada en la plaza de San José de Maipo, y de vuelta a Santiago a tiempo para una cena tardía.',
    [{ guide: 'cajon-del-maipo', headings: ['4. Cascada de las Ánimas y San Alfonso', '5. San José de Maipo y el resto del cajón'] }]),
];

// ---------- Dias — kits gen-2 ES 2026-08-01 (tanda 3: gemelos ES de atacama-5d y tdp-no-car) ----------

// Gemelo ES de ATACAMA_DAYS (mismo molde/recorrido, copy ES). Pulls a los headings
// EXACTOS de san-pedro-de-atacama.html (ES, raiz) — distintos de los EN.
// Ruta propia (mismas coords que ATACAMA_ROUTE, nombres ES): la compartida no se
// toca para que el PDF EN regenere identico.
const ATACAMA_ROUTE_ES = [
  R(1, 'San Pedro de Atacama', -22.91, -68.2),
  R(2, 'Valle de la Luna', -22.92, -68.3),
  R(3, 'Geysers del Tatio', -22.33, -68.01),
  R(4, 'Piedras Rojas', -23.75, -67.78),
  R(5, 'Laguna Cejar', -22.97, -68.22),
];

const ATACAMA_DAYS_ES = [
  D('Llegada a San Pedro y aclimatación',
    'Vuelo a Calama (CJC) y transfer de 1 h 20 min al pueblo. Hoy toca tomárselo con calma — la altura es real y las excursiones se ordenan de menor a mayor altitud. Recorre las calles de adobe, deja reservadas las excursiones de la semana y camina al borde del pueblo al atardecer.',
    [{ guide: 'san-pedro-de-atacama', headings: ['Datos prácticos'] }]),
  D('Valle de la Luna al atardecer',
    'Mañana libre en el pueblo y en la tarde el Valle de la Luna, a 15 minutos: dunas, crestas de sal y anfiteatros de piedra que al atardecer se tiñen de rojo. Es la excursión de menor exigencia del viaje — está casi a la altura del pueblo.',
    [{ guide: 'san-pedro-de-atacama', headings: ['2. Valle de la Luna'] }]),
  D('Geysers del Tatio al amanecer',
    'La salida madrugadora que vale la pena: el campo geotérmico más alto del mundo (4.320 m), a las 6 de la mañana y bajo cero — las fumarolas solo se ven con el frío del amanecer. Nunca se hace el primer día: es la excursión que más exige aclimatación. Tarde de descanso.',
    [{ guide: 'san-pedro-de-atacama', headings: ['1. Geysers del Tatio'] }]),
  D('Lagunas altiplánicas y Piedras Rojas',
    'El día largo y más escénico del viaje: flamencos en la laguna Chaxa del salar de Atacama, las lagunas Miscanti y Miñiques (4.100 m) espejando volcanes, y Piedras Rojas como postal final. Día completo.',
    [{ guide: 'san-pedro-de-atacama', headings: ['3. Lagunas altiplánicas y Piedras Rojas'] }]),
  D('Flotar en Cejar y cierre astronómico',
    'Mañana de flotación en agua más salada que el mar Muerto (Cejar) o recorriendo las siete lagunas escondidas de Baltinache — medio día cualquiera de las dos. Tarde libre y cierre del viaje con un tour astronómico bajo el cielo más limpio del planeta: evita las noches de luna llena.',
    [{ guide: 'san-pedro-de-atacama', headings: ['5. Lagunas Cejar o Baltinache', '4. Tour astronómico'] }]),
];

// Gemelo ES de TDP_DAYS (mismo molde "sin auto", copy ES). Pulls a los headings
// EXACTOS de torres-del-paine.html, puerto-natales.html y punta-arenas.html (ES, raiz).
// Ruta propia (mismas coords que TDP_ROUTE, nombres ES + mismo nudge del dia 5).
const TDP_ROUTE_ES = [
  R(1, 'Punta Arenas', -53.163, -70.917),
  R(2, 'Puerto Natales', -51.729, -72.498),
  R(3, 'Torres del Paine (circuito vehicular)', -51.06, -73.0),
  R(4, 'Base Torres (inicio del sendero)', -50.95, -72.86),
  R(5, 'Punta Arenas (regreso)', -53.35, -70.6),
];

const TDP_DAYS_ES = [
  D('Llegada a Punta Arenas y bus a Puerto Natales',
    'Vuela a Punta Arenas (PUQ), el aeropuerto más conectado de la Patagonia chilena (~3,5 h desde Santiago), almuerza en el centro histórico y toma el bus de ~3 h por la Ruta 9 a Puerto Natales — la base de operaciones del parque, con varias salidas diarias.',
    [
      { guide: 'punta-arenas', headings: ['Cómo llegar', '5. Centro histórico y Plaza Muñoz Gamero'] },
      { guide: 'puerto-natales', headings: ['Cómo llegar'] },
    ]),
  D('Puerto Natales: preparativos y Cueva del Milodón',
    'Día de logística: compra online la entrada al parque con fecha (obligatoria), confirma tours y compra las últimas provisiones. En el día, la Cueva del Milodón a 25 km — caverna gigante con la réplica del animal a tamaño real. Tarde de costanera y cordero patagónico.',
    [
      { guide: 'puerto-natales', headings: ['2. Cueva del Milodón (medio día)', '5. El pueblo mismo', 'Logística esencial'] },
    ]),
  D('Torres del Paine: tour de día completo (sin auto)',
    'El circuito vehicular clásico en van con guía desde Puerto Natales (~1,5 h de viaje): miradores del lago Grey y sus témpanos, Salto Grande, lago Pehoé y los cuernos del Paine, con suerte guanacos y cóndores todo el día. La postal del parque sin caminar 20 km.',
    [
      { guide: 'torres-del-paine', headings: ['1. Tour de día completo (el formato accesible)'] },
    ]),
  D('Trekking a Base Torres en el día',
    'La caminata estrella: ~19 km ida y vuelta a la laguna al pie de las torres, 8–10 horas con un tramo final de morrena empinada. Exigente pero no técnico: por libre (transporte a Laguna Amarga + shuttle) o con tour guiado con transporte incluido desde Puerto Natales.',
    [
      { guide: 'torres-del-paine', headings: ['2. Base Torres en el día (el trekking estrella)', 'Logística esencial'] },
    ]),
  D('Día de margen: navegación por Última Esperanza o regreso a Punta Arenas',
    '¿Piernas cansadas? Navega el Seno Última Esperanza hasta los glaciares Balmaceda y Serrano, o camina a Puerto Bories desde la costanera. Si no, bus de vuelta a Punta Arenas para los pingüinos de Isla Magdalena (noviembre-marzo) antes del vuelo.',
    [
      { guide: 'puerto-natales', headings: ['4. Navegación por el Seno Última Esperanza', '3. Puerto Bories (1-2 horas)'] },
      { guide: 'punta-arenas', headings: ['1. Isla Magdalena (pingüineras, medio día)'] },
    ]),
];

// ---------- Dias — kits gen-3 ES 2026-08-01 (ronda 4) ----------
// Integrados desde los fragmentos/config que dejo cada constructor:
// kits.config.chiloe-5d-es.mjs, build/pucon-4d-es/generate.mjs,
// kit-valparaiso-vina-3d-es.config.mjs, build-austral-norte.mjs,
// build/valle-elqui-4d-es/generate.mjs y kits.iquique-altiplano.config.mjs.
// Todos los pulls referencian headings EXACTOS de las guias ES raiz
// (verificados por cada constructor el 2026-08-01).

const CHILOE_ROUTE_ES = [
  R(1, 'Ancud (cruce del Chacao)', -41.87, -73.83),
  R(2, 'Castro', -42.48, -73.76),
  R(3, 'Achao (isla Quinchao)', -42.47, -73.49),
  R(4, 'Dalcahue', -42.38, -73.65),
  R(5, 'Chonchi', -42.62, -73.77),
];

const CHILOE_DAYS_ES = [
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

const PUCON_ROUTE_ES = [
  R(1, 'Pucón (pueblo + vistas al volcán)', -39.2823, -71.9758),
  R(2, 'Termas cerca de Pucón', -39.38, -71.75),
  R(3, 'Río Trancura', -39.3, -71.7),
  R(4, 'Parque Nacional Huerquehue', -39.15, -71.68),
];

const PUCON_DAYS_ES = [
  D('Llegada a Pucón y la postal del volcán Villarrica',
    'Instalación en Pucón con el cono humeante del volcán Villarrica vigilando el pueblo. Si las condiciones lo permiten, deja reservado el ascenso guiado a la cumbre para los días siguientes — se agota y depende del clima y de la alerta volcánica de SERNAGEOMIN.',
    [{ guide: 'pucon-villarrica', headings: ['Cómo llegar y cuándo ir', '1. El volcán Villarrica'] }]),
  D('Día de termas: la otra cara del volcán',
    'Día de recuperación: piscinas termales alimentadas por el mismo calor del volcán. Elige una poza rústica junto al río (Los Pozones, abiertas de noche) o un complejo con más infraestructura — y si alcanza el día, las Geométricas hacia Coñaripe son la postal termal más fotografiada de Chile.',
    [{ guide: 'pucon-villarrica', headings: ['2. Termas: la otra cara del volcán'] }]),
  D('Rafting en el Trancura y playas de arena negra',
    'Mañana de rafting o hydrospeed en el río Trancura —Bajo Trancura clase III para principiantes y familias, Alto Trancura clase IV para quienes ya remaron— y tarde de descanso en las playas de arena volcánica del lago Villarrica, con la costanera y el volcán de fondo al atardecer.',
    [{ guide: 'pucon-villarrica', headings: ['3. Deportes de aventura en el río Trancura', '4. Lago Villarrica y sus playas de arena negra'] }]),
  D('Parque Nacional Huerquehue y Ojos del Caburgua',
    'Trekking entre araucarias milenarias y lagunas alpinas en el Parque Nacional Huerquehue —el sendero de los Lagos, 4-5 horas ida y vuelta— y cierre en los pozones turquesa de los Ojos del Caburgua, a la entrada del mismo camino de regreso a Pucón.',
    [{ guide: 'pucon-villarrica', headings: ['5. Parque Nacional Huerquehue y Ojos del Caburgua'] }]),
];

const VALPO_VINA_ROUTE = [
  R(1, 'Valparaíso (Cerro Alegre)', -33.0427, -71.6245),
  R(2, 'Cerro Bellavista (La Sebastiana)', -33.0562, -71.6206),
  R(3, 'El plan + Viña del Mar', -33.0245, -71.5518),
];

// No existe guia propia de Viña del Mar: toda la cobertura ES de Viña del
// repo vive en el heading 5 de valparaiso.html.
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

const AUSTRAL_NORTE_ROUTE = [
  R(1, 'Puerto Montt', -41.47, -72.94),
  R(2, 'Hornopirén', -41.94, -72.43),
  R(3, 'Chaitén / Pumalín', -42.92, -72.71),
  R(4, 'Futaleufú', -43.19, -71.87),
  R(5, 'Coyhaique', -45.57, -72.07),
  R(6, 'Villa Cerro Castillo', -46.12, -72.16),
  R(7, 'Puerto Río Tranquilo', -46.62, -72.68),
];

const AUSTRAL_NORTE_DAYS = [
  D('Llegada a Puerto Montt: auto, provisiones y Angelmó',
    'Aterriza en El Tepual (PMC), retira el auto arrendado —avisa con anticipación que harás la Carretera Austral, porque varias agencias restringen o cobran extra por ripio y ferry— y haz la compra grande de provisiones: al sur todo es más caro y hay menos oferta. Cierra la tarde en el mercado de Angelmó, el muelle desde donde zarpan los ferris de largo recorrido a Chaitén.',
    [
      { guide: 'puerto-montt', headings: ['4. El aeropuerto El Tepual, puerta de entrada al sur', '1. Angelmó', '5. Rumbo a Chiloé o a la Carretera Austral'] },
    ]),
  D('Puerto Montt a Hornopirén: el inicio de la Ruta 7',
    'Los primeros 110 km son los más fáciles de toda la ruta, mayormente pavimentados. Es el día para entrar en ritmo: llena el estanque antes de salir de Puerto Montt y llega con luz a Hornopirén, porque el ferry a Caleta Gonzalo sale temprano y con cupo limitado de vehículos.',
    [
      { guide: 'carretera-austral', headings: ['1. Qué es la Carretera Austral', '2. Puerto Montt–Hornopirén y el cruce a Pumalín'] },
    ]),
  D('Ferry a Caleta Gonzalo y Parque Pumalín',
    'El cruce Hornopirén–Leptepu–Fiordo Largo–Caleta Gonzalo combina dos navegaciones con un puente terrestre corto y te deja dentro del Parque Pumalín: bosque valdiviano de alerces milenarios, senderos cortos a saltos de agua y miradores del volcán Chaitén. Noche en Chaitén: primera parada seria de bencina al sur de Puerto Montt.',
    [
      { guide: 'carretera-austral', headings: ['Ferries: cuáles son obligatorios'] },
    ]),
  D('Desvío a Futaleufú: el río turquesa',
    'Desde Villa Santa Lucía son unos 75 km de desvío hasta uno de los ríos con mejor rafting del mundo: aguas turquesa de deshielo glaciar y rápidos de clase III a V. ¿No haces rafting? El valle justifica igual el desvío, con cabalgatas y pesca con mosca como alternativas tranquilas.',
    [
      { guide: 'carretera-austral', headings: ['3. Futaleufú: rafting de clase mundial'] },
    ]),
  D('Día largo al sur: La Junta y Puyuhuapi hasta Coyhaique',
    'El día de más conducción del viaje, por La Junta y Puyuhuapi (termas si te sobra tiempo). Coyhaique es la única ciudad real de la ruta: reabastece TODO —estanque lleno, despensa y efectivo— porque al sur de aquí las distancias entre bencineras se estiran y la señal de celular desaparece por horas.',
    [
      { guide: 'carretera-austral', headings: ['Cómo llegar y cuándo ir'] },
    ]),
  D('Cerro Castillo: las agujas de roca y su laguna glaciar',
    'Antes de seguir al sur, el Parque Nacional Cerro Castillo guarda uno de los treks más espectaculares de la Patagonia: la laguna glaciar bajo las agujas de roca que dan nombre al cerro. Base en Villa Cerro Castillo, a orillas de la Ruta 7.',
    [
      { guide: 'carretera-austral', headings: ['5. Cerro Castillo y Villa O\'Higgins: el fin de la ruta'] },
    ]),
  D('Capillas de Mármol y cierre en Balmaceda',
    'Mañana en bote o kayak a las Capillas de Mármol sobre el lago General Carrera —sal temprano, la luz de la mañana es la mejor para las vetas azules— y después regreso al norte por la misma Ruta 7 hasta el aeropuerto de Balmaceda, junto a Coyhaique, para devolver el auto y volar.',
    [
      { guide: 'carretera-austral', headings: ['4. Puerto Río Tranquilo y las Capillas de Mármol'] },
    ]),
];

const ELQUI_ROUTE_ES = [
  R(1, 'La Serena', -29.9027, -71.2519),
  R(2, 'Coquimbo / Punta de Choros', -29.9533, -71.3436),
  R(3, 'Vicuña (Valle del Elqui)', -30.0319, -70.7081),
  R(4, 'Pisco Elqui / Cochiguaz', -30.1275, -70.4922),
];

const ELQUI_DAYS_ES = [
  D('Llegada a La Serena: Faro Monumental y centro neocolonial',
    'El viaje parte en la segunda ciudad más antigua de Chile: vuelo de poco más de una hora desde Santiago (o 470 km por la Ruta 5 Norte) y una tarde suave entre la Avenida del Mar, el Faro Monumental y las arcadas neocoloniales del Plan Serena, con parada en La Recova por papaya confitada, cerámica y lapislázuli.',
    [{ guide: 'la-serena-coquimbo', headings: ['1. La Serena: playas, Faro Monumental y el centro neocolonial', 'Cómo llegar'] }]),
  D('Coquimbo y los pingüinos de Punta de Choros',
    'A minutos de La Serena, Coquimbo tiene identidad propia: la Cruz del Tercer Milenio sobre la bahía, el Barrio Inglés y los lobos marinos del Islote Pájaros Niños. Después, dos horas al norte hasta la caleta de Punta de Choros para navegar la Reserva Nacional Pingüino de Humboldt — el bote sale temprano, antes de que se levante el viento, y en temporada alta conviene reservarlo con antelación.',
    [{ guide: 'la-serena-coquimbo', headings: ['2. Coquimbo: Cruz del Tercer Milenio, Barrio Inglés e Islote Pájaros Niños', '3. Punta de Choros y la Reserva Nacional Pingüino de Humboldt'] }]),
  D('Subida al Valle del Elqui: Vicuña y la ruta del pisco',
    'A poco más de una hora hacia el interior, el valle se angosta entre cerros áridos: la mañana es de Vicuña y su Museo Gabriela Mistral, y la tarde de los viñedos de moscatel a más de 1.000 metros de altura y las destilerías de Pisco Elqui —Mistral, con tour y museo, y Los Nichos, la más antigua de Chile—. Hoy toca dormir en el valle.',
    [{ guide: 'valle-del-elqui', headings: ['1. Qué es el Valle del Elqui', '4. Vicuña y el museo Gabriela Mistral', '3. La ruta del pisco: Pisco Elqui y sus destilerías', 'Cómo llegar y cuándo ir'] }]),
  D('Cochiguaz y la noche de estrellas más limpia del planeta',
    'El último día sube valle arriba hasta Cochiguaz, el sub-valle más silencioso y con menos contaminación lumínica del Elqui, y cierra como manda la zona: un tour nocturno en Mamalluca u otro observatorio turístico, idealmente en una noche cercana a luna nueva. Como los tours empiezan al anochecer y terminan tarde, esta noche también conviene dormir en el valle.',
    [
      { guide: 'valle-del-elqui', headings: ['5. Cochiguaz y el resto del valle', '2. Observatorios: de Mamalluca a Cerro Tololo'] },
      { guide: 'la-serena-coquimbo', headings: ['4. Observatorios turísticos: Mamalluca, Collowara y Cerro Mayu'] },
    ]),
];

const IQUIQUE_ALTIPLANO_ROUTE = [
  R(1, 'Iquique', -20.214, -70.152),
  R(2, 'Duna del Dragón', -20.252, -70.108),
  R(3, 'Humberstone / Pampa del Tamarugal', -20.291, -69.796),
  R(4, 'P.N. Lauca / Lago Chungará (vía Arica)', -18.243, -69.157),
];

// Dias 1-3: pulls de iquique.html. Dia 4 (altiplano): iquique.html NO tiene
// contenido de altiplano; la guia arica.html si (Ruta 11 / Chungara / Lauca).
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

// ---------- SKUs ----------

export const KITS = [
  {
    id: 'tdp-no-car',
    title: 'Torres del Paine Without a Car',
    subtitle: '5-day Patagonia itinerary: buses, day tours & the Base Torres hike',
    priceUsd: 12.9,
    gumroadPermalink: 'tdp-no-car',
    coverImage: 'torres-del-paine.jpg',
    days: TDP_DAYS,
    route: TDP_ROUTE,
    checklist: [
      'Dated Torres del Paine park entrance (buy online BEFORE arriving)',
      'Bus Punta Arenas <-> Puerto Natales (book the week before)',
      'Full-day park tour reservation',
      'Base Torres shuttle from Puerto Natales (early departure)',
      'Layers for 4 seasons in one day + waterproof shell',
      'Hiking shoes already broken in',
      'Cash in CLP (small towns, patchy card coverage)',
      'Passport + PDI slip (hotels waive VAT for foreigners)',
      'Power bank (long days, cold drains batteries)',
      'Offline maps downloaded (patchy signal in the park)',
    ],
    budget: [
      { guide: 'torres-del-paine', heading: 'Approximate costs (2026, per person)' },
      { guide: 'puerto-natales', heading: 'Approximate costs (2026, per person)' },
      { guide: 'punta-arenas', heading: 'Approximate costs (2026, per person)' },
    ],
    faqFrom: ['torres-del-paine', 'puerto-natales'],
    poiComunas: ['Torres del Paine', 'Natales', 'Puerto Natales', 'Punta Arenas'],
    poiLimit: 10,
  },
  {
    id: 'carretera-austral-7d',
    title: 'Carretera Austral 7-Day Road Trip',
    subtitle: 'Puerto Montt to the Marble Caves: ferries, gravel & glaciers',
    priceUsd: 14.9,
    gumroadPermalink: 'carretera-austral-7d',
    coverImage: 'carretera-austral.jpg',
    days: AUSTRAL_DAYS,
    route: AUSTRAL_ROUTE,
    checklist: [
      'Rental car cleared for gravel + ferries (confirm with agency IN WRITING)',
      'Hornopiren-Caleta Gonzalo ferry booked (vehicle slots sell out)',
      'Fuel discipline: fill at EVERY station south of Coyhaique',
      'Cash in CLP (many stops take no cards)',
      'Offline maps + downloaded playlists (no signal for hours)',
      'Spare tire checked + basic kit',
      'Marble Caves boat/kayak booked for morning light',
      'Warm + waterproof layers, even in January',
      'Headlamp and snacks for long stretches',
      'Passport for police checkpoints',
    ],
    budget: [{ guide: 'carretera-austral', heading: 'Approximate prices (2026)' }],
    faqFrom: ['carretera-austral'],
    poiComunas: ['Coyhaique', 'Cochrane', 'Puerto Río Tranquilo'],
    poiLimit: 8,
  },
  {
    id: 'chiloe-lakes-5d',
    title: 'Chiloe & the Chilean Lakes in 5 Days',
    subtitle: 'Puerto Varas, Osorno volcano, Frutillar & the island of churches',
    priceUsd: 9.9,
    gumroadPermalink: 'chiloe-lakes-5d',
    coverImage: 'chiloe.jpg',
    days: LAKES_DAYS,
    route: LAKES_ROUTE,
    checklist: [
      'Base yourself in Puerto Varas (best day-trip hub)',
      'Osorno + Petrohue combo tour booked',
      'Rain jacket — Chiloe is green for a reason',
      'Curanto lunch spot picked in Castro or Dalcahue',
      'Penguin boats at Punihuil (Sep-Mar season)',
      'Cash for rural stops and kuchen',
      'Ferry timing across the Chacao channel',
      'Camera charged for palafitos at golden hour',
    ],
    budget: [
      { guide: 'puerto-varas', heading: 'Approximate prices (2026)' },
      { guide: 'chiloe', heading: 'Approximate prices (2026, per person)' },
      { guide: 'frutillar', heading: 'Approximate prices (2026, per person)' },
    ],
    faqFrom: ['chiloe', 'puerto-varas'],
    poiComunas: ['Puerto Varas', 'Frutillar', 'Castro', 'Ancud'],
    poiLimit: 10,
  },
  {
    id: 'atacama-5d',
    title: 'Atacama Desert in 5 Days',
    subtitle: 'San Pedro de Atacama: Moon Valley, Tatio geysers & the clearest sky on Earth',
    priceUsd: 12.9,
    gumroadPermalink: 'atacama-5d',
    coverImage: 'san-pedro-de-atacama.jpg',
    days: ATACAMA_DAYS,
    route: ATACAMA_ROUTE,
    checklist: [
      'Acclimatize day 1 — no big tours at altitude',
      'Tatio geysers tour booked (4 AM pickup, dress for -10C)',
      'Sunscreen + lip balm + 3L water per excursion day',
      'Moon Valley for sunset, not midday',
      'Astronomy tour on a moonless night if possible',
      'Cash: San Pedro ATMs run dry in high season',
      'Swimsuit for Cejar/Baltinache lagoons',
      'Warm layers: desert nights drop below zero',
    ],
    budget: [{ guide: 'san-pedro-de-atacama', heading: 'Approximate prices (2026, per person)' }],
    faqFrom: ['san-pedro-de-atacama'],
    poiComunas: ['San Pedro de Atacama'],
    poiLimit: 10,
  },
  {
    id: 'patagonia-14d',
    title: 'Ultimate Patagonia: 14 Days in Chile',
    subtitle: 'Lakes, Chiloe, the Carretera Austral (highlights) & Torres del Paine — one master route',
    priceUsd: 29,
    gumroadPermalink: 'patagonia-14d',
    coverImage: 'torres-del-paine.jpg',
    days: [
      ...LAKES_DAYS.slice(0, 3),                 // Days 1-3: Puerto Varas + volcano + Frutillar
      ...LAKES_DAYS.slice(3, 5),                 // Days 4-5: Chiloe
      D('Fly or drive into the Carretera Austral',
        'Return to Puerto Montt. Either start the Carretera Austral by road (Hornopiren ferry) or fly to Balmaceda to hit the highlights from Coyhaique. This kit follows the fly-in variant.',
        [{ guide: 'carretera-austral', headings: ['How to get there and when to go'] }]),
      AUSTRAL_DAYS[4],                           // Day 7: Cerro Castillo
      AUSTRAL_DAYS[5],                           // Day 8: Marble Caves
      D('Back to Balmaceda, fly south to Punta Arenas',
        'Morning drive back to Balmaceda, afternoon flight south (usually via Puerto Montt or Santiago). Sleep in Punta Arenas.',
        [{ guide: 'punta-arenas', headings: ['How to get there'] }]),
      ...TDP_DAYS,                               // Days 10-14: Torres del Paine block
    ],
    route: PATAGONIA14_ROUTE,
    checklist: [
      'Domestic flights: PMC (Puerto Montt), BBA (Balmaceda), PUQ (Punta Arenas) booked early',
      'Rental cars: one for the Lakes/Chiloe leg, one from Balmaceda (gravel-cleared)',
      'Dated Torres del Paine entrance + Base Torres shuttle',
      'Hornopiren or Chacao ferries as applicable',
      'Layers for 4 climates: rain (Chiloe), gravel dust (Aysen), wind (Paine)',
      'Cash reserve in CLP for the Aysen leg',
      'Travel insurance covering trekking',
      'Buffer: never book the international flight the same day you leave Natales',
    ],
    budget: [
      { guide: 'puerto-varas', heading: 'Approximate prices (2026)' },
      { guide: 'chiloe', heading: 'Approximate prices (2026, per person)' },
      { guide: 'carretera-austral', heading: 'Approximate prices (2026)' },
      { guide: 'torres-del-paine', heading: 'Approximate costs (2026, per person)' },
    ],
    faqFrom: ['carretera-austral', 'torres-del-paine', 'chiloe'],
    poiComunas: ['Puerto Varas', 'Castro', 'Coyhaique', 'Torres del Paine', 'Natales', 'Punta Arenas'],
    poiLimit: 12,
  },
  {
    id: 'santiago-cajon-4d',
    title: 'Santiago City Break + Cajón del Maipo',
    subtitle: '4 days: historic downtown, Bellavista, San Cristóbal hill & the Andes canyon next door',
    priceUsd: 9.9,
    gumroadPermalink: 'santiago-cajon-4d',
    coverImage: 'santiago.jpg',
    days: SANTIAGO_CAJON_DAYS,
    route: SANTIAGO_CAJON_ROUTE,
    checklist: [
      'Bip! transit card for the metro (buy at any station)',
      'Comfortable walking shoes for the downtown + hills days',
      'Rental car or day-tour booked for Cajón del Maipo (last stretch to El Yeso needs a high-clearance vehicle)',
      'CONAF entrance for El Morado Natural Monument',
      'Sun layers for the Andes: altitude sun is stronger than it looks',
      'Cash in CLP for rural stops in the canyon',
      'Funicular or cable car timing for a San Cristóbal sunset',
      'Offline maps downloaded (patchy signal past San José de Maipo)',
    ],
    budget: [
      { guide: 'santiago', heading: 'Approximate costs (2026, per person)' },
      { guide: 'cajon-del-maipo', heading: 'Approximate prices (2026)' },
    ],
    faqFrom: ['santiago', 'cajon-del-maipo'],
    poiComunas: ['Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Ñuñoa', 'La Reina', 'Recoleta', 'San José de Maipo'],
    poiLimit: 10,
  },
  {
    id: 'valpo-wine-4d',
    title: 'Valparaíso & the Colchagua Wine Route',
    subtitle: '4 days: hillside heritage, street art, Chile\'s top wineries & the Pacific surf coast',
    priceUsd: 12.9,
    gumroadPermalink: 'valpo-wine-4d',
    coverImage: 'valparaiso.jpg',
    days: VALPO_WINE_DAYS,
    route: VALPO_WINE_ROUTE,
    checklist: [
      'Rental car (easiest way to link the 4 stops) or buses Santiago-Valparaíso and Santa Cruz-Pichilemu',
      'Comfortable shoes for Valparaíso\'s steep cobblestone hills',
      'Wine tour bookings in Santa Cruz (book ahead in Jan-Feb)',
      'Colchagua Museum hours checked before you go',
      'Sunscreen for Pichilemu\'s exposed coast',
      'Cash in CLP for smaller wineries',
      'Camera for the street art and funiculars',
      'Layers: coastal fog (camanchaca) burns off by midday',
    ],
    budget: [
      { guide: 'valparaiso', heading: 'Approximate prices (2026)' },
      { guide: 'colchagua-pichilemu', heading: 'Approximate prices (2026)' },
    ],
    faqFrom: ['valparaiso', 'colchagua-pichilemu'],
    poiComunas: ['Valparaíso', 'Viña del Mar', 'Santa Cruz', 'Pichilemu'],
    poiLimit: 10,
  },
  {
    id: 'pucon-volcano-4d',
    title: 'Pucón & Villarrica Volcano: 4-Day Adventure',
    subtitle: 'Volcano views, hot springs, whitewater rafting & black-sand lake beaches in the Lake District',
    priceUsd: 12.9,
    gumroadPermalink: 'pucon-volcano-4d',
    coverImage: 'pucon-villarrica.jpg',
    days: PUCON_DAYS,
    route: PUCON_ROUTE,
    checklist: [
      'Volcano summit trek booked with a certified operator (weather-dependent, book flexible dates)',
      'Swimsuit + towel for the hot springs',
      'Water shoes for rafting on the Trancura',
      'Insect repellent for the Huerquehue trails',
      'CONAF entrance fee for Huerquehue National Park',
      'Warm layers even in summer (volcano wind)',
      'Cash in CLP for smaller adventure operators',
      'Waterproof bag for the rafting day',
      'Book Trancura rafting/hydrospeed ahead in Jan-Feb high season',
      'Check the current volcano alert level before trekking',
    ],
    budget: [{ guide: 'pucon-villarrica', heading: 'Approximate prices (2026, per person)' }],
    faqFrom: ['pucon-villarrica'],
    poiComunas: ['Pucón', 'Villarrica', 'Curarrehue'],
    poiLimit: 8,
  },
  {
    id: 'elqui-stars-4d',
    title: 'La Serena, Coquimbo & the Elqui Valley',
    subtitle: 'Stars, pisco & the coast: 4 days between the Pacific and the clearest sky on Earth',
    priceUsd: 14.9,
    gumroadPermalink: 'elqui-stars-4d',
    coverImage: 'la-serena.jpg',
    days: ELQUI_DAYS,
    route: ELQUI_ROUTE,
    checklist: [
      'Dated Punta de Choros penguin-reserve boat tour booked (weather-dependent)',
      'Observatory tour booked weeks ahead (Mamalluca/Collowara sell out)',
      'Warm layers for night tours: desert nights are cold even in summer',
      'Rental car for the Elqui Valley legs (public transport is limited)',
      'Cash in CLP for small pisco distilleries',
      'Sunscreen for the coast days',
      'Swimsuit for La Serena\'s beaches',
      'Camera with manual mode if you want astrophotography shots',
      'Check for a moonless night before booking stargazing',
      'Comfortable shoes for the neocolonial downtown walk',
    ],
    budget: [
      { guide: 'la-serena-coquimbo', heading: 'Approximate prices (2026, per person)' },
      { guide: 'valle-del-elqui', heading: 'Approximate prices (2026)' },
    ],
    faqFrom: ['la-serena-coquimbo', 'valle-del-elqui'],
    poiComunas: ['La Serena', 'Coquimbo', 'Vicuña', 'Paihuano'],
    poiLimit: 10,
  },
  {
    id: 'rapa-nui-4d',
    title: 'Rapa Nui (Easter Island) in 4 Days',
    subtitle: 'Moai, ceremonial villages & the white-sand beach at the edge of the Pacific',
    priceUsd: 19.9,
    gumroadPermalink: 'rapa-nui-4d',
    coverImage: 'rapa-nui.jpg',
    days: RAPA_NUI_DAYS,
    route: RAPA_NUI_ROUTE,
    checklist: [
      'Rapa Nui National Park entrance ticket bought online BEFORE arrival (limited daily capacity)',
      'Flight booked early: the only route is via Santiago, and fares spike in high season',
      'Sunscreen + hat: little shade at the ceremonial sites',
      'Rental car, quad or tour booked (distances are longer than the map suggests)',
      'Cash in CLP: limited card acceptance outside Hanga Roa',
      'Reef-safe sunscreen for Anakena',
      'Respect roped-off areas around the moai (fines apply)',
      'Offline maps downloaded (patchy signal outside Hanga Roa)',
      'Swimsuit for Anakena beach',
      'Book an Orongo/Rano Kau sunset if it is not already in your park ticket',
    ],
    budget: [{ guide: 'rapa-nui', heading: 'Approximate prices (2026, per person)' }],
    faqFrom: ['rapa-nui'],
    poiComunas: ['Isla de Pascua'],
    poiLimit: 8,
  },
  // Kit gen-2 (2026-08-01): primer kit en ESPAÑOL (mercado de la query GSC
  // "termas de chillán" ~79 imp/3sem pos ~45). lang:'es' fija guia fuente ES
  // (raiz del repo) + carcasa ES; no depende del flag --lang.
  {
    id: 'termas-del-sur-4d',
    lang: 'es',
    title: 'Termas del Sur: 4 días en las Termas de Chillán',
    subtitle: 'Aguas termales volcánicas, nieve en invierno, trekking en la Reserva Ñuble y la gastronomía de Chillán — la ruta completa con presupuesto 2026',
    priceUsd: 12.9,
    gumroadPermalink: 'termas-del-sur-4d',
    affQuery: 'Chillán',
    coverImage: 'termas-de-chillan.jpg',
    days: TERMAS_SUR_DAYS,
    route: TERMAS_SUR_ROUTE,
    checklist: [
      'Entrada de día a las piscinas termales reservada con anticipación (aforo limitado en temporada alta)',
      'Alojamiento, pases de esquí y entrada a las termas reservados si viajas en julio o en fines de semana largos',
      'Traje de baño y toalla para las piscinas termales',
      'Transporte Chillán → Las Trancas definido: combi rural, taxi o auto arrendado (80 km de subida)',
      'Estado de la nieve y apertura de andariveles revisado antes de viajar (varía cada año)',
      'Calzado de trekking para los senderos de la Reserva Nacional Ñuble',
      'Ropa de capas: puedes pasar de la nieve a la piscina termal el mismo día',
      'Efectivo en CLP para el mercado de Chillán y paradas rurales',
    ],
    budget: [{ guide: 'termas-de-chillan', heading: 'Precios orientativos (2026)' }],
    faqFrom: ['termas-de-chillan'],
    poiComunas: ['Pinto', 'Chillán'],
    // Dedup editorial: el catalogo tiene 3 fichas del mismo complejo termal y 2
    // del centro de esqui; se queda UNA de cada una (la de mayor score).
    poiExclude: ['Termas de Chillán', 'Termas de Chillán - Spa y Parque de Agua', 'Nevados de Chillán (centro de esquí)'],
    poiLimit: 8,
  },
  // Kit gen-2 ES (2026-08-01, tanda 2): wedge sobre la query GSC "velo de la
  // novia" (62 imp, pos ~9 — ranking bueno, sin producto que la capture).
  // Contenido 100% de radal-siete-tazas-curico.html (ES). SIN seccion de POIs
  // bonus: la cobertura del catalogo en Molina/Curico es boilerplate autogenerado
  // (verificado 2026-08-01: descripciones tipo "Mirador en Libertador General
  // Bernardo O'Higgins, Chile." — region errada incluida). Nada de eso entra a
  // un producto de pago: poiComunas vacio => compile-html omite la seccion.
  {
    id: 'radal-siete-tazas-3d',
    lang: 'es',
    title: 'Radal Siete Tazas y Velo de la Novia: 3 días en el Maule',
    subtitle: 'Pozones turquesa del río Claro, cascadas entre bosque nativo, la Ruta del Vino de Curicó y el cierre en las termas de Panimávida — la ruta completa con presupuesto 2026',
    priceUsd: 12.9,
    gumroadPermalink: 'radal-siete-tazas-3d',
    affQuery: 'Curicó',
    coverImage: 'radal-siete-tazas-curico.jpg',
    days: RADAL_DAYS,
    route: RADAL_ROUTE,
    checklist: [
      'Entrada al parque comprada online en pasesparques.cl ANTES de salir de viaje (no hay venta en el lugar ni en el pueblo de Radal)',
      'Alojamiento reservado en Curicó o Molina para la noche anterior al día de parque',
      'Transporte Molina → parque definido: auto propio, taxi o combi rural (no siempre circula a diario — confirmar horarios)',
      'Traje de baño y toalla para los pozones del río Claro y las termas del día 3',
      'Tour de degustación en viña reservado (en vendimia, marzo-abril, conviene asegurar cupo)',
      'Calzado de trekking para los senderos del parque',
      'Ropa de capas: valle caluroso abajo, precordillera más fría arriba',
      'Efectivo en CLP para combis rurales y compras menores',
    ],
    budget: [{ guide: 'radal-siete-tazas-curico', heading: 'Precios orientativos (2026)' }],
    faqFrom: ['radal-siete-tazas-curico'],
    poiComunas: [],
    poiLimit: 0,
  },
  // Kit gen-2 ES (2026-08-01, tanda 2): gemelo en español de santiago-cajon-4d
  // (mismo molde y misma ruta, copy ES, pulls a las guias ES raiz). Permalink
  // distinto del EN para no colisionar en Gumroad/Payhip. Al cablearlo, el
  // inyector hace SWAP del CTA EN por este en las guias ES santiago/cajon
  // (lector ES -> PDF ES); en/pt siguen ofreciendo el kit EN.
  {
    id: 'santiago-cajon-4d-es',
    lang: 'es',
    title: 'Santiago + Cajón del Maipo: 4 días',
    subtitle: 'Centro histórico, Bellavista y el atardecer en el cerro San Cristóbal, más la escapada de montaña al Embalse El Yeso y Baños Morales — con presupuesto 2026',
    priceUsd: 9.9,
    gumroadPermalink: 'santiago-cajon-es',
    affQuery: 'Santiago Chile',
    coverImage: 'santiago.jpg',
    days: SANTIAGO_CAJON_DAYS_ES,
    route: SANTIAGO_CAJON_ROUTE,
    checklist: [
      'Tarjeta Bip! para metro y buses (se compra y recarga en cualquier estación)',
      'Calzado cómodo para los días de centro histórico y cerros',
      'Entrada al Monumento Natural El Morado comprada online con anticipación en Pases Parques (cupos diarios limitados, sobre todo enero-febrero)',
      'Auto arrendado o tour reservado para el cajón: el tramo final a El Yeso y Baños Morales es de ripio y conviene buena altura de vehículo',
      'Corte estacional de El Yeso revisado: entre abril y agosto el acceso vehicular puede restringirse',
      'Capas y protección solar para la cordillera — el sol de altura pega más fuerte de lo que parece',
      'Efectivo en CLP para paradas rurales del cajón',
      'Horario del funicular o teleférico confirmado para llegar al atardecer al San Cristóbal',
    ],
    budget: [
      { guide: 'santiago', heading: 'Costos orientativos (2026, por persona)' },
      { guide: 'cajon-del-maipo', heading: 'Precios orientativos (2026)' },
    ],
    faqFrom: ['santiago', 'cajon-del-maipo'],
    poiComunas: ['Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Ñuñoa', 'La Reina', 'Recoleta', 'San José de Maipo'],
    // Dedup editorial: el kit ya cubre estos 5 como contenido de los dias 1-4;
    // el bonus tiene que ser EXTRA (museos, mercados, termas de Colina, etc.).
    poiExclude: ['Cerro San Cristóbal y Parque Metropolitano', 'Barrio Bellavista', 'Plaza de Armas y Centro Histórico de Santiago', 'Embalse El Yeso', 'Cascada de las Ánimas'],
    poiLimit: 10,
  },
  // Kit gen-2 ES (2026-08-01, tanda 3): gemelo en español de atacama-5d (mismo
  // molde/recorrido, copy ES, pulls a la guia ES raiz san-pedro-de-atacama.html).
  // Permalink distinto del EN para no colisionar en Gumroad/Payhip.
  {
    id: 'atacama-5d-es',
    lang: 'es',
    title: 'Desierto de Atacama en 5 días',
    subtitle: 'San Pedro de Atacama: Valle de la Luna, géiseres del Tatio, lagunas altiplánicas y tour astronómico bajo el cielo más limpio del planeta — con presupuesto 2026',
    priceUsd: 12.9,
    gumroadPermalink: 'atacama-5d-es',
    affQuery: 'San Pedro de Atacama',
    coverImage: 'san-pedro-de-atacama.jpg',
    days: ATACAMA_DAYS_ES,
    route: ATACAMA_ROUTE_ES,
    checklist: [
      'Excursiones ordenadas de menor a mayor altitud: Luna → Cejar → lagunas → Tatio — el Tatio NUNCA el primer día',
      'Tour a los géiseres del Tatio reservado (salida ~4 AM; en temporada alta se agota)',
      'Capas y gorro aunque sea verano: 25 °C de día en el pueblo, bajo cero al amanecer en el Tatio',
      'Tour astronómico en una noche sin luna llena (reservar con anticipación en temporada alta)',
      'Efectivo en CLP: las entradas comunitarias se pagan en efectivo y los cajeros del pueblo se agotan en temporada alta',
      'Presupuesto extra de CLP 30.000–50.000 para entradas a sitios (casi nunca incluidas en los tours)',
      'Traje de baño para flotar en las lagunas Cejar o Baltinache',
      'Plan B para enero-febrero: el invierno altiplánico puede llover y cerrar rutas puntualmente',
    ],
    budget: [{ guide: 'san-pedro-de-atacama', heading: 'Precios orientativos (2026, por persona)' }],
    faqFrom: ['san-pedro-de-atacama'],
    poiComunas: ['San Pedro de Atacama'],
    // Dedup editorial: los 6 primeros nombres ya son contenido de los dias 1-5
    // (el bonus tiene que ser EXTRA). El resto de la exclusion es boilerplate
    // autogenerado verificado 2026-08-01: fichas "Mirador en Antofagasta, Chile."
    // (Laguna Piedra, Tunel de Catarpe...), stubs de 53 chars (Laguna Miscanti...),
    // stats Ramsar/Santuario, un hostal con resena EN y un camping con nombre
    // duplicado. Quedan 7 POIs editoriales reales (sandboard, Pukara de Quitor,
    // iglesia, Termas de Puritama, Valle del Arcoiris, Aldea de Tulor, Caracoles).
    poiExclude: [
      'Valle de la Luna', 'Géiseres del Tatio', 'Lagunas Altiplánicas Miscanti y Miñiques',
      'Laguna Cejar y Ojos del Salar', 'Tour Astronómico en San Pedro de Atacama',
      'Laguna Chaxa - Reserva Nacional Los Flamencos',
      'Laguna Licancabur', 'Laguna Miñiques', 'Laguna Miscanti', 'Laguna Tebenquiche',
      'Laguna Tuyajto', 'Laguna Piedra',
      'Santuario de la Naturaleza Valle de la Luna y Sierra de Orbate',
      'Santuario de la Naturaleza Laguna Tebenquiche',
      'Sitio Ramsar Salar de Pujsa',
      'Sitio Ramsar Sistema Hidrológico de Soncor del Salar de Atacama',
      'Sitio Ramsar Salar de Tara',
      'Hostal Misky Wasi',
      'Camping y Termas de Puritama altiplano - Camping Laguna Lejía',
    ],
    poiLimit: 7,
  },
  // Kit gen-2 ES (2026-08-01, tanda 3): gemelo en español de tdp-no-car (mismo
  // molde "sin auto", copy ES, pulls a las guias ES raiz torres-del-paine,
  // puerto-natales y punta-arenas). Permalink distinto del EN.
  {
    id: 'torres-del-paine-5d-es',
    lang: 'es',
    title: 'Torres del Paine sin auto: 5 días',
    subtitle: 'Buses, tour de día completo, trekking a Base Torres y navegación por el Seno Última Esperanza desde Puerto Natales — con presupuesto 2026',
    priceUsd: 12.9,
    gumroadPermalink: 'torres-del-paine-5d-es',
    affQuery: 'Torres del Paine',
    coverImage: 'torres-del-paine.jpg',
    days: TDP_DAYS_ES,
    route: TDP_ROUTE_ES,
    checklist: [
      'Entrada al parque comprada online CON FECHA antes de llegar (obligatoria)',
      'Bus Punta Arenas ↔ Puerto Natales (~3 h por la Ruta 9) comprado con anticipación',
      'Tour de día completo al parque reservado desde Puerto Natales',
      'Transporte a Laguna Amarga + shuttle (o tour guiado) para el día de Base Torres',
      'Alojamiento en Puerto Natales reservado con anticipación en diciembre-febrero',
      'Cortaviento real y bastones: ráfagas de 100+ km/h son normales en verano',
      'Capas para cuatro estaciones en un día, da igual el pronóstico',
      'Calzado de trekking ya usado (19 km y 8-10 horas el día de Base Torres)',
      'Efectivo en CLP sacado en Puerto Natales: dentro del parque casi no hay señal ni pago electrónico',
      'Provisiones compradas en Puerto Natales antes de entrar al parque',
    ],
    budget: [
      { guide: 'torres-del-paine', heading: 'Costos orientativos (2026, por persona)' },
      { guide: 'puerto-natales', heading: 'Costos orientativos (2026, por persona)' },
      { guide: 'punta-arenas', heading: 'Costos orientativos (2026, por persona)' },
    ],
    faqFrom: ['torres-del-paine', 'puerto-natales'],
    poiComunas: ['Torres del Paine', 'Natales', 'Puerto Natales', 'Punta Arenas'],
    // Dedup editorial: los 8 primeros ya son contenido de los dias 1-5 (parque,
    // Base Torres, Pehoe/Salto Grande del tour, Milodon, Magdalena, plaza y
    // costanera). Las 3 ultimas exclusiones son junk verificado 2026-08-01:
    // stub EN de 52 chars, camping con resena EN y ficha stats de hectareas.
    // Quedan 10 POIs editoriales reales (Cerro de la Cruz, Glaciar Grey, mercado,
    // cementerio, museos, Seno Otway, Dorotea, Nao Victoria, Fuerte Bulnes...).
    poiExclude: [
      'Parque Nacional Torres del Paine', 'Mirador Base Las Torres', 'Lago Pehoé',
      'Salto Grande', 'Monumento Natural Cueva del Milodón',
      'Monumento Natural Los Pingüinos (Isla Magdalena)',
      'Plaza Muñoz Gamero', 'Costanera de Puerto Natales',
      'salto Chico Falls', 'Camping Río Serrano',
      'Parque Nacional y Reserva Nacional Kawésqar',
    ],
    poiLimit: 10,
  },
  // ---------- Kits gen-3 ES (ronda 4, 2026-08-01) ----------
  // Contenido integrado tal cual lo dejaron los constructores (ver header de la
  // seccion de dias gen-3). Payhip ya verificado: ver PAYHIP_URLS.
  // NOTA: malalcahuello-conguillio-4d-es (7o kit de la ronda) NO va en este
  // array a proposito: su contenido es de autoria propia sin guias fuente
  // (days con html propio, budgetRows, pois curados — shape incompatible con
  // compile-html.mjs y con test/kits-config.test.mjs) y no tiene guia destino
  // para CTA. Su build standalone vive en build/malalcahuello-conguillio-4d-es/
  // y su URL Payhip esta registrada en PAYHIP_URLS.
  {
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
    // Dedup editorial verificado por el constructor 2026-08-01 (detalle en
    // kits.config.chiloe-5d-es.mjs): fuera los 4 lugares que ya son contenido
    // de los dias 1-5 + boilerplate autogenerado del catalogo. Quedan 4 POIs
    // editoriales reales (Alerce Andino, Puñihuil, iglesia de Chonchi, Muestra
    // Costumbrista de Castro).
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
  },
  {
    id: 'pucon-4d-es',
    lang: 'es',
    title: 'Pucón y Alrededores: 4 días de aventura',
    subtitle: 'Volcán Villarrica, termas naturales, rafting en el río Trancura y playas de arena volcánica — la ruta completa con presupuesto 2026',
    priceUsd: 12.9,
    gumroadPermalink: 'pucon-4d-es',
    affQuery: 'Pucon',
    coverImage: 'pucon-villarrica.jpg',
    days: PUCON_DAYS_ES,
    route: PUCON_ROUTE_ES,
    checklist: [
      'Ascenso al volcán reservado con agencia certificada (depende del clima y de la alerta volcánica: reserva con fecha flexible)',
      'Traje de baño y toalla para las termas',
      'Zapatos de agua para el rafting en el Trancura',
      'Repelente de insectos para los senderos de Huerquehue',
      'Entrada al Parque Nacional Huerquehue (CONAF) comprada con anticipación',
      'Capas abrigadas incluso en verano (viento en el volcán)',
      'Efectivo en CLP para operadores de aventura más pequeños',
      'Bolso impermeable para el día de rafting',
      'Rafting o hydrospeed en el Trancura reservado con anticipación en temporada alta (enero-febrero)',
      'Nivel de alerta volcánica (SERNAGEOMIN) revisado antes del trekking',
    ],
    budget: [{ guide: 'pucon-villarrica', heading: 'Precios orientativos (2026, por persona)' }],
    faqFrom: ['pucon-villarrica'],
    poiComunas: ['Pucón', 'Villarrica', 'Curarrehue'],
    // Dedup editorial + filtro anti-boilerplate verificado por el constructor
    // 2026-08-01 (detalle en build/pucon-4d-es/generate.mjs): fuera los 5
    // lugares que ya son contenido de los dias 1-4, stubs autogenerados, la
    // ficha stats Ramsar y Lican Ray (fuera del eje de esta ruta).
    poiExclude: [
      'Ascenso al Volcán Villarrica',
      'Termas Los Pozones',
      'Rafting Río Trancura',
      'Parque Nacional Huerquehue',
      'Ojos del Caburgua',
      'Termas de San Luis',
      'Termas Trancura',
      'Hotel & Termas Huife',
      'Nido de Aguila',
      'Salto La China',
      'Salto El León',
      'Lago Villarrica',
      'Lago Caburgua',
      'Lago Tinquilco',
      'Cuevas Volcánicas Volcán Villarrica',
      'Humedal Urbano Mallolafquen',
      'Playa Grande de Lican Ray',
    ],
    poiLimit: 8,
  },
  {
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
    // Dedup editorial verificado por el constructor 2026-08-01 (detalle en
    // kit-valparaiso-vina-3d-es.config.mjs): fuera lo que ya es contenido de
    // los dias 1-3 + bustos/humedales/stubs autogenerados. Quedan 10 POIs
    // reales y vigentes (miradores, Caleta Portales, iconos de Viña, castillos
    // Wulff/Brunet con su estado real).
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
  },
  {
    id: 'carretera-austral-norte-7d-es',
    lang: 'es',
    title: 'Carretera Austral Norte en 7 días: de Puerto Montt a Coyhaique',
    subtitle: 'Ferries entre fiordos, ripio y glaciares: la mitad norte de la Ruta 7 con toda la logística de bencina y ferris resuelta, presupuesto 2026 y checklist imprimible',
    priceUsd: 14.9,
    gumroadPermalink: 'carretera-austral-norte-7d-es',
    affQuery: 'Carretera Austral',
    coverImage: 'carretera-austral.jpg',
    days: AUSTRAL_NORTE_DAYS,
    route: AUSTRAL_NORTE_ROUTE,
    checklist: [
      'Auto arrendado habilitado POR ESCRITO para ripio y ferry — avisa a la agencia que harás la Carretera Austral',
      'Ferry Hornopirén–Caleta Gonzalo reservado apenas tengas fechas (los cupos de vehículo se agotan con semanas de anticipación en enero-febrero)',
      'Disciplina de bencina: llena el estanque en CADA estación — Puerto Montt, Chaitén, La Junta y Coyhaique son tus puntos clave; al sur de Coyhaique los tramos sin bencineras superan los 200 km',
      'Efectivo en CLP: ferry, venta informal de bencina en bidones y pueblos chicos no siempre aceptan tarjeta',
      'Mapas descargados offline y playlist lista: hay tramos de horas sin señal, sobre todo al sur de Cochrane',
      'Neumático de repuesto revisado + kit básico — el ripio es duro con las ruedas',
      'Tour a las Capillas de Mármol reservado para la mañana (mejor luz y lago más calmo)',
      'Capas de abrigo e impermeable incluso en enero: en la Patagonia llueve en cualquier época',
      'Alojamiento reservado en Chaitén y Futaleufú si viajas en temporada alta',
      'Itinerario avisado a un contacto: hay tramos sin cobertura donde nadie puede localizarte',
    ],
    budget: [
      { guide: 'carretera-austral', heading: 'Precios orientativos (2026)' },
      { guide: 'puerto-montt', heading: 'Precios orientativos (2026)' },
    ],
    faqFrom: ['carretera-austral', 'puerto-montt'],
    poiComunas: ['Coyhaique', 'Cochrane', 'Puerto Río Tranquilo'],
    // Dedup editorial verificado por el constructor 2026-08-01 (detalle en
    // build-austral-norte.mjs): fuera la ficha con tipografia corrupta y la de
    // stats autogenerada; el boilerplate restante queda fuera por el corte de
    // limit. Los 10 que quedan son editoriales reales.
    poiExclude: ['Parque Patagonia - Valle Chacabuco', 'Bien Nacional Protegido Cerro San Lorenzo'],
    poiLimit: 10,
  },
  {
    id: 'valle-elqui-4d-es',
    lang: 'es',
    title: 'Valle del Elqui y La Serena: 4 días de estrellas y pisco',
    subtitle: 'Pingüinos de Humboldt en Punta de Choros, la ruta del pisco entre viñedos de altura, Vicuña y el museo de Gabriela Mistral, y la noche bajo uno de los cielos más limpios del planeta — la ruta completa con presupuesto 2026',
    priceUsd: 12.9,
    gumroadPermalink: 'valle-elqui-4d-es',
    affQuery: 'Valle del Elqui',
    coverImage: 'valle-del-elqui.jpg',
    days: ELQUI_DAYS_ES,
    route: ELQUI_ROUTE_ES,
    checklist: [
      'Tour en bote a la Reserva Nacional Pingüino de Humboldt reservado con antelación (sale temprano en la mañana y depende del viento)',
      'Tour nocturno de observatorio reservado: Mamalluca se agota en enero-febrero; Cerro Tololo es solo diurno y exige reserva con semanas o meses de anticipación',
      'Fase lunar revisada antes de reservar astroturismo: cerca de luna nueva se ve mejor la Vía Láctea',
      'Capas abrigadas para los tours nocturnos: las noches del valle son frías incluso en verano',
      'Alojamiento en el valle reservado para la noche del tour astronómico (los tours terminan tarde y volver de noche por el camino de montaña no es ideal)',
      'Auto arrendado o tour con transporte para recorrer el valle (el transporte público es limitado, sobre todo de noche)',
      'Efectivo en CLP para destilerías pequeñas, buses rurales y compras menores',
      'Bloqueador solar para los días de costa y de valle',
      'Traje de baño para las playas de la Avenida del Mar',
      'Calzado cómodo para el centro neocolonial y los pueblos de adobe',
    ],
    budget: [
      { guide: 'la-serena-coquimbo', heading: 'Precios orientativos (2026, por persona)' },
      { guide: 'valle-del-elqui', heading: 'Precios orientativos (2026)' },
    ],
    faqFrom: ['la-serena-coquimbo', 'valle-del-elqui'],
    poiComunas: ['La Serena', 'Coquimbo', 'Vicuña', 'Paihuano'],
    // Dedup editorial + filtro anti-boilerplate verificado corriendo topPois el
    // 2026-08-01 (detalle en build/valle-elqui-4d-es/generate.mjs): fuera los 10
    // lugares que ya son contenido de los dias 1-4, fichas junk del catalogo y
    // boilerplate autogenerado — por eso poiLimit queda en 5: solo los 5 POIs
    // editoriales verificados.
    poiExclude: [
      'Observatorio Mamalluca',
      'Cruz del Tercer Milenio',
      'Destilería Pisco Mistral (Pisco Elqui)',
      'Avenida del Mar y Faro Monumental de La Serena',
      'Museo Gabriela Mistral de Vicuña',
      'Pueblo de Pisco Elqui',
      'Cochiguaz',
      'Barrio Inglés de Coquimbo',
      'Cerro Tololo y cielos del Elqui (zona alta cordillerana)',
      'Mercado La Recova',
      "Monumento Bernardo O'Higgins",
      'Pdte. Videla',
      'Casa Piñera',
      'Francisco de Aguirre',
      'Gabriela Mistral',
      '4 Estaciones',
      'Hito Conmemorativo Umbra',
      'Sitio Ramsar Humedales Costeros de la Bahía Tongoy',
      'Santuario de la Naturaleza Río Cochiguaz',
      'Humedal Urbano Río Elqui',
      'Embalse Puclaro (deportes náuticos y borde lago)',
      'Cascada Luz de Luna',
      'Embalse Puclaro',
      'Mirador La Herradura',
    ],
    poiLimit: 5,
  },
  {
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
    // Dedup editorial verificado por el constructor 2026-08-01 (detalle en
    // kits.iquique-altiplano.config.mjs): fuera los 7 lugares que ya son
    // contenido de los dias 1-3 + fichas Ramsar/Santuario/template/stubs.
    // Los 4 POIs estrella del altiplano NO se excluyen pese a ser el destino
    // del dia 4: el cuerpo del dia 4 cubre logistica/contexto y sin ellas el
    // altiplano desapareceria del PDF.
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
  },
];

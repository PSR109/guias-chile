// 5 SKUs. Los "pulls" referencian headings EXACTOS de los HTML en /en/ (verificados 2026-07-21).
// El numero de dia lo pone el compilador (Day 1..N), aqui solo va el titulo del dia.

export const GUMROAD_BASE = 'https://patagoniatrips.gumroad.com/l';

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
];

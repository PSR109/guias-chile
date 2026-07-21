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
];

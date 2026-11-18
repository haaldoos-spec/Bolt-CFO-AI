import L from 'leaflet';

/**
 * Illustrerad karta över Huskvarna–Jönköping. Formerna är förenklade och ungefärliga –
 * den ska se ut som en karta, inte användas för exakt navigering. För riktig karta
 * finns knappen som öppnar Apple Kartor / Google Maps.
 */

type LL = [number, number];

const VATTERN: LL[] = [
  [57.7855, 14.1050], [57.7860, 14.1300], [57.7866, 14.1600], [57.7878, 14.1850], [57.7893, 14.2100],
  [57.7908, 14.2350], [57.7925, 14.2550], [57.7942, 14.2700], [57.7990, 14.2800], [57.8080, 14.2900],
  [57.8200, 14.3000], [57.8400, 14.3150], [57.8700, 14.3300], [57.9200, 14.3400], [57.9800, 14.3300],
  [57.9800, 13.9800], [57.8600, 14.0100], [57.8200, 14.0400], [57.8000, 14.0700], [57.7900, 14.0900],
];

const LAKES: { name: string; pts: LL[] }[] = [
  { name: 'Munksjön', pts: [[57.7800, 14.1490], [57.7808, 14.1620], [57.7740, 14.1660], [57.7640, 14.1620], [57.7590, 14.1530], [57.7660, 14.1460], [57.7740, 14.1470]] },
  { name: 'Rocksjön', pts: [[57.7830, 14.1790], [57.7825, 14.1900], [57.7790, 14.1930], [57.7760, 14.1880], [57.7770, 14.1800], [57.7800, 14.1770]] },
  { name: 'Lillsjön', pts: [[57.8005, 14.2440], [57.8000, 14.2520], [57.7970, 14.2540], [57.7955, 14.2480], [57.7975, 14.2430]] },
];

const RIVER: LL[] = [[57.7940, 14.2715], [57.7905, 14.2790], [57.7870, 14.2860], [57.7830, 14.2920], [57.7770, 14.3010], [57.7700, 14.3120], [57.7600, 14.3300]];

const FORESTS: LL[][] = [
  // Bymarken
  [[57.7860, 14.0900], [57.7840, 14.1250], [57.7720, 14.1320], [57.7620, 14.1180], [57.7650, 14.0900]],
  // Dunkehallar
  [[57.7790, 14.1370], [57.7785, 14.1470], [57.7720, 14.1480], [57.7700, 14.1380]],
  // Strömsberg
  [[57.7760, 14.1900], [57.7755, 14.2120], [57.7640, 14.2150], [57.7610, 14.1950]],
  // Öxnehaga och höjderna öster om Huskvarna
  [[57.8000, 14.2980], [57.7960, 14.3400], [57.7750, 14.3450], [57.7700, 14.3150], [57.7820, 14.3000]],
  // Skogsbältet i söder
  [[57.7600, 14.0800], [57.7550, 14.2300], [57.7620, 14.2600], [57.7600, 14.3500], [57.7200, 14.3500], [57.7200, 14.0800]],
];

const TOWNS: { pts: LL[]; streets: number }[] = [
  // Jönköping
  { pts: [[57.7850, 14.1320], [57.7865, 14.1700], [57.7885, 14.2050], [57.7790, 14.2150], [57.7720, 14.2000], [57.7700, 14.1700], [57.7720, 14.1350]], streets: 14 },
  // Huskvarna
  { pts: [[57.7935, 14.2560], [57.7960, 14.2760], [57.8000, 14.2900], [57.7920, 14.2980], [57.7800, 14.2960], [57.7760, 14.2750], [57.7820, 14.2580]], streets: 10 },
  // Råslätt / Ekhagen söder om stan
  { pts: [[57.7660, 14.1700], [57.7650, 14.2050], [57.7560, 14.2000], [57.7560, 14.1700]], streets: 6 },
];

const ROADS: { pts: LL[]; major: boolean }[] = [
  // E4 längs Vättern
  { major: true, pts: [[57.7700, 14.0800], [57.7790, 14.1200], [57.7835, 14.1500], [57.7848, 14.1800], [57.7862, 14.2100], [57.7880, 14.2400], [57.7895, 14.2650], [57.7950, 14.2930], [57.8100, 14.3100], [57.8400, 14.3300], [57.8800, 14.3500]] },
  // Riksväg 40 västerut
  { major: true, pts: [[57.7790, 14.1200], [57.7700, 14.0900], [57.7600, 14.0500]] },
  // Söderut mot Taberg
  { major: true, pts: [[57.7820, 14.1600], [57.7700, 14.1680], [57.7400, 14.1500], [57.7100, 14.1200], [57.6800, 14.0900]] },
  // Väg upp mot höjderna öster om Huskvarna
  { major: false, pts: [[57.7880, 14.2800], [57.7800, 14.3000], [57.7700, 14.3300], [57.7600, 14.3500]] },
  // Mellan Jönköping och Huskvarna, söder om E4
  { major: false, pts: [[57.7800, 14.1700], [57.7790, 14.2100], [57.7820, 14.2450], [57.7860, 14.2650]] },
];

const LABELS: { name: string; at: LL; kind: 'town' | 'water' | 'suburb' }[] = [
  { name: 'Vättern', at: [57.8300, 14.1800], kind: 'water' },
  { name: 'Huskvarna', at: [57.7880, 14.2760], kind: 'town' },
  { name: 'Jönköping', at: [57.7800, 14.1600], kind: 'town' },
  { name: 'Munksjön', at: [57.7700, 14.1560], kind: 'water' },
  { name: 'Öxnehaga', at: [57.7860, 14.3230], kind: 'suburb' },
  { name: 'Bymarken', at: [57.7740, 14.1080], kind: 'suburb' },
];

/** Pseudo-gatunät inom ett stadsområde – ger kartkänsla */
function streets(pts: LL[], n: number): LL[][] {
  const lats = pts.map((p) => p[0]);
  const lngs = pts.map((p) => p[1]);
  const [s, nn, w, e] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
  const poly = L.polygon(pts);
  const inside = (p: LL) => {
    // ray casting
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [yi, xi] = pts[i];
      const [yj, xj] = pts[j];
      if (yi > p[0] !== yj > p[0] && p[1] < ((xj - xi) * (p[0] - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  void poly;
  const out: LL[][] = [];
  for (let i = 1; i < n; i++) {
    const lat = s + ((nn - s) * i) / n;
    const seg: LL[] = [];
    for (let k = 0; k <= 40; k++) {
      const p: LL = [lat + Math.sin(k * 0.7 + i) * 0.0004, w + ((e - w) * k) / 40];
      if (inside(p)) seg.push(p);
      else if (seg.length) break;
    }
    if (seg.length > 1) out.push(seg);
    const lng = w + ((e - w) * i) / n;
    const seg2: LL[] = [];
    for (let k = 0; k <= 40; k++) {
      const p: LL = [s + ((nn - s) * k) / 40, lng + Math.cos(k * 0.6 + i) * 0.0006];
      if (inside(p)) seg2.push(p);
      else if (seg2.length) break;
    }
    if (seg2.length > 1) out.push(seg2);
  }
  return out;
}

export function createIllustratedMap() {
  const r = L.canvas({ padding: 0.5 });
  const g = L.layerGroup();
  const add = (l: L.Layer) => g.addLayer(l);

  FORESTS.forEach((f) => add(L.polygon(f, { renderer: r, stroke: false, fillColor: '#132a1d', fillOpacity: 1, interactive: false, smoothFactor: 1 })));
  TOWNS.forEach((t) => {
    add(L.polygon(t.pts, { renderer: r, stroke: false, fillColor: '#1a1e2d', fillOpacity: 1, interactive: false }));
    streets(t.pts, t.streets).forEach((s) => add(L.polyline(s, { renderer: r, color: '#2d3450', weight: 1.4, interactive: false })));
  });
  add(L.polygon(VATTERN, { renderer: r, color: '#1b4a6e', weight: 1.5, fillColor: '#0e2c46', fillOpacity: 1, interactive: false }));
  LAKES.forEach((l) => add(L.polygon(l.pts, { renderer: r, color: '#1b4a6e', weight: 1, fillColor: '#0e2c46', fillOpacity: 1, interactive: false })));
  add(L.polyline(RIVER, { renderer: r, color: '#1d5a85', weight: 3, interactive: false }));
  ROADS.forEach((rd) => {
    if (rd.major) add(L.polyline(rd.pts, { renderer: r, color: '#3d3524', weight: 6, interactive: false }));
    add(L.polyline(rd.pts, { renderer: r, color: rd.major ? '#a88a52' : '#4a5272', weight: rd.major ? 3.5 : 2, interactive: false }));
  });
  LABELS.forEach((lb) =>
    add(
      L.marker(lb.at, {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({ className: `osm-label k-${lb.kind}`, html: `<span>${lb.name}</span>`, iconSize: [0, 0] }),
      }),
    ),
  );
  return g;
}

export const appleMapsUrl = (lat: number, lng: number, zoom = 14, q?: string) =>
  `https://maps.apple.com/?ll=${lat},${lng}&z=${Math.round(zoom)}${q ? `&q=${encodeURIComponent(q)}` : ''}`;

export const googleMapsUrl = (lat: number, lng: number, zoom = 14, q?: string) =>
  q
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`
    : `https://www.google.com/maps/@${lat},${lng},${Math.round(zoom)}z`;

import L from 'leaflet';

/**
 * Ritar en riktig karta (gator, stigar, vatten, skog, byggnader) direkt i webbläsaren
 * från inbakad OpenStreetMap-data. Behövs i Claude-artefakten där externa kartbilder blockeras.
 * Data: © OpenStreetMap-bidragsgivare, ODbL – se scripts/osm/build_map.py.
 */

export interface OsmData {
  attribution: string;
  q: number;
  bounds: [[number, number], [number, number]];
  layers: Record<string, number[][][]>;
  labels: [string, number, number, string][];
}

interface Feature {
  rings: Float64Array[]; // x,y i pixel vid zoom 0
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

type Style = {
  fill?: string;
  stroke?: string;
  /** linjebredd i px vid zoom 15 */
  width?: number;
  minWidth?: number;
  dash?: number[];
  minZoom?: number;
  casing?: string;
};

const STYLES: [string, Style][] = [
  ['farmland', { fill: '#161a1c' }],
  ['residential', { fill: '#161925' }],
  ['industrial', { fill: '#1a1a24' }],
  ['park', { fill: '#16271f' }],
  ['pitch', { fill: '#1a2e24', stroke: '#24402f', width: 1 }],
  ['wood', { fill: '#122219' }],
  ['wetland', { fill: '#132629' }],
  ['rock', { fill: '#24242a' }],
  ['reserve', { stroke: '#2f6b45', width: 1.6, dash: [6, 5], minZoom: 12 }],
  ['water', { fill: '#0e2a42', stroke: '#16405f', width: 1 }],
  ['river', { stroke: '#174a6d', width: 7, minWidth: 1.5 }],
  ['stream', { stroke: '#174a6d', width: 2.2, minWidth: 0.8, minZoom: 12 }],
  ['dog_park', { fill: 'rgba(245,158,11,.28)', stroke: '#f59e0b', width: 1.5 }],
  ['building', { fill: '#232838', stroke: '#2b3145', width: 0.6, minZoom: 14 }],
  ['rail', { stroke: '#4b4f5e', width: 2, dash: [8, 6], minZoom: 11 }],
  ['track', { stroke: '#5d8a63', width: 1.6, dash: [5, 4], minWidth: 0.7, minZoom: 13 }],
  ['path', { stroke: '#7fc495', width: 1.4, dash: [3, 3], minWidth: 0.7, minZoom: 13 }],
  ['road_service', { stroke: '#2a3043', width: 3, minWidth: 0.6, minZoom: 14 }],
  ['road_minor', { stroke: '#363d55', width: 5, minWidth: 0.7, minZoom: 12 }],
  ['road_tertiary', { stroke: '#4a5272', width: 7, minWidth: 1 }],
  ['road_major', { stroke: '#8c7a55', width: 9, minWidth: 1.4, casing: '#3d3524' }],
  ['road_motorway', { stroke: '#b08a4a', width: 11, minWidth: 1.8, casing: '#4a3a1e' }],
];

const BG = '#10131c';

function decode(data: OsmData) {
  const crs = L.CRS.EPSG3857;
  const out: Record<string, Feature[]> = {};
  for (const [layer, feats] of Object.entries(data.layers)) {
    out[layer] = feats.map((rings) => {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const rs = rings.map((ring) => {
        const arr = new Float64Array(ring.length);
        let lat = 0, lng = 0;
        for (let i = 0; i < ring.length; i += 2) {
          lat += ring[i];
          lng += ring[i + 1];
          const p = crs.latLngToPoint(L.latLng(lat / data.q, lng / data.q), 0);
          arr[i] = p.x;
          arr[i + 1] = p.y;
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        }
        return arr;
      });
      return { rings: rs, minX, minY, maxX, maxY };
    });
  }
  return out;
}

export function createOsmLayer(data: OsmData) {
  const feats = decode(data);
  const Layer = L.GridLayer.extend({
    createTile(coords: L.Coords) {
      const size = this.getTileSize() as L.Point;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const canvas = document.createElement('canvas');
      canvas.width = size.x * dpr;
      canvas.height = size.y * dpr;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, size.x, size.y);

      const z = coords.z;
      const scale = 2 ** z;
      const ox = (coords.x * size.x) / scale;
      const oy = (coords.y * size.y) / scale;
      const pad = 12 / scale;
      const ex = ox + size.x / scale;
      const ey = oy + size.y / scale;
      const zf = 2 ** (z - 15);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const trace = (f: Feature, close: boolean) => {
        ctx.beginPath();
        for (const r of f.rings) {
          ctx.moveTo((r[0] - ox) * scale, (r[1] - oy) * scale);
          for (let i = 2; i < r.length; i += 2) ctx.lineTo((r[i] - ox) * scale, (r[i + 1] - oy) * scale);
          if (close) ctx.closePath();
        }
      };

      for (const [name, st] of STYLES) {
        const list = feats[name];
        if (!list || (st.minZoom && z < st.minZoom)) continue;
        const visible = list.filter((f) => f.maxX >= ox - pad && f.minX <= ex + pad && f.maxY >= oy - pad && f.minY <= ey + pad);
        if (!visible.length) continue;
        const w = Math.max(st.minWidth ?? 0.5, (st.width ?? 1) * zf);
        if (st.fill) {
          ctx.fillStyle = st.fill;
          for (const f of visible) {
            trace(f, true);
            ctx.fill('evenodd');
          }
        }
        if (st.stroke) {
          if (st.casing && z >= 13) {
            ctx.strokeStyle = st.casing;
            ctx.lineWidth = w + 2;
            ctx.setLineDash([]);
            for (const f of visible) {
              trace(f, !!st.fill);
              ctx.stroke();
            }
          }
          ctx.strokeStyle = st.stroke;
          ctx.lineWidth = st.fill ? (st.width ?? 1) : w;
          ctx.setLineDash(st.dash ? st.dash.map((d) => d * Math.max(0.6, Math.min(1.6, zf * 2))) : []);
          for (const f of visible) {
            trace(f, !!st.fill);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);
      return canvas;
    },
  });
  return new (Layer as unknown as new (o: L.GridLayerOptions) => L.GridLayer)({
    attribution: data.attribution,
    minZoom: 10,
    maxZoom: 19,
    keepBuffer: 4,
    updateWhenZooming: false,
  });
}

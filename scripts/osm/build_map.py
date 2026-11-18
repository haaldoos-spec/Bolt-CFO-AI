"""
Bygger appens inbyggda karta från OpenStreetMap-data (© OpenStreetMap-bidragsgivare, ODbL).

  python3 scripts/osm/build_map.py fetch   # hämtar rådata från Overpass till scripts/osm/raw.json
  python3 scripts/osm/build_map.py frompbf omrade.osm.pbf   # alternativ: läs en nedladdad/utklippt .pbf
  python3 scripts/osm/build_map.py build   # skriver src/data/osm-map.json

Utklipp ur Geofabriks Sverigefil (kräver osmium-tool):
  osmium extract -b 14.080,57.735,14.345,57.830 --strategy smart sweden-latest.osm.pbf -o omrade.osm.pbf

Kartan ritas sedan i appen av src/lib/osmLayer.ts (en Leaflet GridLayer), så inga
externa kartbilder behövs – det krävs inne i Claude-artefakten.
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from shapely.geometry import LineString, MultiPolygon, Polygon, box, mapping
from shapely.ops import linemerge, polygonize, unary_union

HERE = Path(__file__).parent
RAW = HERE / 'raw.json'
OUT = HERE.parent.parent / 'src' / 'data' / 'osm-map.json'

# Detaljerat område: Huskvarna. Bredare område: Jönköping–Huskvarna.
DETAIL = (57.755, 14.215, 57.822, 14.345)  # S, W, N, E
WIDE = (57.735, 14.080, 57.830, 14.345)

Q = 100000  # 5 decimaler (~1 m)


def bb(b):
    return f'{b[0]},{b[1]},{b[2]},{b[3]}'


QUERY = f"""
[out:json][timeout:240];
(
  way["highway"~"motorway|trunk|primary|secondary|tertiary|motorway_link|trunk_link|primary_link|secondary_link"]({bb(WIDE)});
  way["highway"]({bb(DETAIL)});
  way["building"]({bb(DETAIL)});
  way["natural"~"^(water|wood|scrub|heath|wetland|grassland|bare_rock|beach|sand)$"]({bb(WIDE)});
  way["landuse"~"^(forest|residential|grass|meadow|farmland|industrial|commercial|retail|cemetery|allotments|recreation_ground|village_green|orchard)$"]({bb(WIDE)});
  way["leisure"~"^(park|pitch|playground|nature_reserve|garden|dog_park|golf_course|sports_centre|track)$"]({bb(WIDE)});
  way["waterway"~"^(river|stream|canal)$"]({bb(WIDE)});
  way["railway"="rail"]({bb(WIDE)});
  relation["natural"~"^(water|wood|wetland)$"]({bb(WIDE)});
  relation["landuse"~"^(forest|residential|industrial)$"]({bb(WIDE)});
  relation["leisure"~"^(park|nature_reserve)$"]({bb(WIDE)});
  node["place"~"^(suburb|neighbourhood|quarter|village|town|city|hamlet|locality)$"]({bb(WIDE)});
  node["leisure"="dog_park"]({bb(WIDE)});
);
out geom;
"""


def fetch():
    data = urllib.parse.urlencode({'data': QUERY}).encode()
    endpoint = os.environ.get('OVERPASS_URL', 'https://overpass.kumi.systems/api/interpreter')
    req = urllib.request.Request(endpoint, data=data, headers={'User-Agent': 'labbeliv-map-builder'})
    with urllib.request.urlopen(req, timeout=300) as r:
        RAW.write_bytes(r.read())
    print('raw', RAW.stat().st_size // 1024, 'kB')


def in_box(lat, lon, b):
    return b[0] <= lat <= b[2] and b[1] <= lon <= b[3]


MAJOR_HW = {'motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link'}


def frompbf(path):
    """Läser en .osm.pbf och skriver raw.json i samma form som Overpass `out geom`."""
    import osmium

    ways = {}
    rels = []
    nodes = []

    class H(osmium.SimpleHandler):
        def node(self, n):
            t = dict(n.tags)
            if ('place' in t or t.get('leisure') == 'dog_park') and n.location.valid() and in_box(n.location.lat, n.location.lon, WIDE):
                nodes.append({'type': 'node', 'id': n.id, 'lat': n.location.lat, 'lon': n.location.lon, 'tags': t})

        def way(self, w):
            try:
                geom = [{'lat': nd.location.lat, 'lon': nd.location.lon} for nd in w.nodes]
            except osmium.InvalidLocationError:
                return
            ways[w.id] = (dict(w.tags), geom)

        def relation(self, r):
            t = dict(r.tags)
            if t.get('type') == 'multipolygon' and classify(t):
                rels.append((r.id, t, [(m.ref, m.role) for m in r.members if m.type == 'w']))

    H().apply_file(path, locations=True, idx='flex_mem')

    els = list(nodes)
    for wid, (t, geom) in ways.items():
        if not t or not classify(t):
            continue
        hw = t.get('highway')
        box_ = DETAIL if (t.get('building') or (hw and hw not in MAJOR_HW)) else WIDE
        if not any(in_box(p['lat'], p['lon'], box_) for p in geom):
            continue
        els.append({'type': 'way', 'id': wid, 'tags': t, 'geometry': geom})
    for rid, t, members in rels:
        mem = [{'type': 'way', 'ref': ref, 'role': role, 'geometry': ways[ref][1]} for ref, role in members if ref in ways]
        if mem:
            els.append({'type': 'relation', 'id': rid, 'tags': t, 'members': mem})
    RAW.write_text(json.dumps({'elements': els}))
    print('raw', RAW.stat().st_size // 1024, 'kB', len(els), 'element')


def classify(t):
    """Returnerar (lager, typ) eller None. typ: 'area' | 'line'."""
    hw = t.get('highway')
    if hw:
        if t.get('area') == 'yes':
            return None
        if hw in ('motorway', 'trunk', 'motorway_link', 'trunk_link'):
            return 'road_motorway', 'line'
        if hw in ('primary', 'secondary', 'primary_link', 'secondary_link'):
            return 'road_major', 'line'
        if hw in ('tertiary', 'tertiary_link'):
            return 'road_tertiary', 'line'
        if hw in ('residential', 'unclassified', 'living_street', 'road', 'pedestrian'):
            return 'road_minor', 'line'
        if hw == 'service':
            return 'road_service', 'line'
        if hw in ('footway', 'path', 'cycleway', 'bridleway', 'steps'):
            return 'path', 'line'
        if hw == 'track':
            return 'track', 'line'
        return None
    if t.get('building'):
        return 'building', 'area'
    if t.get('leisure') == 'dog_park':
        return 'dog_park', 'area'
    if t.get('waterway') in ('river', 'canal'):
        return 'river', 'line'
    if t.get('waterway') == 'stream':
        return 'stream', 'line'
    if t.get('railway') == 'rail':
        return 'rail', 'line'
    n, lu, le = t.get('natural'), t.get('landuse'), t.get('leisure')
    if n == 'water':
        return 'water', 'area'
    if n == 'wetland':
        return 'wetland', 'area'
    if n in ('wood', 'scrub', 'heath') or lu == 'forest':
        return 'wood', 'area'
    if n in ('bare_rock', 'beach', 'sand'):
        return 'rock', 'area'
    if lu in ('grass', 'meadow', 'village_green', 'recreation_ground', 'allotments', 'orchard') or n == 'grassland' or le in ('park', 'garden', 'playground', 'golf_course'):
        return 'park', 'area'
    if le in ('pitch', 'sports_centre', 'track'):
        return 'pitch', 'area'
    if lu == 'cemetery':
        return 'park', 'area'
    if lu == 'farmland':
        return 'farmland', 'area'
    if lu in ('industrial', 'commercial', 'retail'):
        return 'industrial', 'area'
    if lu == 'residential':
        return 'residential', 'area'
    if le == 'nature_reserve':
        return 'reserve', 'area'
    return None


def way_coords(el):
    return [(p['lon'], p['lat']) for p in el.get('geometry', []) if p]


def relation_polys(el):
    outers, inners = [], []
    for m in el.get('members', []):
        if m.get('type') != 'way' or not m.get('geometry'):
            continue
        ls = [(p['lon'], p['lat']) for p in m['geometry'] if p]
        if len(ls) < 2:
            continue
        (inners if m.get('role') == 'inner' else outers).append(LineString(ls))
    if not outers:
        return None
    outer = unary_union(list(polygonize(linemerge(outers))))
    if inners:
        hole = unary_union(list(polygonize(linemerge(inners))))
        outer = outer.difference(hole)
    return outer


def enc(coords):
    """Delta-kodade heltal: [lat0, lng0, dlat, dlng, ...]"""
    out, plat, plng = [], 0, 0
    for lng, lat in coords:
        a, b = round(lat * Q), round(lng * Q)
        out += [a - plat, b - plng]
        plat, plng = a, b
    return out


def build():
    raw = json.loads(RAW.read_text())
    wide = box(WIDE[1], WIDE[0], WIDE[3], WIDE[2])
    layers: dict[str, list] = {}
    labels = []
    seen = set()

    def add(layer, geom):
        if geom.is_empty:
            return
        geom = geom.simplify(0.000012, preserve_topology=True)
        geoms = getattr(geom, 'geoms', [geom])
        for g in geoms:
            if isinstance(g, Polygon):
                if g.area < 1e-9:
                    continue
                rings = [enc(list(g.exterior.coords))] + [enc(list(r.coords)) for r in g.interiors]
                layers.setdefault(layer, []).append(rings)
            elif isinstance(g, LineString):
                if len(g.coords) < 2:
                    continue
                layers.setdefault(layer, []).append([enc(list(g.coords))])

    for el in raw['elements']:
        t = el.get('tags', {})
        key = (el['type'], el['id'])
        if key in seen:
            continue
        seen.add(key)
        if el['type'] == 'node':
            name = t.get('name')
            if t.get('leisure') == 'dog_park':
                labels.append([name or 'Hundrastgård', el['lat'], el['lon'], 'dog_park'])
            elif name:
                labels.append([name, el['lat'], el['lon'], t.get('place', 'place')])
            continue
        c = classify(t)
        if not c:
            continue
        layer, kind = c
        try:
            if el['type'] == 'relation':
                g = relation_polys(el)
                if g is None:
                    continue
            else:
                pts = way_coords(el)
                if len(pts) < 2:
                    continue
                if kind == 'area':
                    if len(pts) < 4 or pts[0] != pts[-1]:
                        continue
                    g = Polygon(pts)
                    if not g.is_valid:
                        g = g.buffer(0)
                else:
                    g = LineString(pts)
            g = g.intersection(wide)
        except Exception as e:  # trasig geometri – hoppa över
            print('skip', key, e)
            continue
        add(layer, g)
        if layer == 'dog_park':
            cp = g.representative_point()
            labels.append([t.get('name') or 'Hundrastgård', cp.y, cp.x, 'dog_park'])
        if layer == 'water' and t.get('name') and g.area > 2e-6:
            cp = g.representative_point()
            labels.append([t['name'], cp.y, cp.x, 'water'])

    out = {
        'attribution': '© OpenStreetMap-bidragsgivare (ODbL)',
        'q': Q,
        'bounds': [[WIDE[0], WIDE[1]], [WIDE[2], WIDE[3]]],
        'layers': layers,
        'labels': labels,
    }
    OUT.write_text(json.dumps(out, separators=(',', ':'), ensure_ascii=False))
    print('out', OUT.stat().st_size // 1024, 'kB', {k: len(v) for k, v in layers.items()}, 'labels', len(labels))


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'frompbf':
        frompbf(sys.argv[2])
    else:
        {'fetch': fetch, 'build': build}[cmd]()

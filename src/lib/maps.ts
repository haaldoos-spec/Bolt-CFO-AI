/**
 * Länkar till riktiga kartappar och tolkning av delade kartlänkar
 * (Apple Kartor: Dela → Kopiera, Google Maps: Dela → Kopiera länk).
 */

/*
 * Apple Kartors länkformat (maps.apple.com/place, /search, /directions) fungerar både i
 * Kartor-appen och på webben. destination kan vara koordinater "lat,lng" eller en söktext.
 */
export type TravelMode = 'driving' | 'walking';

export const appleMapsSearchUrl = (query: string) => `https://maps.apple.com/search?query=${encodeURIComponent(query)}`;

export const appleMapsPlaceAtUrl = (lat: number, lng: number, name?: string) =>
  `https://maps.apple.com/place?coordinate=${lat},${lng}${name ? `&name=${encodeURIComponent(name)}` : ''}`;

export const appleMapsDirectionsUrl = (destination: string, mode: TravelMode = 'driving') =>
  `https://maps.apple.com/directions?destination=${encodeURIComponent(destination)}&mode=${mode}`;

export const googleMapsPlaceUrl = (name: string, town = 'Huskvarna') =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name.includes(town) ? name : `${name}, ${town}`)}`;

export interface ParsedMapsLink {
  url: string;
  name?: string;
  lat?: number;
  lng?: number;
  source: 'apple' | 'google' | 'annan';
}

const pair = (v: string | null | undefined): [number, number] | undefined => {
  if (!v) return undefined;
  const m = decodeURIComponent(v).match(/(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : undefined;
};

/** Hittar en kartlänk i inklistrad text och plockar ut namn och koordinater när de finns */
export function parseMapsLink(text: string): ParsedMapsLink | null {
  const urlMatch = text.match(/https?:\/\/[^\s<>"]+/);
  if (!urlMatch) return null;
  const raw = urlMatch[0].replace(/[),.]+$/, '');
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, '');
  const rest = text.replace(urlMatch[0], '').split('\n').map((l) => l.trim()).filter(Boolean);
  const textName = rest.find((l) => !/^https?:/.test(l) && l.length < 80);
  const out: ParsedMapsLink = { url: raw, source: 'annan' };

  if (host.includes('maps.apple')) {
    out.source = 'apple';
    const p = u.searchParams;
    const c = pair(p.get('coordinate')) ?? pair(p.get('ll')) ?? pair(p.get('sll')) ?? pair(p.get('q'));
    if (c) [out.lat, out.lng] = c;
    const name = p.get('name') ?? p.get('q') ?? p.get('address') ?? undefined;
    if (name && !pair(name)) out.name = name;
  } else if (host.includes('google') || host.includes('goo.gl')) {
    out.source = 'google';
    const at = u.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ?? raw.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const c = at ? ([Number(at[1]), Number(at[2])] as [number, number]) : pair(u.searchParams.get('q')) ?? pair(u.searchParams.get('query'));
    if (c) [out.lat, out.lng] = c;
    const place = u.pathname.match(/\/place\/([^/]+)/);
    if (place) out.name = decodeURIComponent(place[1].replace(/\+/g, ' '));
    const q = u.searchParams.get('q') ?? u.searchParams.get('query');
    if (!out.name && q && !pair(q)) out.name = q;
  }
  if (!out.name && textName) out.name = textName;
  if (out.lat !== undefined && (Math.abs(out.lat) > 90 || Math.abs(out.lng ?? 0) > 180)) {
    out.lat = undefined;
    out.lng = undefined;
  }
  return out;
}

/**
 * Länkar till riktiga kartappar och tolkning av delade kartlänkar
 * (Apple Kartor: Dela → Kopiera, Google Maps: Dela → Kopiera länk).
 */

/*
 * Apple Kartor via det klassiska länkformatet (maps.apple.com/?…), som Kartor-appen på
 * iPhone alltid förstår. Koordinater skickas okodade ("57.79,14.28"); söktext URL-kodas.
 */
export type TravelMode = 'driving' | 'walking';

const enc = (v: string) => (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(v) ? v : encodeURIComponent(v));

export const appleMapsSearchUrl = (query: string) => `https://maps.apple.com/?q=${enc(query)}`;

export const appleMapsPlaceAtUrl = (lat: number, lng: number, name?: string) =>
  `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(name ?? 'Plats')}`;

export const appleMapsDirectionsUrl = (destination: string, mode: TravelMode = 'driving') =>
  `https://maps.apple.com/?daddr=${enc(destination)}&dirflg=${mode === 'walking' ? 'w' : 'd'}`;

/** Google Maps-vägbeskrivning – fungerar i alla webbläsare på datorn */
export const googleMapsDirectionsUrl = (destination: string, mode: TravelMode = 'driving') =>
  `https://www.google.com/maps/dir/?api=1&destination=${enc(destination)}&travelmode=${mode}`;

export const googleMapsSearchUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${enc(query)}`;

/** iPhone/iPad öppnar Apple Kartor-appen. På datorn används Google Maps, som fungerar i alla webbläsare. */
export const isAppleMobile = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
};

export const mapsAppName = () => (isAppleMobile() ? 'Apple Kartor' : 'Google Maps');

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
    // coordinate/ll är platsens position. sll är bara sökområdet och används inte.
    const c = pair(p.get('coordinate')) ?? pair(p.get('ll')) ?? pair(p.get('q')) ?? pair(p.get('daddr'));
    if (c) [out.lat, out.lng] = c;
    const name = p.get('name') ?? p.get('q') ?? p.get('address') ?? undefined;
    if (name && !pair(name)) out.name = name;
  } else if (host.includes('google') || host.includes('goo.gl')) {
    out.source = 'google';
    // Platsens egen position ligger i "!3d<lat>!4d<lng>". "@lat,lng" är bara kartans mittpunkt
    // (där man råkade titta) och används bara som sista utväg.
    const pinMatches = [...raw.matchAll(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/g)];
    const pin = pinMatches.length ? pinMatches[pinMatches.length - 1] : null;
    const pathPair = decodeURIComponent(u.pathname).match(/\/(?:search|place|dir\/[^/]*)\/(-?\d{1,3}\.\d+),\s*\+?(-?\d{1,3}\.\d+)/);
    const at = raw.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const c: [number, number] | undefined = pin
      ? [Number(pin[1]), Number(pin[2])]
      : pathPair
        ? [Number(pathPair[1]), Number(pathPair[2])]
        : pair(u.searchParams.get('q')) ?? pair(u.searchParams.get('query')) ?? pair(u.searchParams.get('destination')) ?? pair(u.searchParams.get('ll')) ??
          (at ? [Number(at[1]), Number(at[2])] : undefined);
    if (c) [out.lat, out.lng] = c;
    const place = u.pathname.match(/\/place\/([^/]+)/);
    if (place) {
      const n = decodeURIComponent(place[1].replace(/\+/g, ' '));
      // Utplacerad nål ger koordinater som namn (t.ex. 57°47'25"N) – hoppa över dem
      if (!/°|^-?\d+\.\d+,/.test(n)) out.name = n;
    }
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

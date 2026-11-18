import type { Place } from '../types';
import { HOME_LABEL } from '../data/places';
import { appleMapsDirectionsUrl, appleMapsPlaceAtUrl, appleMapsSearchUrl, googleMapsDirectionsUrl, googleMapsSearchUrl, isAppleMobile, type TravelMode } from './maps';

/** Söktext för platser utan exakt position */
export const queryFor = (p: Place) => p.mapsQuery ?? `${p.name}, ${HOME_LABEL}`;

/** Målet för kartappen: egna platser med exakt position, annars söktext */
export const destinationFor = (p: Place) => {
  if (p.custom && !p.noCoords) return `${p.lat},${p.lng}`;
  if (p.custom) return p.address ?? (/,/.test(p.name) ? p.name : `${p.name}, ${HOME_LABEL}`);
  return queryFor(p);
};

/** Visa platsen – Apple Kartor på iPhone, Google Maps på datorn */
export const mapsLinkFor = (p: Place) => {
  if (!isAppleMobile()) return p.mapsUrl?.includes('google') ? p.mapsUrl : googleMapsSearchUrl(destinationFor(p));
  if (p.custom) return p.noCoords ? (p.mapsUrl || appleMapsSearchUrl(destinationFor(p))) : appleMapsPlaceAtUrl(p.lat, p.lng, p.name);
  return appleMapsSearchUrl(queryFor(p));
};

/** Vägbeskrivning dit – det som öppnas när man trycker på en plats */
export const directionsFor = (p: Place, mode: TravelMode = 'driving') => {
  // Kort delningslänk utan position eller adress: öppna länken själv – den visar exakt rätt plats
  if (p.custom && p.noCoords && !p.address && p.mapsUrl) return p.mapsUrl;
  return isAppleMobile() ? appleMapsDirectionsUrl(destinationFor(p), mode) : googleMapsDirectionsUrl(destinationFor(p), mode);
};


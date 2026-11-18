import type { Place, PlaceCategory } from '../types';

export const PLACE_CATS: Record<PlaceCategory, { label: string; color: string; icon: string }> = {
  skog: { label: 'Skog & Spår', color: '#4ade80', icon: 'Trees' },
  balans: { label: 'Balans & Natur', color: '#f0abfc', icon: 'Mountain' },
  cafe: { label: 'Café & Miljöträning', color: '#fdba74', icon: 'Coffee' },
  vatten: { label: 'Vatten & Apportering', color: '#67e8f9', icon: 'Waves' },
};

/** Mitt emellan Jönköping och Huskvarna */
export const DEFAULT_CENTER: [number, number] = [57.7700, 14.2050];
export const HOME_LABEL = 'Jönköping/Huskvarna';

// Koordinaterna är ungefärliga – kolla alltid lokala regler för koppeltvång och hundbad.
export const PLACES: Place[] = [
  { id: 'p-bymarken', name: 'Bymarken', category: 'skog', lat: 57.7745, lng: 14.1180, description: 'Stort friluftsområde i västra Jönköping med motionsspår och barrskog. Perfekt för spår och sniffari.', goodFor: ['Spår', 'Sniffari', 'Långlina'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-stromsberg', name: 'Strömsbergs friluftsområde', category: 'skog', lat: 57.7690, lng: 14.2010, description: 'Skog och elljusspår mellan Jönköping och Huskvarna. Bra för spår på morgonen och kvällspromenader.', goodFor: ['Spår', 'Nosarbete', 'Inkallning'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-dunkehallar', name: 'Dunkehallar', category: 'skog', lat: 57.7740, lng: 14.1450, description: 'Naturreservat med bäckravin, lövskog och smala stigar. Mycket dofter – och mycket att balansera på.', goodFor: ['Sök', 'Balans', 'Spår'], seniorFriendly: false, puppyFriendly: true },
  { id: 'p-adalen', name: 'Huskvarnaån – Ådalen', category: 'skog', lat: 57.7850, lng: 14.2900, description: 'Promenad längs forsande Huskvarnaån. Ljud från vattnet är bra miljöträning för valpen.', goodFor: ['Ljudsafari', 'Slakt koppel', 'Sniffari'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-rocksjon', name: 'Rocksjöns naturreservat', category: 'balans', lat: 57.7790, lng: 14.1840, description: 'Våtmark mitt i stan med spänger, fågelliv och gräsytor. Underlagsträning och passivitet med fåglar i närheten.', goodFor: ['Nya underlag', 'Passivitet', 'Balans'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-stadsparken', name: 'Stadsparken Jönköping', category: 'balans', lat: 57.7860, lng: 14.1480, description: 'Kuperad park med utsikt över Vättern, stenar och trappor. Kroppskontroll och miljö i samma promenad.', goodFor: ['Klätterklossen', 'Cavaletti', 'Utsikt'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-taberg', name: 'Tabergs topp', category: 'balans', lat: 57.6800, lng: 14.0870, description: 'Berg söder om Jönköping med hällmark och vidsträckt utsikt. Äventyr för valpen – välj lugna stigar för senioren.', goodFor: ['Äventyr', 'Nya underlag', 'Grill-quest'], seniorFriendly: false, puppyFriendly: true },
  { id: 'p-strandpromenaden', name: 'Strandpromenaden Jönköping', category: 'cafe', lat: 57.7870, lng: 14.1680, description: 'Vätterstranden med caféer, joggare, cyklar och barnvagnar. Perfekt för café-quest och socialisering.', goodFor: ['Café-quest', 'Socialisering', 'Bänk-quest'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-resecentrum', name: 'Jönköpings resecentrum', category: 'cafe', lat: 57.7835, lng: 14.1590, description: 'Bussar, tåg och mycket folk. Börja på avstånd och belöna lugn – bra inför första bussresan.', goodFor: ['Buss-quest', 'Ljudsafari', 'Möt människor'], seniorFriendly: false, puppyFriendly: true },
  { id: 'p-huskvarna-c', name: 'Huskvarna centrum', category: 'cafe', lat: 57.7870, lng: 14.2760, description: 'Lagom mycket stadsliv med caféer och bänkar. Ett lugnare alternativ till Jönköping city.', goodFor: ['Café-quest', 'Slakt koppel', 'Bänk-quest'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-munksjon', name: 'Munksjön runt', category: 'vatten', lat: 57.7700, lng: 14.1560, description: 'Promenadstråk runt sjön med bryggor. Träna vattenstadga och apport på land med vatten i närheten.', goodFor: ['Vattenstadga', 'Apport', 'Brygga'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-vattern-husk', name: 'Vätterstranden Huskvarna', category: 'vatten', lat: 57.7955, lng: 14.2700, description: 'Långgrunda partier längs Vättern. Bra för första plasket och skonsam simning – kolla skyltning för hundbad.', goodFor: ['Simning', 'Första plasket', 'Dubbel-apport'], seniorFriendly: true, puppyFriendly: true },
];

export const distanceKm = (a: [number, number], b: [number, number]) => {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

import type { Place, PlaceCategory } from '../types';

export const PLACE_CATS: Record<PlaceCategory, { label: string; color: string; icon: string }> = {
  skog: { label: 'Skog & Spår', color: '#4ade80', icon: 'Trees' },
  balans: { label: 'Balans & Natur', color: '#f0abfc', icon: 'Mountain' },
  cafe: { label: 'Café & Miljöträning', color: '#fdba74', icon: 'Coffee' },
  vatten: { label: 'Vatten & Apportering', color: '#67e8f9', icon: 'Waves' },
};

export const DEFAULT_CENTER: [number, number] = [59.3185, 18.1050];

export const PLACES: Place[] = [
  { id: 'p-nacka', name: 'Nackareservatet – Velamsund', category: 'skog', lat: 59.2965, lng: 18.1590, description: 'Mjuka stigar, mossa och tallskog. Perfekt för spår på morgonen.', goodFor: ['Spår', 'Nosarbete', 'Sniffari'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-hellas', name: 'Hellasgården', category: 'vatten', lat: 59.2896, lng: 18.1593, description: 'Långgrund strand vid Källtorpssjön. Bra för första plasket och skonsam simning.', goodFor: ['Simning', 'Apport', 'Vattenstadga'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-judarn', name: 'Judarskogen', category: 'skog', lat: 59.3420, lng: 17.9230, description: 'Naturreservat med blandskog och gott om liggande stockar.', goodFor: ['Spår', 'Balans', 'Sök'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-djurg', name: 'Djurgården – Lill-Jansskogen', category: 'balans', lat: 59.3570, lng: 18.0700, description: 'Stenhällar, stubbar och låga stockar. Bra kroppskontroll-terräng.', goodFor: ['Balans', 'Klätterklossen', 'Cavaletti'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-sodermalm', name: 'Café på Södermalm', category: 'cafe', lat: 59.3155, lng: 18.0710, description: 'Hundvänligt café med uteservering. Lagom mycket folk för miljöträning.', goodFor: ['Passivitet', 'Socialisering', 'Café-quest'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-hornstull', name: 'Hornstulls strand', category: 'cafe', lat: 59.3150, lng: 18.0340, description: 'Cyklar, barnvagnar, båtar och marknad på helger. Utmärkt miljöträning.', goodFor: ['Ljudsafari', 'Möt människor', 'Slakt koppel'], seniorFriendly: false, puppyFriendly: true },
  { id: 'p-tyresta', name: 'Tyresta nationalpark', category: 'balans', lat: 59.1730, lng: 18.2950, description: 'Hällmarker, urskog och spänger. Underlagsträning i världsklass.', goodFor: ['Nya underlag', 'Balans', 'Äventyr'], seniorFriendly: false, puppyFriendly: true },
  { id: 'p-flaten', name: 'Flatenbadet (hundbad)', category: 'vatten', lat: 59.2500, lng: 18.1570, description: 'Rofylld sjö med bryggor. Träna vattenstadga och dubbel-apport.', goodFor: ['Simning', 'Dubbel-apport', 'Brygga'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-gardet', name: 'Gärdet', category: 'balans', lat: 59.3460, lng: 18.0980, description: 'Öppna gräsytor och kullar. Bra för långlina och inkallning.', goodFor: ['Inkallning', 'Långlina', 'Lek'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-hammarby', name: 'Hammarby sjöstad – kajen', category: 'cafe', lat: 59.3040, lng: 18.0960, description: 'Kajer, spårvagn och caféer. Gott om miljö, gott om bänkar.', goodFor: ['Bänk-quest', 'Socialisering', 'Spårvagn'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-bagarmossen', name: 'Bagarmossens skog', category: 'skog', lat: 59.2780, lng: 18.1300, description: 'Lugn skog med få möten. Bra för nybörjarspår och rumsök utomhus.', goodFor: ['Spår', 'Utomhussök'], seniorFriendly: true, puppyFriendly: true },
  { id: 'p-langholmen', name: 'Långholmen', category: 'vatten', lat: 59.3220, lng: 18.0260, description: 'Klippor och små vikar. Senioren kan simma från en flat klippa.', goodFor: ['Simning', 'Apport'], seniorFriendly: true, puppyFriendly: true },
];

export const distanceKm = (a: [number, number], b: [number, number]) => {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

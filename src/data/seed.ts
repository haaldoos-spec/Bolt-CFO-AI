import type { AppState } from '../types';
import { DEFAULT_DOGS } from './profiles';

const daysAgo = (d: number, h = 9) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, 15, 0, 0);
  return t.toISOString();
};

export const seedState = (): AppState => ({
  dogs: structuredClone(DEFAULT_DOGS),
  xp: { senior: 1340, puppy: 610 },
  completed: {
    senior: ['v-kontakt', 'v-sitt-stanna', 'v-skvaller', 'v-linforing', 'v-inkallning', 'v-passivitet', 'v-kedja-promenad', 'r-fot-vanster', 'r-sitt-ligg', 'r-runt', 's-fotsteg', 's-vinkel', 'k-lada', 'k-doft', 'k-rum', 't-apport-grepp', 't-snurr', 't-tass', 't-stada', 'a-balans', 'a-cavaletti', 't-stretch'],
    puppy: ['v-kontakt', 'v-skvaller', 'v-passivitet', 'k-lada', 'a-balans', 't-snurr', 's-fotsteg'],
  },
  sessions: [
    { id: 's1', date: daysAgo(1, 15), dogs: ['puppy'], discipline: 'vardag', minutes: 45, intensity: 3, ratings: { puppy: 4 }, title: 'Miljöträning i stan – buss & torg', note: 'Lite överladdad mot slutet, men kanonbra på bussen!' },
    { id: 's2', date: daysAgo(1, 8), dogs: ['senior'], discipline: 'sok', minutes: 20, intensity: 1, ratings: { senior: 5 }, title: 'Rumsök med 2 gömmor', note: 'Superfokuserad. Hittade båda på under minuten.' },
    { id: 's3', date: daysAgo(2, 17), dogs: ['senior', 'puppy'], discipline: 'vardag', minutes: 30, intensity: 2, ratings: { senior: 4, puppy: 3 }, title: 'Passivitet & turordning', note: 'Valpen gnällde lite på filten.' },
    { id: 's4', date: daysAgo(3, 10), dogs: ['senior'], discipline: 'spar', minutes: 30, intensity: 1, ratings: { senior: 5 }, title: 'Spår 200 m med vinkel' },
    { id: 's5', date: daysAgo(4, 16), dogs: ['puppy'], discipline: 'agility', minutes: 15, intensity: 2, ratings: { puppy: 4 }, title: 'Balansplatta & tunnel' },
    { id: 's6', date: daysAgo(6, 9), dogs: ['senior', 'puppy'], discipline: 'tricks', minutes: 15, intensity: 1, ratings: { senior: 5, puppy: 4 }, title: 'Trickkväll' },
  ],
  checkins: [
    { id: 'c1', placeId: 'p-hellas', placeName: 'Hellasgården', lat: 59.2896, lng: 18.1593, date: daysAgo(2, 12), dogs: ['senior', 'puppy'], note: 'Valpens första plask! Senioren visade hur man gör 🥹', questTitle: 'Första plasket' },
    { id: 'c2', placeId: 'p-sodermalm', placeName: 'Café på Södermalm', lat: 59.3155, lng: 18.0710, date: daysAgo(5, 14), dogs: ['puppy'], note: '3 min stanna-kvar under bordet. Fick beröm av servitrisen.' },
    { id: 'c3', placeId: 'p-nacka', placeName: 'Nackareservatet – Velamsund', lat: 59.2965, lng: 18.1590, date: daysAgo(9, 9), dogs: ['senior'], note: 'Morgonspår i dimman. Magiskt.' },
    { id: 'c4', placeId: 'p-gardet', placeName: 'Gärdet', lat: 59.3460, lng: 18.0980, date: daysAgo(21, 11), dogs: ['senior', 'puppy'], note: 'Långlina och inkallning med visselpipan.' },
    { id: 'c5', placeId: 'p-djurg', placeName: 'Djurgården – Lill-Jansskogen', lat: 59.3570, lng: 18.0700, date: daysAgo(48, 13), dogs: ['puppy'], note: 'Första dagen hemma-veckan: stubbe-klättring!' },
  ],
  questsDone: [
    { id: 'qd1', questId: 'q-plask', date: daysAgo(2, 12), profile: 'puppy' },
    { id: 'qd2', questId: 'q-cafe', date: daysAgo(5, 14), profile: 'puppy' },
  ],
});

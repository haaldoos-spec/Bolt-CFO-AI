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
  seedVersion: 2,
  xp: { senior: 1340, puppy: 0 },
  completed: {
    senior: ['v-kontakt', 'v-sitt-stanna', 'v-skvaller', 'v-linforing', 'v-inkallning', 'v-passivitet', 'v-kedja-promenad', 'r-fot-vanster', 'r-sitt-ligg', 'r-runt', 's-fotsteg', 's-vinkel', 'k-lada', 'k-doft', 'k-rum', 't-apport-grepp', 't-snurr', 't-tass', 't-stada', 'a-balans', 'a-cavaletti', 't-stretch'],
    puppy: [],
  },
  sessions: [
    { id: 's1', date: daysAgo(0, 8), dogs: ['puppy'], discipline: 'vardag', minutes: 5, intensity: 1, ratings: { puppy: 5 }, title: 'Första dagen: namnet och kisspauser', note: 'Kyle tittade upp på sitt namn tre gånger! Sov resten av förmiddagen.' },
    { id: 's2', date: daysAgo(1, 8), dogs: ['senior'], discipline: 'sok', minutes: 20, intensity: 1, ratings: { senior: 5 }, title: 'Rumsök med 2 gömmor', note: 'Superfokuserad. Hittade båda på under minuten.' },
    { id: 's3', date: daysAgo(2, 17), dogs: ['senior'], discipline: 'vardag', minutes: 15, intensity: 1, ratings: { senior: 5 }, title: 'Passivitet på filten', note: 'Övning inför att valpen kommer hem.' },
    { id: 's4', date: daysAgo(3, 10), dogs: ['senior'], discipline: 'spar', minutes: 30, intensity: 1, ratings: { senior: 5 }, title: 'Spår 200 m med vinkel' },
    { id: 's5', date: daysAgo(4, 16), dogs: ['senior'], discipline: 'agility', minutes: 10, intensity: 1, ratings: { senior: 4 }, title: 'Cavaletti & balansplatta' },
    { id: 's6', date: daysAgo(6, 9), dogs: ['senior'], discipline: 'tricks', minutes: 15, intensity: 1, ratings: { senior: 5 }, title: 'Trickkväll' },
  ],
  checkins: [
    { id: 'c1', placeId: 'p-vattern-husk', placeName: 'Vätterstranden Huskvarna', lat: 57.7958, lng: 14.2706, date: daysAgo(2, 12), dogs: ['senior'], note: 'Zeppelin simmade två korta pass. Kall novemberluft – handduk och massage efteråt.' },
    { id: 'c2', placeId: 'p-huskvarna-c', placeName: 'Huskvarna centrum', lat: 57.7873, lng: 14.2755, date: daysAgo(5, 14), dogs: ['senior'], note: 'Fika med Zeppelin på filten under bordet.' },
    { id: 'c3', placeId: 'p-oxnehaga', placeName: 'Öxnehaga skogsområde', lat: 57.7864, lng: 14.3124, date: daysAgo(9, 9), dogs: ['senior'], note: 'Morgonspår i dimman. Magiskt.' },
    { id: 'c4', placeId: 'p-stromsberg', placeName: 'Strömsbergs friluftsområde', lat: 57.7694, lng: 14.2004, date: daysAgo(21, 11), dogs: ['senior'], note: 'Långlina och inkallning med visselpipan.' },
    { id: 'c5', placeName: 'Hemma i Huskvarna', lat: 57.7905, lng: 14.2795, date: daysAgo(0, 11), dogs: ['senior', 'puppy'], note: 'Kyle har kommit hem! Första mötet med Zeppelin i trädgården gick lugnt.' },
  ],
  myPlaces: [],
  puppyGuide: [],
  questsDone: [],
});

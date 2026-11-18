import type { AppState } from '../types';
import { DEFAULT_DOGS } from './profiles';

/** Id:n på exempeldata som tidigare versioner av appen lade in (rensas bort) */
export const DEMO_IDS = new Set(['s1', 's2', 's3', 's4', 's5', 's6', 'c1', 'c2', 'c3', 'c4', 'c5', 'qd1', 'qd2']);

/** Övningar som exempeldatan förbockade för senioren */
export const DEMO_COMPLETED_SENIOR = ['v-kontakt', 'v-sitt-stanna', 'v-skvaller', 'v-linforing', 'v-inkallning', 'v-passivitet', 'v-kedja-promenad', 'r-fot-vanster', 'r-sitt-ligg', 'r-runt', 's-fotsteg', 's-vinkel', 'k-lada', 'k-doft', 'k-rum', 't-apport-grepp', 't-snurr', 't-tass', 't-stada', 'a-balans', 'a-cavaletti', 't-stretch'];

/** Tom start – inga exempelpass, minnen eller poäng */
export const seedState = (): AppState => ({
  dogs: structuredClone(DEFAULT_DOGS),
  seedVersion: 4,
  xp: { senior: 0, puppy: 0 },
  completed: { senior: [], puppy: [] },
  sessions: [],
  checkins: [],
  myPlaces: [],
  puppyGuide: [],
  questsDone: [],
  customPasses: [],
  customExercises: [],
});

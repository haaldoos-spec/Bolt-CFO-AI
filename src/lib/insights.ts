import type { AppState, DisciplineId, DogId, SessionRecord } from '../types';
import { ageMonths } from './coach';
import { daysUntilHome } from '../data/profiles';

/**
 * Avancerade nyckeltal räknade ur de loggade passen. Läser bara data – ändrar ingenting.
 */

const DAY = 864e5;
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const sessionsFor = (s: AppState, dog: DogId) => s.sessions.filter((x) => x.dogs.includes(dog));
const BRAIN: (DisciplineId | 'mix')[] = ['sok', 'spar', 'tricks', 'freestyle'];

/** Dagsmål i minuter strukturerad träning */
export function dailyGoal(s: AppState, dog: DogId) {
  const info = s.dogs[dog];
  if (dog === 'puppy') {
    if (daysUntilHome(info.birth) > 0) return 0;
    return Math.max(5, Math.min(60, ageMonths(info.birth) * 5));
  }
  return 30;
}

export interface Rings {
  goal: number;
  activity: { min: number; target: number };
  brain: { min: number; target: number };
  calm: { min: number; target: number };
}

/** Tre ringar för idag: aktivitet, hjärngympa och lugn */
export function todayRings(s: AppState, dog: DogId): Rings {
  const goal = dailyGoal(s, dog);
  const today = startOfDay(new Date()).getTime();
  const list = sessionsFor(s, dog).filter((x) => +new Date(x.date) >= today);
  const sum = (l: SessionRecord[]) => l.reduce((a, x) => a + x.minutes, 0);
  return {
    goal,
    activity: { min: sum(list), target: goal },
    brain: { min: sum(list.filter((x) => BRAIN.includes(x.discipline))), target: Math.max(5, Math.round(goal * 0.4)) },
    calm: { min: sum(list.filter((x) => x.intensity === 1)), target: Math.max(5, Math.round(goal * 0.3)) },
  };
}

const load = (x: SessionRecord) => x.minutes * x.intensity;

export type LoadLevel = 'bygg' | 'redo' | 'lagom' | 'hog';

export interface LoadStatus {
  level: LoadLevel;
  label: string;
  advice: string;
  /** Kvot akut/kronisk (1 = som vanligt) */
  ratio: number | null;
  /** Belastning per dag, senaste 7 dagarna (äldst först) */
  week: number[];
}

/** Belastning: senaste 7 dagarna jämfört med snittveckan över 28 dagar */
export function loadStatus(s: AppState, dog: DogId): LoadStatus {
  const now = startOfDay(new Date()).getTime() + DAY;
  const list = sessionsFor(s, dog);
  const inRange = (from: number, to: number) => list.filter((x) => +new Date(x.date) >= from && +new Date(x.date) < to);
  const acute = inRange(now - 7 * DAY, now).reduce((a, x) => a + load(x), 0);
  const chronicWeek = inRange(now - 28 * DAY, now).reduce((a, x) => a + load(x), 0) / 4;
  const week = Array.from({ length: 7 }, (_, i) => inRange(now - (7 - i) * DAY, now - (6 - i) * DAY).reduce((a, x) => a + load(x), 0));
  const daysWithData = new Set(list.map((x) => startOfDay(new Date(x.date)).getTime())).size;
  if (daysWithData < 4 || chronicWeek === 0) {
    return { level: 'bygg', label: 'Bygger upp underlag', advice: 'Logga några pass till så räknar appen ut hur belastningen ligger.', ratio: null, week };
  }
  const ratio = acute / chronicWeek;
  if (ratio > 1.3) return { level: 'hog', label: 'Hög belastning', advice: `Veckan ligger ${Math.round((ratio - 1) * 100)} % över det vanliga. Välj lugnt nosarbete eller vila.`, ratio, week };
  if (ratio < 0.8) return { level: 'redo', label: 'Redo för mer', advice: 'Lägre än vanligt – bra läge för ett lite längre eller roligare pass.', ratio, week };
  return { level: 'lagom', label: 'Lagom', advice: 'Jämn och bra belastning. Fortsätt som ni gör.', ratio, week };
}

/** Minuter per dag för de senaste `weeks` veckorna (måndag först), för aktivitetskartan */
export function heatmap(s: AppState, dogs: DogId[], weeks = 12) {
  const today = startOfDay(new Date());
  const dow = (today.getDay() + 6) % 7; // måndag = 0
  const first = new Date(today.getTime() - (weeks * 7 - 1 - (6 - dow)) * DAY);
  const days: { date: Date; minutes: number; future: boolean }[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(first.getTime() + i * DAY);
    const next = d.getTime() + DAY;
    const minutes = s.sessions
      .filter((x) => x.dogs.some((g) => dogs.includes(g)) && +new Date(x.date) >= d.getTime() && +new Date(x.date) < next)
      .reduce((a, x) => a + x.minutes, 0);
    days.push({ date: d, minutes, future: d.getTime() > today.getTime() });
  }
  const max = Math.max(30, ...days.map((d) => d.minutes));
  const active = days.filter((d) => d.minutes > 0).length;
  return { days, max, active, total: days.reduce((a, d) => a + d.minutes, 0) };
}

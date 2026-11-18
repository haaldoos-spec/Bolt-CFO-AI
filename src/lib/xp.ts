import type { AppState, DogId } from '../types';

/** XP som krävs för att gå från nivå n till n+1 */
const stepFor = (level: number) => 200 + (level - 1) * 75;

export const levelInfo = (xp: number) => {
  let level = 1;
  let remaining = xp;
  while (remaining >= stepFor(level)) {
    remaining -= stepFor(level);
    level++;
  }
  const need = stepFor(level);
  return { level, into: remaining, need, pct: remaining / need };
};

export const LEVEL_TITLES = ['Valpkull', 'Nyfiken nos', 'Godisjägare', 'Lydig labbe', 'Spårkompis', 'Skogsmästare', 'Äventyrare', 'Mästernos', 'Legendlabbe'];
export const levelTitle = (lvl: number) => LEVEL_TITLES[Math.min(lvl - 1, LEVEL_TITLES.length - 1)];

const dayKey = (iso: string | Date) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/** Antal dagar i rad med aktivitet (pass, quest eller check-in) för given hund */
export const streakFor = (state: AppState, dog?: DogId) => {
  const days = new Set<string>();
  state.sessions.filter((s) => !dog || s.dogs.includes(dog)).forEach((s) => days.add(dayKey(s.date)));
  state.checkins.filter((c) => !dog || c.dogs.includes(dog)).forEach((c) => days.add(dayKey(c.date)));
  state.questsDone.filter((q) => !dog || q.profile === dog || q.profile === 'both').forEach((q) => days.add(dayKey(q.date)));
  const d = new Date();
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1); // dagens streak lever tills ikväll
  let n = 0;
  while (days.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
};

export const isToday = (iso: string) => dayKey(iso) === dayKey(new Date());

import type { CustomPass, DisciplineId, DogId, Exercise } from '../types';
import { COOLDOWNS, EXERCISES, WARMUPS } from '../data/training';

export type StepKind = 'warmup' | 'work' | 'rest' | 'cooldown';

export interface SessionStep {
  kind: StepKind;
  title: string;
  detail: string;
  seconds: number;
  dog?: DogId;
  waitingDog?: DogId;
  exerciseId?: string;
}

export interface SessionPlan {
  dogs: DogId[];
  discipline: DisciplineId | 'mix';
  minutes: number;
  steps: SessionStep[];
  intensity: 1 | 2 | 3;
  /** Namn på passet (egna pass) */
  title?: string;
}

const shuffle = <T,>(a: T[]) => {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

const poolFor = (dog: DogId, discipline: DisciplineId | 'mix', minutes: number): Exercise[] => {
  let pool = EXERCISES.filter((e) => e.suits.includes(dog) && (discipline === 'mix' || e.discipline === discipline));
  pool = pool.filter((e) => e.level !== 'program' || minutes >= 45);
  if (dog === 'senior') pool = pool.filter((e) => e.intensity <= 2);
  return shuffle(pool).sort((a, b) => (a.level === 'program' ? 1 : 0) - (b.level === 'program' ? 1 : 0));
};

export function buildSession(dogs: DogId[], discipline: DisciplineId | 'mix', minutes: number): SessionPlan {
  const total = minutes * 60;
  const dual = dogs.length === 2;
  const hasSenior = dogs.includes('senior');
  const hasPuppy = dogs.includes('puppy');

  const warmSec = (hasSenior ? 5 : 3) * 60 + (minutes >= 45 ? 60 : 0);
  const coolSec = (minutes >= 30 ? 4 : 3) * 60;
  const steps: SessionStep[] = [];

  const warmList = hasSenior ? WARMUPS.senior : WARMUPS.puppy;
  steps.push({
    kind: 'warmup',
    title: 'Uppvärmning',
    detail: warmList.join(' · ') + (dual ? ' – båda hundarna tillsammans.' : ''),
    seconds: warmSec,
  });

  let left = total - warmSec - coolSec;
  const workLen = (dog: DogId) => (dog === 'puppy' ? 180 : 240);
  const restLen = (dog: DogId) => (dog === 'puppy' ? 90 : 60);
  const pools: Record<DogId, Exercise[]> = {
    senior: hasSenior ? poolFor('senior', discipline, minutes) : [],
    puppy: hasPuppy ? poolFor('puppy', discipline, minutes) : [],
  };
  const idx: Record<DogId, number> = { senior: 0, puppy: 0 };
  let turn = 0;
  let blocksSinceWater = 0;

  while (left >= 120) {
    const dog = dogs[turn % dogs.length];
    const pool = pools[dog];
    if (!pool.length) break;
    const ex = pool[idx[dog] % pool.length];
    idx[dog]++;
    const len = Math.min(workLen(dog), Math.max(120, Math.min(ex.minutes * 60, left)));
    const other = dual ? dogs.find((d) => d !== dog) : undefined;
    steps.push({
      kind: 'work',
      title: ex.title,
      detail: ex.steps[0],
      seconds: len,
      dog,
      waitingDog: other,
      exerciseId: ex.id,
    });
    left -= len;
    turn++;
    blocksSinceWater++;

    if (left < 120) break;
    if (!dual) {
      const r = Math.min(restLen(dog), left - 60);
      if (r >= 30) {
        steps.push({ kind: 'rest', title: 'Vilopaus', detail: dog === 'puppy' ? 'Låt valpen dricka, nosa och smälta. Ingen träning.' : 'Vatten, lugn och en klapp. Kolla att rörelserna är mjuka.', seconds: r, dog });
        left -= r;
      }
    } else if (blocksSinceWater >= 3) {
      steps.push({ kind: 'rest', title: 'Vattenpaus för båda', detail: 'Båda hundarna får dricka och vila. Belöna lugn bredvid varandra.', seconds: 60 });
      left -= 60;
      blocksSinceWater = 0;
    }
  }

  // Fyll ut ev. resttid i nedvarvningen
  const coolList = hasPuppy && !hasSenior ? COOLDOWNS.puppy : COOLDOWNS.senior;
  steps.push({
    kind: 'cooldown',
    title: 'Nedvarvning',
    detail: coolList.join(' · ') + (dual ? ' – båda på var sin filt.' : ''),
    seconds: coolSec + Math.max(0, left),
  });

  const workEx = steps.filter((s) => s.exerciseId).map((s) => EXERCISES.find((e) => e.id === s.exerciseId)!);
  const avg = workEx.reduce((a, e) => a + e.intensity, 0) / Math.max(1, workEx.length);
  const intensity = (Math.round(avg + (minutes >= 45 ? 0.5 : 0)) || 1) as 1 | 2 | 3;

  return { dogs, discipline, minutes, steps, intensity: Math.min(3, Math.max(1, intensity)) as 1 | 2 | 3 };
}

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** Gör ett eget pass till en körbar plan med timer */
export function planFromCustom(pass: CustomPass): SessionPlan {
  const dogs = pass.dogs;
  const dual = dogs.length === 2;
  const steps: SessionStep[] = [];
  const hasSenior = dogs.includes('senior');
  const hasPuppy = dogs.includes('puppy');
  if (pass.warmup) {
    const list = hasSenior ? WARMUPS.senior : WARMUPS.puppy;
    steps.push({ kind: 'warmup', title: 'Uppvärmning', detail: list.join(' · '), seconds: (hasSenior ? 5 : 3) * 60 });
  }
  pass.items.forEach((it, i) => {
    const ex = EXERCISES.find((e) => e.id === it.exerciseId);
    if (!ex) return;
    const dog = it.dog ?? (dual ? dogs[i % 2] : dogs[0]);
    steps.push({
      kind: 'work',
      title: ex.title,
      detail: ex.steps[0],
      seconds: Math.max(1, it.minutes) * 60,
      dog,
      waitingDog: dual ? dogs.find((d) => d !== dog) : undefined,
      exerciseId: ex.id,
    });
    if (pass.pauses && i < pass.items.length - 1) {
      steps.push({ kind: 'rest', title: 'Vilopaus', detail: 'Vatten, lugn och en klapp.', seconds: dog === 'puppy' ? 90 : 60, dog });
    }
  });
  if (pass.cooldown) {
    const list = hasPuppy && !hasSenior ? COOLDOWNS.puppy : COOLDOWNS.senior;
    steps.push({ kind: 'cooldown', title: 'Nedvarvning', detail: list.join(' · '), seconds: 3 * 60 });
  }
  const exs = pass.items.map((it) => EXERCISES.find((e) => e.id === it.exerciseId)).filter(Boolean) as Exercise[];
  const avg = exs.reduce((a, e) => a + e.intensity, 0) / Math.max(1, exs.length);
  const discs = [...new Set(exs.map((e) => e.discipline))];
  return {
    dogs,
    discipline: discs.length === 1 ? discs[0] : 'mix',
    minutes: Math.round(steps.reduce((a, s) => a + s.seconds, 0) / 60),
    steps,
    intensity: Math.min(3, Math.max(1, Math.round(avg) || 1)) as 1 | 2 | 3,
    title: pass.name,
  };
}

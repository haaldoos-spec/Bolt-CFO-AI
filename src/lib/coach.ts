import type { AppState, DisciplineId, DogId, ProfileId } from '../types';
import { DISCIPLINES, EXERCISES } from '../data/training';
import { ageText, dogsOf } from '../data/profiles';
import { streakFor } from './xp';

export interface Insight {
  id: string;
  tone: 'rest' | 'push' | 'care' | 'fun';
  title: string;
  body: string;
  cta?: { label: string; discipline?: DisciplineId | 'mix'; minutes?: number };
}

const hoursSince = (iso: string) => (Date.now() - new Date(iso).getTime()) / 36e5;

export const ageMonths = (birth: string) => {
  const b = new Date(birth);
  const n = new Date();
  return (n.getFullYear() - b.getFullYear()) * 12 + (n.getMonth() - b.getMonth());
};

export const disciplineProgress = (state: AppState, dog: DogId, d: DisciplineId) => {
  const all = EXERCISES.filter((e) => e.discipline === d && e.suits.includes(dog));
  if (!all.length) return 0;
  const done = all.filter((e) => state.completed[dog].includes(e.id)).length;
  return done / all.length;
};

export function generateInsights(state: AppState, profile: ProfileId): Insight[] {
  const out: Insight[] = [];
  const dogs = dogsOf(profile);
  const month = new Date().getMonth();
  const cold = month >= 10 || month <= 2;
  const hour = new Date().getHours();

  const last = (dog: DogId) => state.sessions.filter((s) => s.dogs.includes(dog)).sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];

  for (const dog of dogs) {
    const info = state.dogs[dog];
    const l = last(dog);
    const isPuppy = dog === 'puppy';
    if (l && hoursSince(l.date) < 36 && l.intensity >= 3) {
      out.push({
        id: `rest-${dog}`,
        tone: 'rest',
        title: isPuppy ? 'Återhämtningsdag för valpen' : 'Vilodag för senioren',
        body: `${info.name} hade ett intensivt pass igår (”${l.title}”, ${l.minutes} min). Idag rekommenderar jag 15 min lugnt nosarbete eller passivitet på café – hjärnan behöver tid att lagra det nya.`,
        cta: { label: 'Starta 15 min lugnt sök', discipline: 'sok', minutes: 15 },
      });
    } else if (!l || hoursSince(l.date) > 60) {
      out.push({
        id: `push-${dog}`,
        tone: 'push',
        title: `Dags att väcka ${isPuppy ? 'valp' : 'senior'}hjärnan`,
        body: `Det har gått ${l ? Math.round(hoursSince(l.date) / 24) + ' dagar' : 'ett tag'} sedan ${info.name} tränade. Ett kort, roligt pass håller motivationen uppe – ${isPuppy ? 'valpar glömmer snabbt men lär sig ännu snabbare' : 'regelbunden hjärngympa är bevisat bra för äldre hundars kognition'}.`,
        cta: { label: 'Generera 15 min-pass', discipline: 'mix', minutes: 15 },
      });
    }

    if (isPuppy) {
      const m = Math.max(2, ageMonths(info.birth));
      out.push({
        id: 'puppy-age',
        tone: 'care',
        title: `${ageText(info.birth)} – tillväxtfas`,
        body: `Tumregel: ca 5 min strukturerad aktivitet per levnadsmånad och pass (≈ ${m * 5} min för ${info.name}). Undvik hopp, trappor i fart och långa joggingturer tills lederna slutit sig (12–15 mån). Simning och kroppskontroll är guld.`,
        cta: { label: 'Valpagility på marknivå', discipline: 'agility', minutes: 15 },
      });
    } else {
      out.push({
        id: 'senior-care',
        tone: 'care',
        title: cold ? 'Kallt ute – extra uppvärmning' : 'Ledvänlig rörlighet',
        body: cold
          ? `Kyla gör seniorens leder stela. Värm upp ${info.name} med 5 min skritt + godis-stretch innan träning, och torka av ordentligt efter blöta promenader. Täcke vid väntan kan vara klokt.`
          : `Cavaletti och balansplatta 5 min om dagen bygger muskler kring höfterna. Håll vikten på ${info.weightKg} kg – varje kilo extra är tungt för en 9-årig labrador.`,
        cta: { label: 'Rörlighetspass 15 min', discipline: 'agility', minutes: 15 },
      });
    }

    // Svagaste grenen
    const weakest = DISCIPLINES.map((d) => ({ d, p: disciplineProgress(state, dog, d.id) }))
      .filter((x) => EXERCISES.some((e) => e.discipline === x.d.id && e.suits.includes(dog)))
      .sort((a, b) => a.p - b.p)[0];
    if (weakest && weakest.p < 0.5) {
      out.push({
        id: `weak-${dog}`,
        tone: 'push',
        title: `Lucka i ${weakest.d.name.toLowerCase()}`,
        body: `${info.name} har bara klarat ${Math.round(weakest.p * 100)}% av byggstenarna mot ”${weakest.d.goalLabel}”. Ett 15-minuterspass i veckan räcker för att börja knyta ihop kedjorna.`,
        cta: { label: `Träna ${weakest.d.name}`, discipline: weakest.d.id, minutes: 15 },
      });
    }
  }

  if (profile === 'both') {
    out.unshift({
      id: 'both-tandem',
      tone: 'fun',
      title: 'Perfekt dag för ett par-pass',
      body: `Varva hundarna: ${state.dogs.senior.name} gör nosarbete medan ${state.dogs.puppy.name} tränar passivitet på filten – sedan byter ni. Den som väntar lär sig minst lika mycket som den som jobbar.`,
      cta: { label: 'Par-pass 30 min', discipline: 'mix', minutes: 30 },
    });
  }

  const streak = streakFor(state);
  if (streak >= 3) {
    out.push({
      id: 'streak',
      tone: 'fun',
      title: `🔥 ${streak} dagar i rad!`,
      body: `Ni har en streak på ${streak} dagar. Klara en quest eller ett kort pass idag för att hålla elden vid liv.`,
    });
  }

  if (hour >= 18) {
    out.push({
      id: 'evening',
      tone: 'rest',
      title: 'Kvällsläge',
      body: 'På kvällen fungerar lugna aktiviteter bäst: lådsök i vardagsrummet, tricks på mattan eller en slickmatta. Spara fart och spring till förmiddagen.',
      cta: { label: 'Tricks 15 min', discipline: 'tricks', minutes: 15 },
    });
  }

  return out;
}

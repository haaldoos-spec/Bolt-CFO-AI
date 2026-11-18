import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import type { AppState, CheckIn, Place, DisciplineId, DogId, DogInfo, ProfileId, SessionRecord, TabId } from '../types';

export type GeneratorPreset = { discipline?: DisciplineId | 'mix'; minutes?: number };
import { seedState } from '../data/seed';
import { DEFAULT_DOGS, OLD_DEFAULT_NAMES, THEMES } from '../data/profiles';

type Action =
  | { type: 'xp'; dogs: DogId[]; amount: number }
  | { type: 'toggleExercise'; dog: DogId; id: string }
  | { type: 'addSession'; session: SessionRecord }
  | { type: 'addCheckin'; checkin: CheckIn }
  | { type: 'deleteCheckin'; id: string }
  | { type: 'addPlace'; place: Place }
  | { type: 'deletePlace'; id: string }
  | { type: 'toggleGuide'; id: string }
  | { type: 'questDone'; questId: string; profile: ProfileId }
  | { type: 'updateDog'; dog: DogId; patch: Partial<DogInfo> }
  | { type: 'reset' };

const KEY = 'labbeliv.state.v1';

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'xp': {
      const xp = { ...s.xp };
      a.dogs.forEach((d) => (xp[d] = Math.max(0, xp[d] + a.amount)));
      return { ...s, xp };
    }
    case 'toggleExercise': {
      const list = s.completed[a.dog];
      const has = list.includes(a.id);
      return {
        ...s,
        completed: { ...s.completed, [a.dog]: has ? list.filter((x) => x !== a.id) : [...list, a.id] },
        xp: { ...s.xp, [a.dog]: Math.max(0, s.xp[a.dog] + (has ? -25 : 25)) },
      };
    }
    case 'addSession':
      return { ...s, sessions: [a.session, ...s.sessions] };
    case 'addCheckin':
      return { ...s, checkins: [a.checkin, ...s.checkins] };
    case 'deleteCheckin':
      return { ...s, checkins: s.checkins.filter((c) => c.id !== a.id) };
    case 'addPlace':
      return { ...s, myPlaces: [a.place, ...s.myPlaces] };
    case 'deletePlace':
      return { ...s, myPlaces: s.myPlaces.filter((p) => p.id !== a.id) };
    case 'toggleGuide': {
      const has = s.puppyGuide.includes(a.id);
      return {
        ...s,
        puppyGuide: has ? s.puppyGuide.filter((x) => x !== a.id) : [...s.puppyGuide, a.id],
        xp: { ...s.xp, puppy: Math.max(0, s.xp.puppy + (has ? -10 : 10)) },
      };
    }
    case 'questDone':
      return { ...s, questsDone: [{ id: crypto.randomUUID(), questId: a.questId, profile: a.profile, date: new Date().toISOString() }, ...s.questsDone] };
    case 'updateDog':
      return { ...s, dogs: { ...s.dogs, [a.dog]: { ...s.dogs[a.dog], ...a.patch } } };
    case 'reset':
      return seedState();
  }
}

const load = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as AppState;
      // Inbyggda avatarer följer alltid med senaste versionen; egna uppladdningar behålls
      (Object.keys(s.dogs) as DogId[]).forEach((d) => {
        if (!s.dogs[d].customAvatar) s.dogs[d].avatar = DEFAULT_DOGS[d].avatar;
      });
      // Namn, födelsedag och vikt följer med uppdateringar så länge de inte ändrats i appen
      (Object.keys(s.dogs) as DogId[]).forEach((d) => {
        if (s.dogs[d].name === OLD_DEFAULT_NAMES[d]) s.dogs[d].name = DEFAULT_DOGS[d].name;
        s.dogs[d].birth = DEFAULT_DOGS[d].birth;
        s.dogs[d].ageLabel = DEFAULT_DOGS[d].ageLabel;
        s.dogs[d].weightKg = DEFAULT_DOGS[d].weightKg;
      });
      // Demodata v3: Kyle är 4 veckor och flyttar hem den 14 december
      if ((s.seedVersion ?? 1) < 3) {
        const seed = seedState();
        const seedIds = new Set(['s1', 's2', 's3', 's4', 's5', 's6', 'c1', 'c2', 'c3', 'c4', 'c5', 'qd1', 'qd2']);
        s.sessions = [...seed.sessions, ...s.sessions.filter((x) => !seedIds.has(x.id))];
        s.checkins = [...seed.checkins, ...s.checkins.filter((x) => !seedIds.has(x.id))];
        s.questsDone = s.questsDone.filter((x) => !seedIds.has(x.id));
        s.completed.puppy = [];
        s.xp.puppy = (s.puppyGuide?.length ?? 0) * 10;
        s.seedVersion = 3;
      }
      s.myPlaces ??= [];
      s.puppyGuide ??= [];
      // Demominnen följer med när demoplatserna byts (t.ex. till Jönköping/Huskvarna)
      return s;
    }
  } catch {
    /* ignorera */
  }
  return seedState();
};

interface Ctx {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  profile: ProfileId;
  setProfile: (p: ProfileId) => void;
  tab: TabId;
  setTab: (t: TabId) => void;
  toast: (msg: string, xp?: number) => void;
  toastMsg: { id: number; msg: string; xp?: number } | null;
  /** används när en quest ska fotas: öppnar check-in i kartan */
  pendingCheckin: { questTitle?: string } | null;
  setPendingCheckin: (v: { questTitle?: string } | null) => void;
  celebrate: number;
  fireCelebrate: () => void;
  generator: GeneratorPreset | null;
  openGenerator: (p: GeneratorPreset | null) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [profile, setProfileRaw] = useState<ProfileId>(() => {
    try {
      return (localStorage.getItem('labbeliv.profile') as ProfileId) || 'both';
    } catch {
      return 'both';
    }
  });
  const [tab, setTab] = useState<TabId>('home');
  const [toastMsg, setToastMsg] = useState<Ctx['toastMsg']>(null);
  const [pendingCheckin, setPendingCheckin] = useState<Ctx['pendingCheckin']>(null);
  const [celebrate, setCelebrate] = useState(0);
  const [generator, openGenerator] = useState<GeneratorPreset | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* fullt lagringsutrymme – ignorera i prototypen */
    }
  }, [state]);

  // Applicera tema som CSS-variabler (animeras via @property i index.css)
  useEffect(() => {
    const t = THEMES[profile];
    const r = document.documentElement.style;
    r.setProperty('--a1', t.a1);
    r.setProperty('--a2', t.a2);
    r.setProperty('--bg', t.bg);
    r.setProperty('--ink', t.ink);
    r.setProperty('--b1', t.blobs[0]);
    r.setProperty('--b2', t.blobs[1]);
    r.setProperty('--b3', t.blobs[2]);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.bg);
    try {
      localStorage.setItem('labbeliv.profile', profile);
    } catch {
      /* ignorera */
    }
  }, [profile]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      dispatch,
      profile,
      setProfile: setProfileRaw,
      tab,
      setTab: (t) => {
        setTab(t);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      toast: (msg, xp) => {
        const id = Date.now();
        setToastMsg({ id, msg, xp });
        setTimeout(() => setToastMsg((cur) => (cur?.id === id ? null : cur)), 2600);
      },
      toastMsg,
      pendingCheckin,
      setPendingCheckin,
      celebrate,
      fireCelebrate: () => setCelebrate((c) => c + 1),
      generator,
      openGenerator,
    }),
    [state, profile, tab, toastMsg, pendingCheckin, celebrate, generator],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp utanför AppProvider');
  return c;
};

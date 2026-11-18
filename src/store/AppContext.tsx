import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { startSync, type SyncHandle, type SyncStatus } from '../lib/sync';
import type { SessionPlan } from '../lib/session';
import type { AppState, CheckIn, CustomPass, Exercise, Place, DisciplineId, DogId, DogInfo, ProfileId, SessionRecord, TabId } from '../types';

export type GeneratorPreset = { discipline?: DisciplineId | 'mix'; minutes?: number };
export type PlacesSection = 'platser' | 'bilder' | 'dagbok';
import { DEMO_COMPLETED_SENIOR, DEMO_IDS, seedState } from '../data/seed';
import { QUESTS } from '../data/quests';
import { parseMapsLink } from '../lib/maps';
import { DEFAULT_DOGS, OLD_DEFAULT_NAMES, THEMES } from '../data/profiles';
import { setCustomExercises } from '../data/training';

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
  | { type: 'reset' }
  | { type: 'replace'; state: AppState }
  | { type: 'savePass'; pass: CustomPass }
  | { type: 'deletePass'; id: string }
  | { type: 'saveExercise'; exercise: Exercise }
  | { type: 'deleteExercise'; id: string };

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
    case 'replace':
      return a.state;
    case 'savePass': {
      const list = s.customPasses ?? [];
      return { ...s, customPasses: list.some((p) => p.id === a.pass.id) ? list.map((p) => (p.id === a.pass.id ? a.pass : p)) : [a.pass, ...list] };
    }
    case 'deletePass':
      return { ...s, customPasses: (s.customPasses ?? []).filter((p) => p.id !== a.id) };
    case 'saveExercise': {
      const list = s.customExercises ?? [];
      return { ...s, customExercises: list.some((e) => e.id === a.exercise.id) ? list.map((e) => (e.id === a.exercise.id ? a.exercise : e)) : [...list, a.exercise] };
    }
    case 'deleteExercise':
      return {
        ...s,
        customExercises: (s.customExercises ?? []).filter((e) => e.id !== a.id),
        customPasses: (s.customPasses ?? []).map((p) => ({ ...p, items: p.items.filter((it) => it.exerciseId !== a.id) })),
      };
  }
}

/** XP räknat från det användaren faktiskt gjort */
function recomputeXp(s: AppState): AppState['xp'] {
  const xp = { senior: 0, puppy: 0 };
  s.sessions.forEach((x) => x.dogs.forEach((d) => (xp[d] += x.minutes * 2 + (x.ratings[d] ?? 3) * 5)));
  s.checkins.forEach((c) => c.dogs.forEach((d) => (xp[d] += 15)));
  s.questsDone.forEach((q) => {
    const quest = QUESTS.find((x) => x.id === q.questId);
    if (quest) (q.profile === 'both' ? (['senior', 'puppy'] as DogId[]) : [q.profile]).forEach((d) => (xp[d] += quest.xp));
  });
  (['senior', 'puppy'] as DogId[]).forEach((d) => (xp[d] += s.completed[d].length * 25));
  xp.puppy += (s.puppyGuide ?? []).length * 10;
  return xp;
}

/** Uppdaterar sparad data (lokal eller från Claudes lagring) till senaste formatet */
export function migrate(input: AppState): AppState {
  const s = structuredClone(input) as AppState;
  const seedBase = seedState();
  s.dogs ??= seedBase.dogs;
  s.xp ??= seedBase.xp;
  s.completed ??= seedBase.completed;
  s.sessions ??= [];
  s.checkins ??= [];
  s.questsDone ??= [];
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
      // v4: ta bort all exempeldata men behåll allt användaren själv lagt in, och räkna om XP
      if ((s.seedVersion ?? 1) < 4) {
        s.sessions = s.sessions.filter((x) => !DEMO_IDS.has(x.id));
        s.checkins = s.checkins.filter((x) => !DEMO_IDS.has(x.id));
        s.questsDone = s.questsDone.filter((x) => !DEMO_IDS.has(x.id));
        s.completed = {
          senior: s.completed.senior.filter((id) => !DEMO_COMPLETED_SENIOR.includes(id)),
          puppy: s.completed.puppy,
        };
        s.xp = recomputeXp(s);
        s.seedVersion = 4;
      }
      s.myPlaces ??= [];
      // Läs om positionen ur sparade kartlänkar (rättar platser sparade med kartans mittpunkt i stället för platsen)
      s.myPlaces = s.myPlaces.map((p) => {
        if (!p.mapsUrl) return p;
        const parsed = parseMapsLink(p.mapsUrl);
        return parsed?.lat !== undefined && parsed.lng !== undefined ? { ...p, lat: parsed.lat, lng: parsed.lng, noCoords: false } : p;
      });
      s.puppyGuide ??= [];
      s.customPasses ??= [];
      s.customExercises ??= [];
      return s;
}

const load = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw) as AppState);
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
  /** Om datan synkas med Claudes lagring eller bara finns på den här enheten */
  syncStatus: SyncStatus;
  placesSection: PlacesSection;
  setPlacesSection: (s: PlacesSection) => void;
  /** Passet som byggs just nu (eget pass) */
  passDraft: CustomPass | null;
  setPassDraft: React.Dispatch<React.SetStateAction<CustomPass | null>>;
  builderOpen: boolean;
  setBuilderOpen: (v: boolean) => void;
  /** Plan att köra med timer / logga i efterhand (hanteras av SessionFlow) */
  planToRun: SessionPlan | null;
  setPlanToRun: (p: SessionPlan | null) => void;
  planToRate: SessionPlan | null;
  setPlanToRate: (p: SessionPlan | null) => void;
  /** Redigerare för egna övningar */
  exerciseEditor: ExerciseEditorState | null;
  setExerciseEditor: (v: ExerciseEditorState | null) => void;
}

export type ExerciseEditorState = { exercise?: Exercise; discipline?: DisciplineId; addToDraft?: boolean };

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
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('ansluter');
  const [placesSection, setPlacesSection] = useState<PlacesSection>('platser');
  const [passDraft, setPassDraft] = useState<CustomPass | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [planToRun, setPlanToRun] = useState<SessionPlan | null>(null);
  const [planToRate, setPlanToRate] = useState<SessionPlan | null>(null);
  const [exerciseEditor, setExerciseEditor] = useState<ExerciseEditorState | null>(null);
  const syncRef = useRef<SyncHandle | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  // Egna övningar görs tillgängliga för alla listor och pass
  setCustomExercises(state.customExercises ?? []);

  // Synka med Claudes lagring (privat per konto) när appen körs inne i Claude
  useEffect(() => {
    let alive = true;
    startSync({
      getLocal: () => stateRef.current,
      onRemote: (s) => alive && dispatch({ type: 'replace', state: migrate(s) }),
      onStatus: (st) => alive && setSyncStatus(st),
    }).then((h) => {
      if (alive) syncRef.current = h;
      else h?.stop();
    });
    return () => {
      alive = false;
      syncRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    syncRef.current?.push(state);
  }, [state]);

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
      syncStatus,
      placesSection,
      setPlacesSection,
      passDraft,
      setPassDraft,
      builderOpen,
      setBuilderOpen,
      planToRun,
      setPlanToRun,
      planToRate,
      setPlanToRate,
      exerciseEditor,
      setExerciseEditor,
    }),
    [state, profile, tab, toastMsg, pendingCheckin, celebrate, generator, syncStatus, placesSection, passDraft, builderOpen, planToRun, planToRate, exerciseEditor],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp utanför AppProvider');
  return c;
};

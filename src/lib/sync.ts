import type { AppState, CheckIn, DogId } from '../types';

/**
 * Synk med Claudes lagring (artefaktens `db`-förmåga), privat per användare under
 * data/users/<id>/. Fungerar bara inne i Claude; annars sparas allt lokalt som förut.
 *
 *   data/users/<id>/state                 – allt utom minnen (hundar, XP, pass, platser …)
 *   data/users/<id>/profile/checkins/<id> – ett dokument per minne (med foto)
 */

type Unsub = () => void;
type DocSnap = { exists: boolean; data(): Record<string, unknown> | undefined; metadata: { fromCache: boolean; hasPendingWrites: boolean } };
type QuerySnap = { docs: (DocSnap & { id: string })[]; metadata: { fromCache: boolean; hasPendingWrites: boolean } };
type DocRef = {
  get(): Promise<DocSnap>;
  set(d: Record<string, unknown>): Promise<void>;
  delete(): Promise<void>;
  onSnapshot(next: (s: DocSnap) => void, err?: (e: { code: string }) => void): Unsub;
  collection(p: string): ColRef;
};
type ColRef = {
  doc(id?: string): DocRef;
  get(): Promise<QuerySnap>;
  onSnapshot(next: (s: QuerySnap) => void, err?: (e: { code: string }) => void): Unsub;
};
type DB = { doc(p: string): DocRef; collection(p: string): ColRef };
type User = { id(): Promise<string | null> };
type ClaudeRuntime = { use(name: string): Promise<unknown> };

export type SyncStatus = 'lokal' | 'ansluter' | 'synkad' | 'fel';

export interface SyncHandle {
  /** Skriv ändrat läge (anropas efter varje lokal ändring) */
  push(state: AppState): void;
  stop(): void;
}

const runtime = (): ClaudeRuntime | undefined => (window as unknown as { claude?: ClaudeRuntime }).claude;

/** Allt utom minnena; inbyggda avatarer skickas inte (de följer med appen) */
const stateDoc = (s: AppState, savedAt = new Date().toISOString()) => {
  const { checkins: _c, ...rest } = s;
  void _c;
  const dogs = structuredClone(rest.dogs);
  (Object.keys(dogs) as DogId[]).forEach((d) => {
    if (!dogs[d].customAvatar) dogs[d].avatar = '';
  });
  return { ...rest, dogs, savedAt } as Record<string, unknown>;
};

const byId = <T extends { id: string }>(...lists: T[][]) => {
  const m = new Map<string, T>();
  lists.forEach((l) => l.forEach((x) => m.set(x.id, x)));
  return [...m.values()];
};

/**
 * Slår ihop två versioner av datan. Inget tas bort: listor slås ihop per id, och det enda
 * som försvinner är id:n som användaren själv medvetet raderat (deletedIds, från båda sidor).
 */
export function mergeStates(remote: AppState, local: AppState): AppState {
  const uniq = (a: string[], b: string[]) => [...new Set([...a, ...b])];
  const deleted = new Set([...(remote.deletedIds ?? []), ...(local.deletedIds ?? [])]);
  const keep = <T extends { id: string }>(l: T[]) => l.filter((x) => !deleted.has(x.id));
  const byDate = <T extends { date: string }>(l: T[]) => [...l].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const pickDog = (d: DogId) => {
    const r = remote.dogs?.[d];
    const l = local.dogs[d];
    if (!r) return l;
    const custom = r.customAvatar ? r : l.customAvatar ? l : r;
    return { ...r, avatar: custom.avatar, customAvatar: custom.customAvatar };
  };
  return {
    ...remote,
    ...{ seedVersion: Math.max(remote.seedVersion ?? 1, local.seedVersion ?? 1) },
    dogs: { senior: pickDog('senior'), puppy: pickDog('puppy') },
    xp: { senior: Math.max(remote.xp?.senior ?? 0, local.xp.senior), puppy: Math.max(remote.xp?.puppy ?? 0, local.xp.puppy) },
    completed: {
      senior: uniq(remote.completed?.senior ?? [], local.completed.senior),
      puppy: uniq(remote.completed?.puppy ?? [], local.completed.puppy),
    },
    sessions: byDate(keep(byId(remote.sessions ?? [], local.sessions))),
    checkins: byDate(keep(byId(remote.checkins ?? [], local.checkins))),
    myPlaces: keep(byId(remote.myPlaces ?? [], local.myPlaces ?? [])),
    questsDone: keep(byId(remote.questsDone ?? [], local.questsDone)),
    puppyGuide: uniq(remote.puppyGuide ?? [], local.puppyGuide ?? []),
    customPasses: keep(byId(remote.customPasses ?? [], local.customPasses ?? [])),
    customExercises: keep(byId(remote.customExercises ?? [], local.customExercises ?? [])),
    deletedIds: [...deleted],
  };
}

const sameData = (a: AppState, b: AppState) => JSON.stringify(stateDoc(a, '')) === JSON.stringify(stateDoc(b, '')) && a.checkins.map((c) => c.id).join() === b.checkins.map((c) => c.id).join();

export async function startSync(opts: {
  getLocal: () => AppState;
  /** Nytt läge från lagringen (redan sammanslaget/migrerat av anroparen) */
  onRemote: (s: AppState) => void;
  onStatus: (s: SyncStatus) => void;
}): Promise<SyncHandle | null> {
  const claude = runtime();
  if (!claude?.use) {
    opts.onStatus('lokal');
    return null;
  }
  opts.onStatus('ansluter');
  const [db, user] = (await Promise.all([claude.use('db'), claude.use('user')])) as [DB | null, User | null];
  const uid = user ? await user.id().catch(() => null) : null;
  if (!db || !uid) {
    opts.onStatus('lokal');
    return null;
  }

  const base = `data/users/${uid}`;
  const stateRef = db.collection(base).doc('state');
  const checkinsCol = db.doc(`${base}/profile`).collection('checkins');

  let remoteState: AppState | null = null;
  let remoteCheckins: CheckIn[] = [];
  let lastWritten = '';
  let ready = false;
  let writing = Promise.resolve();

  /** Lagringens läge (state + minnen) som AppState */
  const remoteFull = (): AppState | null => (remoteState ? { ...remoteState, checkins: remoteCheckins } : null);

  /** Skriv det sammanslagna läget till lagringen – lägger bara till, raderar bara medvetet borttagna minnen */
  const write = async (merged: AppState) => {
    const doc = stateDoc(merged);
    const json = JSON.stringify({ ...doc, savedAt: '' });
    if (json !== lastWritten) {
      lastWritten = json;
      await stateRef.set(doc);
      remoteState = { ...(doc as unknown as AppState) };
    }
    const remoteIds = new Set(remoteCheckins.map((c) => c.id));
    for (const c of merged.checkins) {
      if (!remoteIds.has(c.id)) {
        await checkinsCol.doc(c.id).set(c as unknown as Record<string, unknown>);
        remoteCheckins = [...remoteCheckins, c];
      }
    }
    const deleted = new Set(merged.deletedIds ?? []);
    for (const c of remoteCheckins) {
      if (deleted.has(c.id)) await checkinsCol.doc(c.id).delete();
    }
    remoteCheckins = remoteCheckins.filter((c) => !deleted.has(c.id));
  };

  /** Ny data från lagringen: slå ihop med det lokala, aldrig ersätt */
  const absorb = () => {
    const r = remoteFull();
    if (!r) return;
    const local = opts.getLocal();
    const merged = mergeStates(r, local);
    if (!sameData(merged, local)) opts.onRemote(merged);
  };

  try {
    const [snap, cSnap] = await Promise.all([stateRef.get(), checkinsCol.get()]);
    remoteCheckins = cSnap.docs.map((d) => d.data() as unknown as CheckIn);
    remoteState = snap.exists ? (snap.data() as unknown as AppState) : null;
    const local = opts.getLocal();
    const merged = remoteState ? mergeStates({ ...remoteState, checkins: remoteCheckins }, local) : mergeStates({ ...local, checkins: remoteCheckins }, local);
    if (!sameData(merged, local)) opts.onRemote(merged);
    await write(merged);
    ready = true;
    opts.onStatus('synkad');
  } catch {
    opts.onStatus('fel');
    return null;
  }

  const unsubState = stateRef.onSnapshot(
    (s) => {
      if (!s.exists || s.metadata.hasPendingWrites || s.metadata.fromCache) return;
      const data = s.data() as unknown as AppState;
      if (JSON.stringify({ ...data, savedAt: '' }) === lastWritten) return;
      remoteState = data;
      absorb();
    },
    () => opts.onStatus('fel'),
  );
  const unsubCheckins = checkinsCol.onSnapshot(
    (s) => {
      if (s.metadata.hasPendingWrites || s.metadata.fromCache) return;
      const next = s.docs.map((d) => d.data() as unknown as CheckIn);
      // Slå ihop med det vi redan vet – en ofullständig läsning får aldrig ta bort något
      remoteCheckins = byId(remoteCheckins, next);
      absorb();
    },
    () => opts.onStatus('fel'),
  );

  let timer: ReturnType<typeof setTimeout> | undefined;
  return {
    push(state: AppState) {
      if (!ready) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        writing = writing.then(async () => {
          try {
            const r = remoteFull();
            await write(r ? mergeStates(r, state) : state);
            opts.onStatus('synkad');
          } catch {
            opts.onStatus('fel');
          }
        });
      }, 700);
    },
    stop() {
      clearTimeout(timer);
      unsubState();
      unsubCheckins();
    },
  };
}

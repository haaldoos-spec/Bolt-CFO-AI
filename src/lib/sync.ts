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
const stateDoc = (s: AppState) => {
  const { checkins: _c, ...rest } = s;
  void _c;
  const dogs = structuredClone(rest.dogs);
  (Object.keys(dogs) as DogId[]).forEach((d) => {
    if (!dogs[d].customAvatar) dogs[d].avatar = '';
  });
  return { ...rest, dogs, savedAt: new Date().toISOString() } as Record<string, unknown>;
};

const byId = <T extends { id: string }>(...lists: T[][]) => {
  const m = new Map<string, T>();
  lists.forEach((l) => l.forEach((x) => m.set(x.id, x)));
  return [...m.values()];
};

/** Slår ihop det som finns lokalt på enheten med det som finns i lagringen – inget försvinner */
export function mergeStates(remote: AppState, local: AppState): AppState {
  const uniq = (a: string[], b: string[]) => [...new Set([...a, ...b])];
  return {
    ...remote,
    xp: { senior: Math.max(remote.xp.senior, local.xp.senior), puppy: Math.max(remote.xp.puppy, local.xp.puppy) },
    completed: { senior: uniq(remote.completed.senior, local.completed.senior), puppy: uniq(remote.completed.puppy, local.completed.puppy) },
    sessions: byId(local.sessions, remote.sessions).sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    checkins: byId(local.checkins, remote.checkins).sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    myPlaces: byId(local.myPlaces ?? [], remote.myPlaces ?? []),
    questsDone: byId(local.questsDone, remote.questsDone),
    puppyGuide: uniq(remote.puppyGuide ?? [], local.puppyGuide ?? []),
    customPasses: byId(local.customPasses ?? [], remote.customPasses ?? []),
    dogs: {
      senior: remote.dogs.senior.customAvatar || !local.dogs.senior.customAvatar ? remote.dogs.senior : { ...remote.dogs.senior, avatar: local.dogs.senior.avatar, customAvatar: true },
      puppy: remote.dogs.puppy.customAvatar || !local.dogs.puppy.customAvatar ? remote.dogs.puppy : { ...remote.dogs.puppy, avatar: local.dogs.puppy.avatar, customAvatar: true },
    },
  };
}

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

  let lastStateJson = '';
  let remoteCheckinIds = new Set<string>();
  let remoteState: AppState | null = null;
  let remoteCheckins: CheckIn[] = [];
  let ready = false;
  let writing = Promise.resolve();

  try {
    // Första kontakten: slå ihop enhetens data med lagringen
    const [snap, cSnap] = await Promise.all([stateRef.get(), checkinsCol.get()]);
    remoteCheckins = cSnap.docs.map((d) => d.data() as unknown as CheckIn);
    remoteCheckinIds = new Set(remoteCheckins.map((c) => c.id));
    const local = opts.getLocal();
    const merged = snap.exists
      ? mergeStates({ ...(snap.data() as unknown as AppState), checkins: remoteCheckins }, local)
      : { ...local, checkins: byId(local.checkins, remoteCheckins) };
    opts.onRemote(merged);
    // Ladda upp det som saknas i lagringen
    const doc = stateDoc(merged);
    lastStateJson = JSON.stringify({ ...doc, savedAt: '' });
    await stateRef.set(doc);
    for (const c of merged.checkins) {
      if (!remoteCheckinIds.has(c.id)) {
        await checkinsCol.doc(c.id).set(c as unknown as Record<string, unknown>);
        remoteCheckinIds.add(c.id);
      }
    }
    ready = true;
    opts.onStatus('synkad');
  } catch {
    opts.onStatus('fel');
    return null;
  }

  // Ändringar från andra enheter
  const emit = () => {
    if (!remoteState) return;
    opts.onRemote({ ...remoteState, checkins: [...remoteCheckins].sort((a, b) => +new Date(b.date) - +new Date(a.date)) });
  };
  const unsubState = stateRef.onSnapshot(
    (s) => {
      if (!s.exists || s.metadata.hasPendingWrites || s.metadata.fromCache) return;
      const data = s.data() as unknown as AppState;
      const json = JSON.stringify({ ...data, savedAt: '' });
      if (json === lastStateJson) return; // vår egen skrivning
      lastStateJson = json;
      remoteState = data;
      emit();
    },
    () => opts.onStatus('fel'),
  );
  const unsubCheckins = checkinsCol.onSnapshot(
    (s) => {
      if (s.metadata.hasPendingWrites || s.metadata.fromCache) return;
      remoteCheckins = s.docs.map((d) => d.data() as unknown as CheckIn);
      const ids = new Set(remoteCheckins.map((c) => c.id));
      const changed = ids.size !== remoteCheckinIds.size || [...ids].some((id) => !remoteCheckinIds.has(id));
      remoteCheckinIds = ids;
      if (changed) {
        remoteState ??= opts.getLocal();
        emit();
      }
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
            const doc = stateDoc(state);
            const json = JSON.stringify({ ...doc, savedAt: '' });
            if (json !== lastStateJson) {
              lastStateJson = json;
              remoteState = state;
              await stateRef.set(doc);
            }
            const localIds = new Set(state.checkins.map((c) => c.id));
            for (const c of state.checkins) {
              if (!remoteCheckinIds.has(c.id)) {
                remoteCheckinIds.add(c.id);
                await checkinsCol.doc(c.id).set(c as unknown as Record<string, unknown>);
              }
            }
            for (const id of [...remoteCheckinIds]) {
              if (!localIds.has(id)) {
                remoteCheckinIds.delete(id);
                await checkinsCol.doc(id).delete();
              }
            }
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

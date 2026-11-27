/**
 * Foton i IndexedDB (rymmer hundratals MB) i stället för localStorage (~5 MB).
 * Nyckel = minnets id, värde = dataURL.
 */
const DB_NAME = 'labbeliv-photos';
const STORE = 'photos';

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB saknas'));
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }).catch((e) => {
      dbPromise = null;
      throw e;
    });
  }
  return dbPromise as Promise<IDBDatabase>;
}

const done = (tx: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

export async function putPhotos(entries: [string, string][]): Promise<void> {
  if (!entries.length) return;
  const db = await open();
  const tx = db.transaction(STORE, 'readwrite');
  entries.forEach(([id, data]) => tx.objectStore(STORE).put(data, id));
  await done(tx);
}

export async function getAllPhotos(): Promise<Record<string, string>> {
  const db = await open();
  const tx = db.transaction(STORE, 'readonly');
  const store = tx.objectStore(STORE);
  const keys = await new Promise<IDBValidKey[]>((res, rej) => {
    const r = store.getAllKeys();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  const vals = await new Promise<unknown[]>((res, rej) => {
    const r = store.getAll();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  const out: Record<string, string> = {};
  keys.forEach((k, i) => {
    if (typeof vals[i] === 'string') out[String(k)] = vals[i] as string;
  });
  return out;
}

export async function deletePhotos(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const db = await open();
  const tx = db.transaction(STORE, 'readwrite');
  ids.forEach((id) => tx.objectStore(STORE).delete(id));
  await done(tx);
}

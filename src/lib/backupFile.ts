import type { AppState } from '../types';
import { migrate } from '../store/AppContext';
import { mergeStates } from './sync';

const APP = 'labbeliv';

type Downloads = { save(req: { filename: string; data: Blob }): Promise<{ status: string }> };

export const backupFilename = () => `labbeliv-backup-${new Date().toISOString().slice(0, 10)}.json`;

export interface ImportResult {
  merged: AppState;
  added: { places: number; memories: number; sessions: number };
}

/** Allt (inklusive foton) som en JSON-fil */
export function exportBlob(state: AppState): Blob {
  const payload = { app: APP, version: 1, exportedAt: new Date().toISOString(), state };
  return new Blob([JSON.stringify(payload)], { type: 'application/json' });
}

/**
 * Sparar filen. Inne i Claude används artefaktens nedladdning, på webben en vanlig nedladdning.
 * Returnerar false om användaren avbröt.
 */
export async function saveBackup(state: AppState): Promise<boolean> {
  const blob = exportBlob(state);
  const filename = backupFilename();
  const claude = (window as unknown as { claude?: { use(n: string): Promise<unknown> } }).claude;
  if (claude?.use) {
    const dl = (await claude.use('downloads').catch(() => null)) as Downloads | null;
    if (dl) {
      try {
        const r = await dl.save({ filename, data: blob });
        return r.status !== 'declined';
      } catch (e) {
        if ((e as { code?: string }).code === 'declined') return false;
        throw e;
      }
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return true;
}

/** Läser en backup-fil och slår ihop den med det som redan finns (inget skrivs över eller tas bort) */
export function parseImport(text: string, current: AppState): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Filen är inte en giltig säkerhetskopia.');
  }
  const obj = data as { app?: string; state?: AppState };
  if (obj?.app !== APP || !obj.state || typeof obj.state !== 'object') {
    throw new Error('Filen ser inte ut som en Labbeliv-säkerhetskopia.');
  }
  const incoming = migrate(obj.state);
  const merged = mergeStates(current, incoming);
  const fresh = <T extends { id: string }>(inc: T[], cur: T[]) => inc.filter((x) => !cur.some((y) => y.id === x.id)).length;
  return {
    merged,
    added: {
      places: fresh(incoming.myPlaces, current.myPlaces),
      memories: fresh(incoming.checkins, current.checkins),
      sessions: fresh(incoming.sessions, current.sessions),
    },
  };
}

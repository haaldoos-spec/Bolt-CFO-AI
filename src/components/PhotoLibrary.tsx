import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Download, ImagePlus, Navigation, X } from 'lucide-react';
import type { CheckIn, DogId } from '../types';
import { useApp } from '../store/AppContext';
import { PLACES } from '../data/places';
import { directionsFor } from '../lib/placeLinks';
import { Avatar } from './ui';

type Downloads = { save(req: { filename: string; data: Blob }): Promise<{ status: string }> };

const dataUrlToBlob = (url: string) => {
  const [head, b64] = url.split(',');
  const mime = head.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
};

const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

/** Alla foton från minnena, samlade i ett bibliotek */
export function PhotoLibrary({ onNew }: { onNew: () => void }) {
  const { state } = useApp();
  const [dog, setDog] = useState<DogId | 'all'>('all');
  const [open, setOpen] = useState<number | null>(null);

  const photos = useMemo(
    () =>
      state.checkins
        .filter((c) => c.photo && (dog === 'all' || c.dogs.includes(dog)))
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [state.checkins, dog],
  );
  const total = state.checkins.filter((c) => c.photo).length;
  const groups = photos.reduce<{ month: string; items: { c: CheckIn; i: number }[] }[]>((acc, c, i) => {
    const month = new Date(c.date).toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });
    const last = acc[acc.length - 1];
    if (last?.month === month) last.items.push({ c, i });
    else acc.push({ month, items: [{ c, i }] });
    return acc;
  }, []);

  if (!total) {
    return (
      <div className="glass flex flex-col items-center p-8 text-center">
        <div className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-white/10">
          <ImagePlus size={28} className="text-[var(--a1)]" />
        </div>
        <div className="font-display text-xl font-semibold">Bildbiblioteket är tomt</div>
        <p className="mt-1 max-w-xs text-sm text-white/60">Alla foton du sparar i ett minne samlas här, sorterade efter datum.</p>
        <button onClick={onNew} className="btn-accent mt-5">
          <ImagePlus size={18} /> Lägg till första bilden
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {(['all', 'senior', 'puppy'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setDog(f)}
            className={`flex items-center gap-1.5 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs font-semibold transition ${dog === f ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5 text-white/60'}`}
          >
            {f === 'all' ? <span className="grid h-6 w-6 place-items-center">🐾</span> : <Avatar dog={f} size={24} />}
            {f === 'all' ? 'Alla' : state.dogs[f].name}
          </button>
        ))}
        <button onClick={onNew} className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-white/10 active:scale-90" aria-label="Lägg till bild">
          <ImagePlus size={17} />
        </button>
      </div>

      {!photos.length && <p className="px-1 text-sm text-white/50">Inga bilder på {dog !== 'all' ? state.dogs[dog].name : 'hundarna'} än.</p>}

      {groups.map((g) => (
        <div key={g.month} className="mb-5">
          <div className="mb-2 flex items-baseline justify-between px-1">
            <span className="text-sm font-bold capitalize text-white/85">{g.month}</span>
            <span className="text-[11px] text-white/45">{g.items.length} {g.items.length === 1 ? 'bild' : 'bilder'}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {g.items.map(({ c, i }) => (
              <button key={c.id} onClick={() => setOpen(i)} className="relative aspect-square overflow-hidden rounded-xl bg-white/5 active:opacity-80">
                <img src={c.photo} alt={c.placeName} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 flex -space-x-1.5">
                  {c.dogs.map((d) => <Avatar key={d} dog={d} size={16} />)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {open !== null && photos[open] && <Viewer photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Viewer({ photos, index, onIndex, onClose }: { photos: CheckIn[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const { state, toast } = useApp();
  const c = photos[index];
  const touch = useRef<number | null>(null);
  const [downloads, setDownloads] = useState<Downloads | null>(null);
  const place = [...state.myPlaces, ...PLACES].find((p) => p.id === c.placeId);

  useEffect(() => {
    const claude = (window as unknown as { claude?: { use(n: string): Promise<unknown> } }).claude;
    claude?.use('downloads').then((d) => setDownloads((d as Downloads) ?? null)).catch(() => {});
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && index > 0) onIndex(index - 1);
      if (e.key === 'ArrowRight' && index < photos.length - 1) onIndex(index + 1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [index, photos.length, onIndex, onClose]);

  const save = async () => {
    if (!downloads || !c.photo) return;
    try {
      const day = new Date(c.date).toISOString().slice(0, 10);
      await downloads.save({ filename: `labbeliv-${day}-${slug(c.placeName) || 'minne'}.jpg`, data: dataUrlToBlob(c.photo) });
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code !== 'declined') toast('Bilden kunde inte sparas här');
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1200] flex animate-fade flex-col bg-black"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (dx > 50 && index > 0) onIndex(index - 1);
        if (dx < -50 && index < photos.length - 1) onIndex(index + 1);
      }}
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-[calc(env(safe-area-inset-top)+12px)] [html.artifact_&]:pt-3">
        <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 active:scale-90" aria-label="Stäng">
          <X size={20} />
        </button>
        <span className="text-xs font-semibold tabular-nums text-white/60">{index + 1} / {photos.length}</span>
        {downloads ? (
          <button onClick={save} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 active:scale-90" aria-label="Spara bilden">
            <Download size={19} />
          </button>
        ) : (
          <span className="w-11" />
        )}
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2">
        <img key={c.id} src={c.photo} alt={c.placeName} className="max-h-full max-w-full animate-fade rounded-2xl object-contain" />
        {index > 0 && (
          <button onClick={() => onIndex(index - 1)} className="absolute left-2 grid h-11 w-11 place-items-center rounded-full bg-black/50 active:scale-90" aria-label="Föregående">
            <ChevronLeft size={22} />
          </button>
        )}
        {index < photos.length - 1 && (
          <button onClick={() => onIndex(index + 1)} className="absolute right-2 grid h-11 w-11 place-items-center rounded-full bg-black/50 active:scale-90" aria-label="Nästa">
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-4">
        <div className="text-xs font-semibold text-white/50">
          {new Date(c.date).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div className="font-display text-xl font-semibold">{c.placeName}</div>
        {c.note && <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-white/75">{c.note}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {c.dogs.map((d) => (
            <span key={d} className="flex items-center gap-1.5 rounded-full bg-white/10 py-1 pl-1 pr-3 text-xs font-semibold">
              <Avatar dog={d} size={20} /> {state.dogs[d].name}
            </span>
          ))}
          {place && (
            <a href={directionsFor(place)} target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <Navigation size={13} /> Hitta dit
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, ClipboardCheck, ListPlus, Minus, Play, Plus, Save, Search, Trash2, X } from 'lucide-react';
import type { CustomPass, DisciplineId, DogId, Exercise } from '../types';
import { useApp } from '../store/AppContext';
import { DISCIPLINES, EXERCISES, LEVEL_LABEL, disciplineById, exerciseById } from '../data/training';
import { dogsOf } from '../data/profiles';
import { fmt, planFromCustom } from '../lib/session';
import { Avatar, Sheet } from './ui';

export const newPass = (dogs: DogId[], name = 'Mitt pass'): CustomPass => ({
  id: crypto.randomUUID(),
  name,
  dogs,
  items: [],
  warmup: true,
  pauses: true,
  cooldown: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/** Lägg till en övning i passet som byggs (skapar ett nytt pass om inget finns) */
export function useAddToPass() {
  const { profile, setPassDraft, toast } = useApp();
  return (ex: Exercise) => {
    setPassDraft((cur) => {
      const base = cur ?? newPass(dogsOf(profile));
      const next = { ...base, items: [...base.items, { id: crypto.randomUUID(), exerciseId: ex.id, minutes: Math.min(10, ex.minutes) }] };
      toast(`${ex.title} tillagd – ${next.items.length} i ditt pass`);
      return next;
    });
  };
}

const passMinutes = (p: CustomPass) => Math.round(planFromCustom(p).steps.reduce((a, s) => a + s.seconds, 0) / 60);

/** Flytande knapp till passet som byggs */
export function PassDraftPill() {
  const { passDraft, builderOpen, setBuilderOpen, tab } = useApp();
  if (!passDraft || builderOpen || !passDraft.items.length || tab !== 'training') return null;
  return (
    <button
      onClick={() => setBuilderOpen(true)}
      className="btn-accent fixed bottom-[calc(env(safe-area-inset-bottom)+96px)] left-1/2 z-[850] -translate-x-1/2 animate-pop !rounded-full !px-5 !py-3 text-sm shadow-2xl"
    >
      <ClipboardCheck size={18} /> {passDraft.name} · {passDraft.items.length} övn · {passMinutes(passDraft)} min
    </button>
  );
}

function ExercisePicker({ open, onClose, dogs, onAdd, addedIds }: { open: boolean; onClose: () => void; dogs: DogId[]; onAdd: (e: Exercise) => void; addedIds: string[] }) {
  const [q, setQ] = useState('');
  const [disc, setDisc] = useState<DisciplineId | 'alla'>('alla');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return EXERCISES.filter(
      (e) =>
        (disc === 'alla' || e.discipline === disc) &&
        e.suits.some((d) => dogs.includes(d)) &&
        (!t || e.title.toLowerCase().includes(t) || e.summary.toLowerCase().includes(t)),
    );
  }, [q, disc, dogs]);
  return (
    <Sheet open={open} onClose={onClose} title="Lägg till övningar">
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          id="pass-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Sök övning, t.ex. inkallning eller spår"
          className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-white/35 focus:border-white/35"
        />
      </div>
      <div className="-mx-5 mb-3 flex gap-2 overflow-x-auto px-5 no-scrollbar">
        {[{ id: 'alla' as const, name: 'Alla' }, ...DISCIPLINES].map((d) => (
          <button
            key={d.id}
            onClick={() => setDisc(d.id)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${disc === d.id ? 'border-transparent text-ink' : 'border-white/15 bg-white/5 text-white/75'}`}
            style={disc === d.id ? { background: 'linear-gradient(120deg,var(--a1),var(--a2))' } : undefined}
          >
            {d.name}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {list.map((e) => {
          const n = addedIds.filter((x) => x === e.id).length;
          return (
            <button key={e.id} onClick={() => onAdd(e)} className="glass flex w-full items-center gap-3 !rounded-2xl p-3 text-left active:scale-[.99]">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{e.title}</div>
                <div className="truncate text-[11px] text-white/50">{disciplineById(e.discipline).name} · {LEVEL_LABEL[e.level]} · {e.minutes} min</div>
              </div>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${n ? 'text-ink' : 'bg-white/10'}`} style={n ? { background: 'linear-gradient(135deg,var(--a1),var(--a2))' } : undefined}>
                {n ? (n > 1 ? <span className="text-xs font-extrabold">{n}</span> : <Check size={16} strokeWidth={3} />) : <Plus size={16} />}
              </span>
            </button>
          );
        })}
        {!list.length && <p className="p-2 text-sm text-white/50">Inga övningar matchar.</p>}
      </div>
      <button onClick={onClose} className="btn-accent sticky bottom-0 mt-4 w-full">Klar</button>
    </Sheet>
  );
}

/** Bygg, spara, starta eller logga ett eget pass */
export function PassBuilder() {
  const { state, dispatch, passDraft, setPassDraft, builderOpen, setBuilderOpen, setPlanToRun, setPlanToRate, toast } = useApp();
  const [picker, setPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!passDraft) return null;
  const p = passDraft;
  const dual = p.dogs.length === 2;
  const isSaved = (state.customPasses ?? []).some((x) => x.id === p.id);
  const set = (patch: Partial<CustomPass>) => setPassDraft({ ...p, ...patch, updatedAt: new Date().toISOString() });
  const setItem = (i: number, patch: Partial<CustomPass['items'][number]>) => set({ items: p.items.map((it, k) => (k === i ? { ...it, ...patch } : it)) });
  const move = (i: number, d: -1 | 1) => {
    const items = [...p.items];
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    set({ items });
  };
  const close = () => {
    setBuilderOpen(false);
    setConfirmDelete(false);
  };
  const save = () => {
    dispatch({ type: 'savePass', pass: { ...p, name: p.name.trim() || 'Mitt pass' } });
    return p;
  };
  const total = passMinutes(p);

  return (
    <>
      <Sheet open={builderOpen} onClose={close} title={isSaved ? 'Redigera pass' : 'Bygg eget pass'}>
        <input
          id="pass-name"
          value={p.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Namn på passet"
          className="mb-4 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-[15px] font-semibold outline-none focus:border-white/35"
        />

        <div className="label mb-2">Hund</div>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {([['senior'], ['puppy'], ['senior', 'puppy']] as DogId[][]).map((ds) => {
            const on = ds.length === p.dogs.length && ds.every((d) => p.dogs.includes(d));
            return (
              <button
                key={ds.join()}
                onClick={() => set({ dogs: ds, items: p.items.map((it) => ({ ...it, dog: undefined })) })}
                className={`flex flex-col items-center gap-1 rounded-2xl border py-2.5 text-xs font-semibold transition active:scale-95 ${on ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5 text-white/60'}`}
              >
                <div className="flex -space-x-2">{ds.map((d) => <Avatar key={d} dog={d} size={26} ring={on} />)}</div>
                {ds.length === 2 ? 'Båda' : state.dogs[ds[0]].name}
              </button>
            );
          })}
        </div>

        <div className="mb-2 flex items-center justify-between">
          <div className="label">Övningar · {p.items.length}</div>
          <span className="text-xs font-bold tabular-nums text-white/60">ca {total} min totalt</span>
        </div>
        <div className="space-y-2">
          {p.items.map((it, i) => {
            const ex = exerciseById(it.exerciseId);
            if (!ex) return null;
            const dog = it.dog ?? (dual ? p.dogs[i % 2] : p.dogs[0]);
            return (
              <div key={it.id} className="glass !rounded-2xl p-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-snug">{ex.title}</div>
                    <div className="text-[11px] text-white/50">{disciplineById(ex.discipline).name}</div>
                  </div>
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="grid h-8 w-8 place-items-center rounded-full bg-white/5 disabled:opacity-25" aria-label="Flytta upp"><ArrowUp size={14} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === p.items.length - 1} className="grid h-8 w-8 place-items-center rounded-full bg-white/5 disabled:opacity-25" aria-label="Flytta ner"><ArrowDown size={14} /></button>
                  <button onClick={() => set({ items: p.items.filter((_, k) => k !== i) })} className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-rose-300/80" aria-label="Ta bort övning"><X size={14} /></button>
                </div>
                <div className="mt-2 flex items-center gap-2 pl-8">
                  <div className="flex items-center rounded-full bg-white/[0.07]">
                    <button onClick={() => setItem(i, { minutes: Math.max(1, it.minutes - 1) })} className="grid h-8 w-8 place-items-center" aria-label="Kortare"><Minus size={14} /></button>
                    <span className="w-14 text-center text-xs font-bold tabular-nums">{it.minutes} min</span>
                    <button onClick={() => setItem(i, { minutes: Math.min(30, it.minutes + 1) })} className="grid h-8 w-8 place-items-center" aria-label="Längre"><Plus size={14} /></button>
                  </div>
                  {dual && (
                    <button
                      onClick={() => setItem(i, { dog: dog === 'senior' ? 'puppy' : 'senior' })}
                      className="ml-auto flex items-center gap-1.5 rounded-full bg-white/[0.07] py-1 pl-1 pr-3 text-xs font-semibold"
                    >
                      <Avatar dog={dog} size={22} /> {state.dogs[dog].name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <button onClick={() => setPicker(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/25 bg-white/[0.03] py-3.5 text-sm font-semibold text-white/80 active:scale-[.98]">
            <ListPlus size={18} /> Lägg till övning
          </button>
        </div>

        <div className="label mb-2 mt-5">Ingår också</div>
        <div className="mb-5 flex flex-wrap gap-2">
          {([['warmup', 'Uppvärmning'], ['pauses', 'Vilopauser'], ['cooldown', 'Nedvarvning']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => set({ [k]: !p[k] } as Partial<CustomPass>)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${p[k] ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5 text-white/50'}`}
            >
              {p[k] ? <Check size={13} /> : <Plus size={13} />} {label}
            </button>
          ))}
        </div>

        {p.items.length > 0 && (
          <div className="glass mb-4 !rounded-2xl p-3 text-xs text-white/60">
            {planFromCustom(p).steps.map((s, i) => (
              <div key={i} className="flex justify-between py-0.5">
                <span className="truncate pr-2">{s.title}</span>
                <span className="tabular-nums">{fmt(s.seconds)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <button
            disabled={!p.items.length}
            onClick={() => {
              save();
              close();
              setPlanToRun(planFromCustom(p));
            }}
            className="btn-accent w-full disabled:opacity-40"
          >
            <Play size={18} /> Starta passet med timer
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={!p.items.length}
              onClick={() => {
                save();
                toast(`${p.name.trim() || 'Passet'} sparat`);
                close();
                setPassDraft(null);
              }}
              className="btn-ghost disabled:opacity-40"
            >
              <Save size={16} /> Spara
            </button>
            <button
              disabled={!p.items.length}
              onClick={() => {
                save();
                close();
                setPlanToRate(planFromCustom(p));
                setPassDraft(null);
              }}
              className="btn-ghost disabled:opacity-40"
            >
              <ClipboardCheck size={16} /> Logga som gjort
            </button>
          </div>
          {isSaved ? (
            <button
              onClick={() => {
                if (confirmDelete) {
                  dispatch({ type: 'deletePass', id: p.id });
                  setPassDraft(null);
                  close();
                  toast('Passet är borttaget');
                } else setConfirmDelete(true);
              }}
              className={`btn-ghost w-full !py-2.5 text-sm ${confirmDelete ? '!border-rose-300/50 !text-rose-200' : '!text-rose-300/70'}`}
            >
              <Trash2 size={15} /> {confirmDelete ? 'Tryck igen för att ta bort passet' : 'Ta bort passet'}
            </button>
          ) : (
            <button onClick={() => { setPassDraft(null); close(); }} className="btn-ghost w-full !py-2.5 text-sm !text-white/50">
              Släng utkastet
            </button>
          )}
        </div>
      </Sheet>

      <ExercisePicker
        open={picker}
        onClose={() => setPicker(false)}
        dogs={p.dogs}
        addedIds={p.items.map((x) => x.exerciseId)}
        onAdd={(e) => set({ items: [...p.items, { id: crypto.randomUUID(), exerciseId: e.id, minutes: Math.min(10, e.minutes) }] })}
      />
    </>
  );
}

/** Lista med sparade egna pass (visas i Träning) */
export function MyPasses() {
  const { state, profile, setPassDraft, setBuilderOpen, setPlanToRun, setPlanToRate } = useApp();
  const passes = state.customPasses ?? [];
  return (
    <div className="space-y-2.5">
      {passes.map((p) => {
        const plan = planFromCustom(p);
        return (
          <div key={p.id} className="glass p-4">
            <button onClick={() => { setPassDraft(structuredClone(p)); setBuilderOpen(true); }} className="flex w-full items-center gap-3 text-left">
              <div className="flex -space-x-2">{p.dogs.map((d) => <Avatar key={d} dog={d} size={30} />)}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{p.name}</div>
                <div className="truncate text-[11px] text-white/50">
                  {p.items.length} övningar · ca {plan.minutes} min · {[...new Set(p.items.map((it) => exerciseById(it.exerciseId)?.discipline).filter(Boolean))].map((d) => disciplineById(d as DisciplineId).name).join(', ')}
                </div>
              </div>
            </button>
            <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
              <button onClick={() => setPlanToRun(plan)} className="btn-accent !py-2.5 text-sm"><Play size={16} /> Starta</button>
              <button onClick={() => setPlanToRate(plan)} className="btn-ghost !py-2.5 text-sm"><ClipboardCheck size={16} /> Logga</button>
            </div>
          </div>
        );
      })}
      <button
        onClick={() => { setPassDraft(newPass(dogsOf(profile))); setBuilderOpen(true); }}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-white/25 bg-white/[0.03] py-4 text-sm font-semibold text-white/80 active:scale-[.98]"
      >
        <ListPlus size={18} /> Bygg eget pass
      </button>
    </div>
  );
}

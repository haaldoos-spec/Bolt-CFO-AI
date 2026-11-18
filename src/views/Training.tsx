import { useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, ListPlus, Pencil, Plus, Scale, Clock, Flag, Layers, Lightbulb, Link2, PawPrint, Puzzle, Sparkles, Target, Timer, Trophy, Users } from 'lucide-react';
import type { DisciplineId, DogId, Exercise, ExerciseLevel } from '../types';
import { useApp } from '../store/AppContext';
import { DISCIPLINES, EQUIPMENT, EXERCISES, LEVEL_LABEL, allExercises, disciplineById, exerciseById } from '../data/training';
import { dogsOf } from '../data/profiles';
import { disciplineProgress } from '../lib/coach';
import { PuppyGuideCard } from '../components/PuppyGuide';
import { MyPasses, useAddToPass } from '../components/PassBuilder';
import { Avatar, EQUIP_ICONS, ICONS, Progress, SectionTitle, Sheet } from '../components/ui';

const LEVEL_ICON: Record<ExerciseLevel, typeof Puzzle> = { byggsten: Puzzle, kedja: Link2, program: Trophy };

function CheckButton({ dog, ex }: { dog: DogId; ex: Exercise }) {
  const { state, dispatch, toast, fireCelebrate } = useApp();
  const done = state.completed[dog].includes(ex.id);
  const [burst, setBurst] = useState(0);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: 'toggleExercise', dog, id: ex.id });
        if (!done) {
          setBurst((b) => b + 1);
          navigator.vibrate?.([20, 40, 20]);
          toast(`${state.dogs[dog].name}: ${ex.title}`, 25);
          if (ex.level === 'program') fireCelebrate();
        }
      }}
      className="relative grid h-11 w-11 shrink-0 place-items-center"
      aria-label={`${done ? 'Avmarkera' : 'Klarmarkera'} för ${state.dogs[dog].name}`}
    >
      {burst > 0 && done && <span key={burst} className="absolute inset-0 animate-ring rounded-full border-2 border-[var(--a1)]" />}
      <span
        className={`relative grid h-9 w-9 place-items-center rounded-full border-2 transition-all duration-300 ${done ? 'scale-100 border-transparent text-ink' : 'border-white/25 text-transparent'}`}
        style={done ? { background: 'linear-gradient(135deg,var(--a1),var(--a2))', boxShadow: '0 0 16px var(--a1)' } : undefined}
      >
        {done ? <Check size={18} strokeWidth={3} className="animate-pop" /> : <Avatar dog={dog} size={30} className="opacity-60" />}
      </span>
    </button>
  );
}

export function ExerciseSheet({ ex, onClose, onOpen }: { ex: Exercise | null; onClose: () => void; onOpen: (e: Exercise) => void }) {
  const { profile, state, openGenerator, setExerciseEditor } = useApp();
  const addToPass = useAddToPass();
  if (!ex) return null;
  const dogs = dogsOf(profile).filter((d) => ex.suits.includes(d));
  const hacks = [
    ex.labbeHack?.general && { who: 'Alla labbar', text: ex.labbeHack.general },
    ex.labbeHack?.senior && profile !== 'puppy' && { who: `Senior · ${state.dogs.senior.name}`, text: ex.labbeHack.senior },
    ex.labbeHack?.puppy && profile !== 'senior' && { who: `Valp · ${state.dogs.puppy.name}`, text: ex.labbeHack.puppy },
  ].filter(Boolean) as { who: string; text: string }[];
  const LIcon = LEVEL_ICON[ex.level];

  return (
    <Sheet open onClose={onClose}>
      <div className="mb-1 flex flex-wrap items-center gap-2">
        {ex.custom && <span className="chip !text-amber-200">✏️ Egen övning</span>}
        <span className="chip"><LIcon size={12} /> {LEVEL_LABEL[ex.level]}</span>
        <span className="chip">{disciplineById(ex.discipline).name}</span>
        <span className="chip"><Clock size={12} /> {ex.minutes} min</span>
        <span className="chip">{'●'.repeat(ex.intensity)}{'○'.repeat(3 - ex.intensity)} intensitet</span>
      </div>
      <h2 className="mt-3 font-display text-[28px] font-semibold leading-tight">{ex.title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-white/70">{ex.summary}</p>

      {ex.builtFrom && (
        <div className="mt-5">
          <div className="label mb-2">Byggs av</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {ex.builtFrom.map((id, k) => {
              const b = exerciseById(id);
              if (!b) return null;
              return (
                <span key={id} className="flex items-center gap-1.5">
                  {k > 0 && <ChevronRight size={14} className="text-white/30" />}
                  <button onClick={() => onOpen(b)} className="chip !bg-white/10 active:scale-95">{b.title}</button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {ex.moments && (
        <div className="glass mt-5 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold"><Flag size={16} className="text-[var(--a2)]" /> Moment i programmet</div>
          <ol className="space-y-2">
            {ex.moments.map((m, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold tabular-nums">{i + 1}</span>
                {m}
              </li>
            ))}
          </ol>
        </div>
      )}

      {ex.equipment.length > 0 && <div className="label mb-2 mt-6">Utrustning</div>}
      <div className="grid grid-cols-3 gap-2">
        {ex.equipment.map((id) => {
          const Icon = EQUIP_ICONS[id];
          return (
            <div key={id} className="glass flex flex-col items-center gap-1.5 !rounded-2xl px-2 py-3 text-center">
              <Icon size={20} className="text-[var(--a1)]" />
              <span className="text-[11px] font-semibold leading-tight text-white/80">{EQUIPMENT[id].name}</span>
            </div>
          );
        })}
      </div>

      <div className="label mb-3 mt-6">{ex.steps.filter(Boolean).length > 1 ? `Inlärning i ${ex.steps.filter(Boolean).length} steg` : 'Så gör du'}</div>
      <ol className="relative space-y-4 pl-1">
        <span className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-[var(--a1)] to-[var(--a2)] opacity-40" />
        {ex.steps.filter(Boolean).map((s, i) => (
          <li key={i} className="relative flex gap-3.5">
            <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-extrabold text-ink" style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }}>
              {i + 1}
            </span>
            <p className="pt-1.5 text-[14.5px] leading-relaxed text-white/85">{s}</p>
          </li>
        ))}
      </ol>

      {ex.criteria.length > 0 && (
        <div className="glass mt-6 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold"><Target size={16} className="text-[var(--a2)]" /> Målbild – när sitter den?</div>
          <ul className="space-y-1.5">
            {ex.criteria.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-white/75"><Check size={16} className="mt-0.5 shrink-0 text-emerald-300" /> {c}</li>
            ))}
          </ul>
        </div>
      )}

      {hacks.length > 0 && (
        <div className="mt-4 space-y-2">
          {hacks.map((h) => (
            <div key={h.who} className="relative overflow-hidden rounded-2xl border border-amber-200/25 bg-gradient-to-br from-amber-300/[0.14] to-violet-400/[0.08] p-4">
              <div className="mb-1.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-200">
                <PawPrint size={14} /> Labbe-Hack · {h.who}
              </div>
              <p className="text-sm leading-relaxed text-white/85">{h.text}</p>
            </div>
          ))}
        </div>
      )}

      {ex.pairTip && (
        <div className="mt-3 flex gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
          <Users size={18} className="shrink-0 text-[var(--a1)]" /> {ex.pairTip}
        </div>
      )}

      <div className="label mb-2 mt-6">Klarmarkera</div>
      <div className="glass divide-y divide-white/[0.07]">
        {dogs.length ? (
          dogs.map((d) => (
            <div key={d} className="flex items-center gap-3 px-4 py-2">
              <Avatar dog={d} size={34} />
              <span className="flex-1 text-sm font-semibold">{state.dogs[d].name}</span>
              <CheckButton dog={d} ex={ex} />
            </div>
          ))
        ) : (
          <div className="p-4 text-sm text-white/55">Den här övningen är inte anpassad för vald hund.</div>
        )}
      </div>

      {ex.custom && (
        <button onClick={() => { onClose(); setExerciseEditor({ exercise: ex }); }} className="btn-ghost mt-5 w-full">
          <Pencil size={16} /> Redigera övningen
        </button>
      )}
      <button onClick={() => addToPass(ex)} className={`btn-accent w-full ${ex.custom ? 'mt-2' : 'mt-5'}`}>
        <ListPlus size={18} /> Lägg till i eget pass
      </button>
      <button onClick={() => { onClose(); openGenerator({ discipline: ex.discipline, minutes: 15 }); }} className="btn-ghost mt-2 w-full">
        <Timer size={18} /> Slumpa ett {disciplineById(ex.discipline).name.toLowerCase()}pass
      </button>
    </Sheet>
  );
}

function DisciplineDetail({ id, onBack, onOpen }: { id: DisciplineId; onBack: () => void; onOpen: (e: Exercise) => void }) {
  const { profile, state, setExerciseEditor } = useApp();
  const d = disciplineById(id);
  const dogs = dogsOf(profile);
  const Icon = ICONS[d.icon] ?? Sparkles;
  const exercises = allExercises().filter((e) => e.discipline === id);
  const levels: ExerciseLevel[] = ['byggsten', 'kedja', 'program'];

  return (
    <div className="animate-rise">
      <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-white/70 active:scale-95">
        <ArrowLeft size={18} /> Alla grenar
      </button>
      <div className="glass relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl" style={{ background: 'var(--a2)' }} />
        <div className="relative flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl text-ink" style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }}>
            <Icon size={26} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">{d.name}</h2>
            <div className="text-xs text-white/55">{d.tagline}</div>
          </div>
        </div>
        <div className="relative mt-5 space-y-3">
          {dogs.map((dog) => {
            const p = disciplineProgress(state, dog, id);
            return (
              <div key={dog}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-semibold"><Avatar dog={dog} size={20} /> {d.goalLabel}</span>
                  <span className="font-bold tabular-nums">{Math.round(p * 100)}%</span>
                </div>
                <Progress value={p} />
              </div>
            );
          })}
        </div>
      </div>

      {d.rules && (
        <details className="glass group mt-3 p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold">
            <Scale size={16} className="text-[var(--a2)]" />
            <span className="flex-1">{d.rules.official ? 'Tävlingsregler i korthet' : 'Om grenen'}</span>
            <ChevronRight size={16} className="text-white/50 transition group-open:rotate-90" />
          </summary>
          <div className="mt-3 text-[11px] font-semibold text-white/45">{d.rules.org} · {d.rules.period}</div>
          <ul className="mt-2 space-y-2">
            {d.rules.facts.map((f) => (
              <li key={f} className="flex gap-2 text-[13.5px] leading-snug text-white/80">
                <Check size={15} className="mt-0.5 shrink-0 text-emerald-300" /> {f}
              </li>
            ))}
          </ul>
          {d.rules.official && <p className="mt-3 text-[11px] leading-relaxed text-white/40">Sammanfattning – kontrollera alltid aktuell regelbok före tävling. Nya regler kan gälla från 2027.</p>}
        </details>
      )}

      <div className="mt-5 flex items-center gap-2 px-1 text-[11px] font-semibold text-white/50">
        <Puzzle size={14} /> Byggstenar <ChevronRight size={12} /> <Link2 size={14} /> Mini-kedjor <ChevronRight size={12} /> <Trophy size={14} /> Program
      </div>

      {levels.map((lvl) => {
        const list = exercises.filter((e) => e.level === lvl);
        if (!list.length) return null;
        const LIcon = LEVEL_ICON[lvl];
        return (
          <div key={lvl}>
            <SectionTitle kicker={lvl === 'byggsten' ? 'Steg 1' : lvl === 'kedja' ? 'Steg 2' : 'Steg 3'} title={lvl === 'byggsten' ? 'Delmoment' : lvl === 'kedja' ? 'Mini-kedjor' : 'Färdiga program & banor'} />
            <div className="space-y-2.5">
              {list.map((ex, k) => {
                const relevant = dogs.filter((dd) => ex.suits.includes(dd));
                return (
                  <div
                    key={ex.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpen(ex)}
                    className="glass flex animate-rise cursor-pointer items-center gap-3 p-3.5 pl-4 transition active:scale-[.98]"
                    style={{ animationDelay: `${k * 40}ms` }}
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10"><LIcon size={18} className="text-[var(--a1)]" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{ex.title}</div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50">
                        <span>{ex.minutes} min</span>
                        <span>· {ex.equipment.length} redskap</span>
                        {ex.labbeHack && <span className="font-bold text-amber-200/90">· Labbe-Hack</span>}
                        {ex.custom && <span className="font-bold text-amber-200/90">· Egen</span>}
                        {!relevant.length && <span className="text-rose-300/80">· ej för vald hund</span>}
                      </div>
                    </div>
                    <div className="flex -space-x-1.5">
                      {relevant.map((dd) => <CheckButton key={dd} dog={dd} ex={ex} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        onClick={() => setExerciseEditor({ discipline: id })}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-white/25 bg-white/[0.03] py-4 text-sm font-semibold text-white/80 active:scale-[.98]"
      >
        <Plus size={18} /> Skapa egen övning i {d.name.toLowerCase()}
      </button>
    </div>
  );
}

export function Training() {
  const { profile, state, openGenerator } = useApp();
  const [disc, setDisc] = useState<DisciplineId | null>(null);
  const [open, setOpen] = useState<Exercise | null>(null);
  const dogs = dogsOf(profile);

  const hacks = useMemo(() => {
    const list: { ex: Exercise; text: string; who: string }[] = [];
    EXERCISES.forEach((ex) => {
      if (ex.labbeHack?.general) list.push({ ex, text: ex.labbeHack.general, who: 'Alla' });
      if (ex.labbeHack?.senior && profile !== 'puppy') list.push({ ex, text: ex.labbeHack.senior, who: 'Senior' });
      if (ex.labbeHack?.puppy && profile !== 'senior') list.push({ ex, text: ex.labbeHack.puppy, who: 'Valp' });
    });
    return list;
  }, [profile]);

  return (
    <div>
      {disc ? (
        <DisciplineDetail id={disc} onBack={() => setDisc(null)} onOpen={setOpen} />
      ) : (
        <div className="animate-rise">
          {profile === 'puppy' && <div className="mb-3"><PuppyGuideCard /></div>}
          <button onClick={() => openGenerator({})} className="glass relative flex w-full items-center gap-4 overflow-hidden p-5 text-left transition active:scale-[.98]">
            <div className="pointer-events-none absolute inset-0 animate-shimmer opacity-20" style={{ backgroundImage: 'linear-gradient(110deg,transparent 30%,var(--a1) 50%,transparent 70%)', backgroundSize: '200% 100%' }} />
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl text-ink" style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }}>
              <Timer size={26} />
            </div>
            <div className="relative flex-1">
              <div className="font-display text-xl font-semibold">Pass-generator</div>
              <div className="text-xs text-white/60">Välj hund, gren och tid – få ett komplett pass med timer</div>
            </div>
            <ChevronRight className="relative text-white/50" />
          </button>

          <SectionTitle kicker="Eget upplägg" title="Mina pass" />
          <MyPasses />

          <SectionTitle kicker="Sporter" title="Träningsgrenar" />
          <div className="grid grid-cols-2 gap-3">
            {DISCIPLINES.map((d, k) => {
              const Icon = ICONS[d.icon] ?? Sparkles;
              const pr = dogs.map((dog) => disciplineProgress(state, dog, d.id));
              const avg = pr.reduce((a, b) => a + b, 0) / pr.length;
              const count = allExercises().filter((e) => e.discipline === d.id).length;
              return (
                <button key={d.id} onClick={() => setDisc(d.id)} className="glass flex animate-rise flex-col p-4 text-left transition active:scale-95" style={{ animationDelay: `${k * 50}ms` }}>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10"><Icon size={21} className="text-[var(--a1)]" /></div>
                    <span className="text-xs font-extrabold tabular-nums text-white/70">{Math.round(avg * 100)}%</span>
                  </div>
                  <div className="font-bold">{d.name}</div>
                  <div className="mb-3 text-[11px] text-white/50">{count} övningar · {d.goalLabel}</div>
                  <Progress value={avg} thin className="mt-auto" />
                </button>
              );
            })}
          </div>

          <SectionTitle kicker="Rasexpertis" title="Labbe-Hacks" right={<Lightbulb size={20} className="text-amber-200" />} />
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
            {hacks.map((h, k) => (
              <button
                key={k}
                onClick={() => setOpen(h.ex)}
                className="relative w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl border border-amber-200/20 bg-gradient-to-br from-amber-300/[0.14] via-white/[0.04] to-violet-400/[0.1] p-5 text-left backdrop-blur-xl"
              >
                <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-amber-200">
                  <PawPrint size={13} /> {h.who} · {h.ex.title}
                </div>
                <p className="text-sm leading-relaxed text-white/85">{h.text}</p>
              </button>
            ))}
          </div>

          <SectionTitle kicker="Pedagogik" title="Från byggsten till bana" />
          <div className="glass grid grid-cols-3 divide-x divide-white/10 p-4 text-center">
            {[
              { icon: Puzzle, t: 'Byggstenar', d: 'Ett moment i taget' },
              { icon: Layers, t: 'Mini-kedjor', d: '2–3 moment i följd' },
              { icon: Flag, t: 'Program', d: 'Hela banan' },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="px-2">
                <I size={20} className="mx-auto mb-2 text-[var(--a2)]" />
                <div className="text-xs font-bold">{t}</div>
                <div className="text-[10.5px] text-white/50">{d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ExerciseSheet ex={open} onClose={() => setOpen(null)} onOpen={setOpen} />
    </div>
  );
}

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, ArrowLeft, BookOpen, Check, ChevronDown, ChevronRight, Moon, PawPrint, Utensils } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ALL_GUIDE_ITEMS, DAY_SCHEDULE, FEEDING, PUPPY_PHASES, SLEEP_NOTE, type GuideTopic } from '../data/puppyGuide';
import { Avatar, Progress, Ring } from './ui';

const KIND_DOT: Record<(typeof DAY_SCHEDULE)[number]['kind'], string> = {
  ut: '#4ade80',
  mat: '#fcd34d',
  sov: '#a78bfa',
  lek: '#fb923c',
  traning: '#67e8f9',
};
const KIND_LABEL = { ut: 'Ut', mat: 'Mat', sov: 'Sömn', lek: 'Lek', traning: 'Miljö' };

/** Kort som öppnar guiden. Visas bara för valpen. */
export function PuppyGuideCard() {
  const { state } = useApp();
  const [open, setOpen] = useState(false);
  const done = state.puppyGuide.filter((id) => ALL_GUIDE_ITEMS.some((x) => x.id === id)).length;
  const pct = done / ALL_GUIDE_ITEMS.length;
  const next = PUPPY_PHASES.find((p) => p.topics.some((t) => t.checklist.some((c) => !state.puppyGuide.includes(c.id))));
  return (
    <>
      <button onClick={() => setOpen(true)} className="glass relative flex w-full items-center gap-4 overflow-hidden p-5 text-left transition active:scale-[.98]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-40 blur-3xl" style={{ background: 'var(--a1)' }} />
        <Ring value={pct} size={64} stroke={5}>
          <Avatar dog="puppy" size={50} />
        </Ring>
        <div className="relative min-w-0 flex-1">
          <div className="label">Valpguide</div>
          <div className="font-display text-xl font-semibold leading-tight">Första tiden med valpen</div>
          <div className="mt-0.5 truncate text-xs text-white/55">
            {done}/{ALL_GUIDE_ITEMS.length} klart{next ? ` · nu: ${next.label}` : ' · allt klart 🎉'}
          </div>
        </div>
        <ChevronRight className="relative shrink-0 text-white/50" />
      </button>
      {open && <PuppyGuide onClose={() => setOpen(false)} />}
    </>
  );
}

function TopicCard({ t, defaultOpen }: { t: GuideTopic; defaultOpen: boolean }) {
  const { state, dispatch, toast } = useApp();
  const [open, setOpen] = useState(defaultOpen);
  const done = t.checklist.filter((c) => state.puppyGuide.includes(c.id)).length;
  const complete = done === t.checklist.length;
  return (
    <div className={`glass overflow-hidden transition ${complete ? 'border-emerald-300/30' : ''}`}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 p-4 text-left">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-xl">{t.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="font-bold">{t.title}</div>
          <div className="mt-1 flex items-center gap-2">
            <Progress value={done / t.checklist.length} thin className="flex-1" />
            <span className={`text-[11px] font-bold tabular-nums ${complete ? 'text-emerald-300' : 'text-white/50'}`}>{done}/{t.checklist.length}</span>
          </div>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-white/50 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="animate-rise space-y-4 px-4 pb-4">
          <p className="text-[14.5px] leading-relaxed text-white/75">{t.intro}</p>
          <ol className="space-y-2.5">
            {t.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-white/85">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-ink" style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }}>
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          {t.mistakes && (
            <div className="rounded-2xl border border-rose-300/20 bg-rose-400/[0.07] p-3.5">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-200">
                <AlertTriangle size={13} /> Vanliga misstag
              </div>
              <ul className="space-y-1 text-sm text-white/75">
                {t.mistakes.map((m) => <li key={m}>• {m}</li>)}
              </ul>
            </div>
          )}
          {t.labbe && (
            <div className="rounded-2xl border border-amber-200/25 bg-gradient-to-br from-amber-300/[0.14] to-violet-400/[0.08] p-3.5">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-200">
                <PawPrint size={13} /> Labbe-Hack
              </div>
              <p className="text-sm leading-relaxed text-white/85">{t.labbe}</p>
            </div>
          )}
          <div>
            <div className="label mb-2">Checklista</div>
            <div className="space-y-1.5">
              {t.checklist.map((c) => {
                const on = state.puppyGuide.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      dispatch({ type: 'toggleGuide', id: c.id });
                      if (!on) {
                        navigator.vibrate?.(20);
                        toast(c.text, 10);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-sm font-semibold transition active:scale-[.98] ${on ? 'border-transparent bg-white/10 text-white/60' : 'border-white/12 bg-white/[0.04]'}`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${on ? 'border-transparent text-ink' : 'border-white/30'}`}
                      style={on ? { background: 'linear-gradient(135deg,var(--a1),var(--a2))' } : undefined}
                    >
                      {on && <Check size={14} strokeWidth={3} className="animate-pop" />}
                    </span>
                    <span className={on ? 'line-through decoration-white/30' : ''}>{c.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PuppyGuide({ onClose }: { onClose: () => void }) {
  const { state } = useApp();
  const firstOpen = PUPPY_PHASES.findIndex((p) => p.topics.some((t) => t.checklist.some((c) => !state.puppyGuide.includes(c.id))));
  const [phaseIdx, setPhaseIdx] = useState(Math.max(0, firstOpen));
  const phase = PUPPY_PHASES[phaseIdx];
  const done = state.puppyGuide.filter((id) => ALL_GUIDE_ITEMS.some((x) => x.id === id)).length;
  const showRoutines = phase.id === 'dag1' || phase.id === 'v1';

  return createPortal(
    <div className="fixed inset-0 z-[1100] animate-fade overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-2xl">
      <div className="mx-auto max-w-lg px-4 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[calc(env(safe-area-inset-top)+14px)] [html.artifact_&]:pt-3.5">
        <div className="sticky top-0 z-10 -mx-4 mb-2 flex items-center gap-3 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)] to-transparent px-4 pb-4 pt-1">
          <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 active:scale-90" aria-label="Tillbaka">
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="label">Valpguide · {state.dogs.puppy.name}</div>
            <div className="truncate font-display text-xl font-semibold">Första tiden med valpen</div>
          </div>
          <Ring value={done / ALL_GUIDE_ITEMS.length} size={44} stroke={4}>
            <span className="text-[10px] font-extrabold tabular-nums">{Math.round((done / ALL_GUIDE_ITEMS.length) * 100)}%</span>
          </Ring>
        </div>

        <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          {PUPPY_PHASES.map((p, i) => {
            const items = p.topics.flatMap((t) => t.checklist);
            const pd = items.filter((c) => state.puppyGuide.includes(c.id)).length;
            const active = i === phaseIdx;
            return (
              <button
                key={p.id}
                onClick={() => setPhaseIdx(i)}
                className={`shrink-0 rounded-2xl border px-4 py-2.5 text-left transition active:scale-95 ${active ? 'border-transparent text-ink' : 'border-white/12 bg-white/5'}`}
                style={active ? { background: 'linear-gradient(120deg,var(--a1),var(--a2))' } : undefined}
              >
                <div className="text-sm font-bold">{p.label}</div>
                <div className={`text-[10.5px] font-semibold ${active ? 'text-ink/70' : 'text-white/45'}`}>
                  {p.age} · {pd === items.length ? '✓ klart' : `${pd}/${items.length}`}
                </div>
              </button>
            );
          })}
        </div>

        <div key={phase.id} className="animate-rise space-y-3">
          <p className="px-1 text-[15px] leading-relaxed text-white/70">{phase.summary}</p>

          {showRoutines && (
            <>
              <div className="glass p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><BookOpen size={17} className="text-[var(--a1)]" /> Dagsschema, 8–12 veckor</div>
                <div className="relative space-y-0.5">
                  {DAY_SCHEDULE.map((s) => (
                    <div key={s.time} className="flex items-start gap-3 rounded-xl px-1 py-1.5">
                      <span className="w-11 shrink-0 pt-px text-xs font-bold tabular-nums text-white/55">{s.time}</span>
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: KIND_DOT[s.kind], boxShadow: `0 0 8px ${KIND_DOT[s.kind]}` }} />
                      <span className="text-[13.5px] leading-snug text-white/80">{s.what}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                  {(Object.keys(KIND_DOT) as (keyof typeof KIND_DOT)[]).map((k) => (
                    <span key={k} className="flex items-center gap-1.5 text-[11px] font-semibold text-white/55">
                      <span className="h-2 w-2 rounded-full" style={{ background: KIND_DOT[k] }} /> {KIND_LABEL[k]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="glass p-4">
                  <div className="mb-3 flex items-center gap-2 font-bold"><Utensils size={17} className="text-[var(--a2)]" /> Antal mål per dag</div>
                  <div className="divide-y divide-white/[0.07]">
                    {FEEDING.map((f) => (
                      <div key={f.age} className="flex items-center gap-3 py-2">
                        <span className="w-16 shrink-0 text-xs font-bold text-white/60">{f.age}</span>
                        <span className="w-14 shrink-0 text-sm font-extrabold">{f.meals}</span>
                        <span className="text-xs leading-snug text-white/55">{f.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass flex gap-3 p-4">
                  <Moon size={18} className="mt-0.5 shrink-0 text-violet-300" />
                  <p className="text-[13.5px] leading-relaxed text-white/75">{SLEEP_NOTE}</p>
                </div>
              </div>
            </>
          )}

          {phase.topics.map((t, i) => (
            <TopicCard key={t.id} t={t} defaultOpen={i === 0 && !t.checklist.every((c) => state.puppyGuide.includes(c.id))} />
          ))}

          <p className="px-1 pt-2 text-[11px] leading-relaxed text-white/35">
            Allmänna råd för en frisk labradorvalp. Följ alltid uppfödarens och veterinärens rekommendationer för foder, vaccin och avmaskning.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Images, ArrowRight, Bot, Camera, Check, ChevronRight, Clock, Dices, RotateCcw, Sparkles, Timer, Trophy } from 'lucide-react';
import type { Quest } from '../types';
import { useApp } from '../store/AppContext';
import { QUESTS } from '../data/quests';
import { dogsOf } from '../data/profiles';
import { generateInsights } from '../lib/coach';
import { isToday, levelInfo } from '../lib/xp';
import { Avatar, Progress, SectionTitle } from '../components/ui';
import { DISCIPLINES } from '../data/training';
import { PuppyGuideCard } from '../components/PuppyGuide';
import { CalmButton } from '../components/CalmButton';
import { TodayPanel } from '../components/TodayPanel';

function useTypewriter(text: string, speed = 14) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}

function CoachCard() {
  const { state, profile, openGenerator } = useApp();
  const insights = useMemo(() => generateInsights(state, profile), [state, profile]);
  const [idx, setIdx] = useState(0);
  const [thinking, setThinking] = useState(false);
  useEffect(() => setIdx(0), [profile]);
  const ins = insights[idx % Math.max(1, insights.length)];
  const typed = useTypewriter(thinking ? '' : ins?.body ?? '');

  const nextInsight = () => {
    setThinking(true);
    setTimeout(() => {
      setIdx((i) => i + 1);
      setThinking(false);
    }, 700);
  };

  if (!ins) return null;
  return (
    <div className="glass relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-40 blur-3xl" style={{ background: 'var(--a1)' }} />
      <div className="relative mb-3 flex items-center gap-2.5">
        <div className="relative grid h-10 w-10 place-items-center rounded-2xl text-ink" style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }}>
          <Bot size={20} />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg)] bg-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">Smart Coach</div>
          <div className="text-[11px] text-white/50">Analyserar {state.sessions.length} pass · {dogsOf(profile).map((d) => state.dogs[d].name).join(' & ')}</div>
        </div>
        <button onClick={nextInsight} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 active:rotate-180 transition-transform duration-500" aria-label="Ny insikt">
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="relative min-h-[118px]">
        {thinking ? (
          <div className="flex items-center gap-1.5 pt-4">
            {[0, 1, 2].map((k) => (
              <span key={k} className="h-2 w-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${k * 120}ms` }} />
            ))}
            <span className="ml-2 text-xs text-white/50">Tänker…</span>
          </div>
        ) : (
          <>
            <div className="mb-1.5 font-display text-lg font-semibold leading-snug">{ins.title}</div>
            <p className="text-[14px] leading-relaxed text-white/75">
              {typed}
              {typed.length < ins.body.length && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white/70 align-middle" />}
            </p>
          </>
        )}
      </div>
      <div className="relative mt-4 flex items-center justify-between">
        <div className="flex gap-1">
          {insights.map((_, k) => (
            <span key={k} className={`h-1.5 rounded-full transition-all ${k === idx % insights.length ? 'w-5 bg-white/80' : 'w-1.5 bg-white/25'}`} />
          ))}
        </div>
        {ins.cta && (
          <button onClick={() => openGenerator({ discipline: ins.cta!.discipline, minutes: ins.cta!.minutes })} className="btn-accent !px-4 !py-2.5 text-sm">
            {ins.cta.label} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function QuestCard() {
  const { profile, state, dispatch, toast, fireCelebrate, setTab, setPendingCheckin } = useApp();
  const pool = useMemo(() => QUESTS.filter((q) => q.for.includes(profile)), [profile]);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [rolling, setRolling] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setQuest(null);
    setDone(false);
  }, [profile]);

  const roll = () => {
    setDone(false);
    let n = 0;
    const total = 14;
    const tick = () => {
      n++;
      const r = pool[Math.floor(Math.random() * pool.length)];
      setRolling(r.title);
      if (n >= total) {
        const rest = pool.filter((q) => q.id !== quest?.id);
        const pick = rest[Math.floor(Math.random() * rest.length)] ?? r;
        setTimeout(() => {
          setRolling(null);
          setQuest(pick);
          navigator.vibrate?.(30);
        }, 160);
      } else {
        setTimeout(tick, 45 + n * n * 1.4);
      }
    };
    tick();
  };

  const complete = () => {
    if (!quest) return;
    const dogs = dogsOf(profile);
    dispatch({ type: 'xp', dogs, amount: quest.xp });
    dispatch({ type: 'questDone', questId: quest.id, profile });
    setDone(true);
    fireCelebrate();
    toast(dogs.length > 1 ? 'Quest klar – XP till båda!' : 'Quest klar!', quest.xp);
  };

  const todayDone = state.questsDone.filter((q) => isToday(q.date)).length;

  return (
    <div className="glass relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full opacity-30 blur-3xl" style={{ background: 'var(--a2)' }} />
      <div className="relative mb-4 flex items-center justify-between">
        <div>
          <div className="label">Dagens Quest</div>
          <div className="text-xs text-white/50">{todayDone} klarade idag</div>
        </div>
        {quest && !rolling && (
          <span className="chip">
            <Trophy size={13} /> +{quest.xp} XP{profile === 'both' ? ' ×2' : ''}
          </span>
        )}
      </div>

      {rolling ? (
        <div className="relative grid min-h-[108px] place-items-center">
          <div key={rolling} className="animate-pop text-center font-display text-xl font-semibold text-white/80 blur-[0.4px]">{rolling}</div>
        </div>
      ) : quest ? (
        <div key={quest.id} className="relative animate-rise">
          <h3 className="font-display text-[22px] font-semibold leading-tight">{quest.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-white/70">{quest.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip"><Clock size={12} /> ca {quest.minutes} min</span>
            <span className="chip"><Camera size={12} /> {quest.photoPrompt}</span>
          </div>
          {done ? (
            <div className="mt-4 grid animate-pop grid-cols-2 gap-2">
              <button
                className="btn-accent"
                onClick={() => {
                  setPendingCheckin({ questTitle: quest.title });
                  setTab('map');
                }}
              >
                <Camera size={18} /> Ta ett foto
              </button>
              <button className="btn-ghost" onClick={roll}>
                <Dices size={18} /> Ny quest
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <button className="btn-accent" onClick={complete}>
                <Check size={18} /> Klarmarkera
              </button>
              <button className="btn-ghost !px-4" onClick={roll} aria-label="Slumpa igen">
                <Dices size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex flex-col items-center py-2 text-center">
          <p className="mb-4 text-sm text-white/65">En rolig vardagsutmaning anpassad för {profile === 'both' ? 'båda hundarna' : state.dogs[profile].name}.</p>
          <button onClick={roll} className="btn-accent group w-full !py-5 text-lg">
            <Dices size={24} className="transition-transform duration-500 group-active:rotate-[200deg]" /> Överraska mig!
          </button>
        </div>
      )}
    </div>
  );
}

export function Home() {
  const { state, profile, openGenerator, setTab, setPlacesSection } = useApp();
  const photos = state.checkins.filter((c) => c.photo).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const dogs = dogsOf(profile);
  const recent = state.sessions.filter((s) => s.dogs.some((d) => dogs.includes(d))).slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="animate-rise"><CoachCard /></div>
      <div className="animate-rise [animation-delay:40ms]"><TodayPanel /></div>
      {profile !== 'senior' && <div className="animate-rise [animation-delay:30ms]"><CalmButton /></div>}
      {profile === 'puppy' && <div className="animate-rise [animation-delay:60ms]"><PuppyGuideCard /></div>}
      <div className="animate-rise [animation-delay:80ms]"><QuestCard /></div>

      <button onClick={() => openGenerator({})} className="glass flex w-full animate-rise items-center gap-4 p-4 text-left transition active:scale-[.98] [animation-delay:140ms]">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
          <Timer size={24} className="text-[var(--a1)]" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">Jag har X minuter</div>
          <div className="text-xs text-white/55">Generera ett tidsatt pass på sekunder</div>
        </div>
        <div className="flex gap-1.5">
          {[15, 30, 45].map((m) => (
            <span
              key={m}
              onClick={(e) => {
                e.stopPropagation();
                openGenerator({ minutes: m });
              }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-xs font-bold"
            >
              {m}
            </span>
          ))}
        </div>
      </button>

      <button
        onClick={() => {
          setPlacesSection('bilder');
          setTab('map');
        }}
        className="glass flex w-full animate-rise items-center gap-4 p-4 text-left transition active:scale-[.98] [animation-delay:170ms]"
      >
        <div className="flex -space-x-3">
          {photos.slice(0, 3).map((c) => (
            <img key={c.id} src={c.photo} alt="" className="h-12 w-12 rounded-2xl border-2 border-[var(--bg)] object-cover" />
          ))}
          {!photos.length && (
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
              <Images size={22} className="text-[var(--a2)]" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold">Bildbiblioteket</div>
          <div className="text-xs text-white/55">{photos.length ? `${photos.length} ${photos.length === 1 ? 'bild' : 'bilder'} samlade` : 'Alla foton du sparar samlas här'}</div>
        </div>
        <ChevronRight size={18} className="text-white/40" />
      </button>

      <SectionTitle kicker="Nivåer" title="Hundarnas resa" />
      <div className={`grid gap-3 ${dogs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {dogs.map((d) => {
          const lv = levelInfo(state.xp[d]);
          return (
            <button key={d} onClick={() => setTab('profile')} className="glass flex items-center gap-3 p-4 text-left active:scale-[.98] transition">
              <Avatar dog={d} size={dogs.length > 1 ? 42 : 52} ring />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{state.dogs[d].name}</div>
                <div className="mb-1.5 text-[11px] text-white/55">Nivå {lv.level} · {lv.into}/{lv.need} XP</div>
                <Progress value={lv.pct} thin />
              </div>
            </button>
          );
        })}
      </div>

      <SectionTitle kicker="Fokus" title="Rekommenderade grenar" right={<button onClick={() => setTab('training')} className="text-xs font-semibold text-white/60">Alla <ChevronRight size={14} className="inline" /></button>} />
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
        {DISCIPLINES.filter((d) => (profile === 'senior' ? ['sok', 'spar', 'tricks', 'vardag'] : profile === 'puppy' ? ['valp', 'stod', 'vardag', 'tricks'] : ['vardag', 'sok', 'tricks', 'rally']).includes(d.id)).map((d) => (
          <button key={d.id} onClick={() => openGenerator({ discipline: d.id, minutes: 15 })} className="glass w-40 shrink-0 p-4 text-left transition active:scale-95">
            <Sparkles size={18} className="mb-6 text-[var(--a2)]" />
            <div className="text-sm font-bold">{d.name}</div>
            <div className="text-[11px] leading-snug text-white/50">{d.tagline}</div>
          </button>
        ))}
      </div>

      <SectionTitle kicker="Historik" title="Senaste passen" />
      <div className="glass divide-y divide-white/[0.07]">
        {recent.map((s) => (
          <div key={s.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className="flex -space-x-2">{s.dogs.map((d) => <Avatar key={d} dog={d} size={30} />)}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{s.title}</div>
              <div className="text-[11px] text-white/50">
                {new Date(s.date).toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })} · {s.minutes} min
              </div>
            </div>
            <div className="text-xs font-bold text-[var(--a2)]">{'★'.repeat(Math.round(Object.values(s.ratings).reduce((a, b) => a + (b ?? 0), 0) / Math.max(1, Object.values(s.ratings).length)))}</div>
          </div>
        ))}
        {!recent.length && <div className="p-4 text-sm text-white/50">Inga pass ännu – kör ditt första!</div>}
      </div>
    </div>
  );
}

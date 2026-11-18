import { useRef, useState } from 'react';
import { Camera, Clock, Flame, Image as ImageIcon, Pencil, RotateCcw, Star, Trophy } from 'lucide-react';
import type { DogId } from '../types';
import { useApp } from '../store/AppContext';
import { ageText, dogsOf } from '../data/profiles';
import { DISCIPLINES } from '../data/training';
import { disciplineProgress } from '../lib/coach';
import { levelInfo, levelTitle, streakFor } from '../lib/xp';
import { Avatar, Progress, Ring, SectionTitle, Stars } from '../components/ui';

const readAvatar = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 320;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const s = Math.min(img.width, img.height);
      c.getContext('2d')!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.src = url;
  });

function DogCard({ dog }: { dog: DogId }) {
  const { state, dispatch } = useApp();
  const info = state.dogs[dog];
  const lv = levelInfo(state.xp[dog]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const streak = streakFor(state, dog);
  const sessions = state.sessions.filter((s) => s.dogs.includes(dog));
  const rated = sessions.map((s) => s.ratings[dog]).filter((x): x is number => !!x);
  const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : 0;

  return (
    <div className="glass relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full opacity-35 blur-3xl" style={{ background: dog === 'senior' ? '#8b5cf6' : '#f59e0b' }} />
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <Ring value={lv.pct} size={96} stroke={5}>
            <Avatar dog={dog} size={78} ring />
          </Ring>
          <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--bg)] text-ink" style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }} aria-label="Byt avatar">
            <Camera size={14} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) dispatch({ type: 'updateDog', dog, patch: { avatar: await readAvatar(f), customAvatar: true } });
              e.target.value = '';
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              defaultValue={info.name}
              onBlur={(e) => {
                dispatch({ type: 'updateDog', dog, patch: { name: e.target.value.trim() || info.name } });
                setEditing(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              className="w-full rounded-xl border border-white/25 bg-white/10 px-2 py-1 font-display text-xl font-semibold outline-none"
            />
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-left">
              <span className="font-display text-[22px] font-semibold leading-tight">{info.name}</span>
              <Pencil size={14} className="text-white/40" />
            </button>
          )}
          <div className="text-xs text-white/55">{info.breedLabel} · {ageText(info.birth)} · {info.weightKg} kg</div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold text-ink" style={{ background: 'linear-gradient(120deg,var(--a1),var(--a2))' }}>
            <Trophy size={12} /> Nivå {lv.level} · {levelTitle(lv.level)}
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="mb-1 flex justify-between text-[11px] font-semibold text-white/55">
          <span>{state.xp[dog]} XP totalt</span>
          <span>{lv.need - lv.into} XP till nivå {lv.level + 1}</span>
        </div>
        <Progress value={lv.pct} />
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-white/[0.06] py-3">
          <Flame size={16} className="mx-auto mb-1 text-orange-300" />
          <div className="font-display text-lg font-semibold">{streak}</div>
          <div className="text-[10px] font-semibold text-white/45">dagars streak</div>
        </div>
        <div className="rounded-2xl bg-white/[0.06] py-3">
          <Clock size={16} className="mx-auto mb-1 text-sky-300" />
          <div className="font-display text-lg font-semibold">{sessions.reduce((a, s) => a + s.minutes, 0)}</div>
          <div className="text-[10px] font-semibold text-white/45">min träning</div>
        </div>
        <div className="rounded-2xl bg-white/[0.06] py-3">
          <Star size={16} className="mx-auto mb-1 text-amber-300" />
          <div className="font-display text-lg font-semibold">{avg ? avg.toFixed(1) : '–'}</div>
          <div className="text-[10px] font-semibold text-white/45">snittbetyg</div>
        </div>
      </div>
    </div>
  );
}

function WeekChart() {
  const { state, profile } = useApp();
  const dogs = dogsOf(profile);
  const days = Array.from({ length: 7 }).map((_, k) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - k));
    const key = d.toDateString();
    const per = dogs.map((dog) =>
      state.sessions.filter((s) => s.dogs.includes(dog) && new Date(s.date).toDateString() === key).reduce((a, s) => a + s.minutes, 0),
    );
    return { label: d.toLocaleDateString('sv-SE', { weekday: 'narrow' }), per, today: k === 6 };
  });
  const max = Math.max(30, ...days.flatMap((d) => d.per));
  const total = days.reduce((a, d) => a + d.per.reduce((x, y) => x + y, 0), 0);
  return (
    <div className="glass p-5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="font-display text-3xl font-semibold">{total}<span className="ml-1 text-sm font-sans font-semibold text-white/50">min</span></div>
          <div className="text-xs text-white/50">senaste 7 dagarna</div>
        </div>
        {dogs.length > 1 && (
          <div className="flex gap-3 text-[11px] font-semibold text-white/60">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#a78bfa]" />Senior</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]" />Valp</span>
          </div>
        )}
      </div>
      <div className="flex h-32 items-end gap-2">
        {days.map((d, k) => (
          <div key={k} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div className="flex h-full w-full items-end justify-center gap-[3px]">
              {d.per.map((m, j) => (
                <div
                  key={j}
                  className="w-full max-w-[14px] rounded-t-md transition-all duration-700"
                  title={`${m} min`}
                  style={{
                    height: `${Math.max(4, (m / max) * 100)}%`,
                    background: dogs.length > 1 ? (dogs[j] === 'senior' ? '#a78bfa' : '#fcd34d') : 'linear-gradient(180deg,var(--a1),var(--a2))',
                    opacity: m ? 1 : 0.18,
                  }}
                />
              ))}
            </div>
            <span className={`text-[10px] font-bold uppercase ${d.today ? 'text-white' : 'text-white/40'}`}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Profile() {
  const { state, profile, dispatch, toast, syncStatus } = useApp();
  const dogs = dogsOf(profile);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="animate-rise space-y-4">
      {dogs.map((d) => <DogCard key={d} dog={d} />)}

      <SectionTitle kicker="Aktivitet" title="Veckan i siffror" />
      <WeekChart />

      <div className="grid grid-cols-3 gap-2">
        {[
          { n: state.sessions.filter((s) => s.dogs.some((d) => dogs.includes(d))).length, l: 'pass' },
          { n: state.questsDone.filter((q) => q.profile === profile || profile === 'both' || q.profile === 'both').length, l: 'quests' },
          { n: state.checkins.filter((c) => c.dogs.some((d) => dogs.includes(d))).length, l: 'minnen', icon: ImageIcon },
        ].map((x) => (
          <div key={x.l} className="glass py-4 text-center">
            <div className="font-display text-2xl font-semibold text-grad">{x.n}</div>
            <div className="text-[11px] font-semibold text-white/50">{x.l}</div>
          </div>
        ))}
      </div>

      <SectionTitle kicker="Framsteg" title="Mot tävlingsmålen" />
      <div className="glass space-y-4 p-5">
        {DISCIPLINES.map((disc) => (
          <div key={disc.id}>
            <div className="mb-1.5 text-sm font-bold">{disc.goalLabel}</div>
            <div className="space-y-1.5">
              {dogs.map((dog) => {
                const p = disciplineProgress(state, dog, disc.id);
                return (
                  <div key={dog} className="flex items-center gap-2.5">
                    {dogs.length > 1 && <Avatar dog={dog} size={18} />}
                    <Progress value={p} className="flex-1" />
                    <span className="w-9 text-right text-xs font-bold tabular-nums text-white/70">{Math.round(p * 100)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <SectionTitle kicker="Utvärdering" title="Senaste betygen" />
      <div className="space-y-2.5">
        {state.sessions.filter((s) => s.dogs.some((d) => dogs.includes(d))).slice(0, 6).map((s) => (
          <div key={s.id} className="glass p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{s.title}</div>
                <div className="text-[11px] text-white/50">{new Date(s.date).toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })} · {s.minutes} min · {'●'.repeat(s.intensity)} intensitet</div>
              </div>
            </div>
            <div className="space-y-1.5">
              {s.dogs.map((d) => (
                <div key={d} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-white/70"><Avatar dog={d} size={20} /> {state.dogs[d].name}</span>
                  <Stars value={s.ratings[d] ?? 0} size={15} />
                </div>
              ))}
            </div>
            {s.note && <p className="mt-2 border-t border-white/10 pt-2 text-xs italic text-white/60">”{s.note}”</p>}
          </div>
        ))}
      </div>

      <div className={`glass mt-6 flex items-center gap-3 p-4 text-sm ${syncStatus === 'fel' ? 'border-rose-300/30' : ''}`}>
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${syncStatus === 'synkad' ? 'bg-emerald-400' : syncStatus === 'ansluter' ? 'animate-pulse bg-amber-300' : syncStatus === 'fel' ? 'bg-rose-400' : 'bg-white/40'}`}
        />
        <div className="min-w-0 flex-1">
          <div className="font-semibold">
            {syncStatus === 'synkad' ? 'Synkas med ditt Claude-konto' : syncStatus === 'ansluter' ? 'Ansluter till Claudes lagring…' : syncStatus === 'fel' ? 'Kunde inte synka just nu' : 'Sparas bara på den här enheten'}
          </div>
          <div className="text-xs text-white/50">
            {syncStatus === 'synkad'
              ? 'Platser, minnen, pass och framsteg följer med på alla dina enheter.'
              : syncStatus === 'fel'
                ? 'Ändringarna sparas på enheten och synkas när anslutningen fungerar igen.'
                : 'Öppna appen via länken i Claude för att synka mellan enheter.'}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          if (confirmReset) {
            dispatch({ type: 'reset' });
            toast('Demodata återställd');
            setConfirmReset(false);
          } else {
            setConfirmReset(true);
            setTimeout(() => setConfirmReset(false), 4000);
          }
        }}
        className={`btn-ghost mx-auto mt-6 flex !text-xs ${confirmReset ? '!border-rose-300/50 !text-rose-200' : '!text-white/50'}`}
      >
        <RotateCcw size={14} /> {confirmReset ? 'Tryck igen för att radera allt' : 'Återställ demodata'}
      </button>
    </div>
  );
}

import { Heart, Trophy } from 'lucide-react';
import type { DogId } from '../types';
import { useApp } from '../store/AppContext';
import { PROFILE_META, ageText, daysUntilHome, homeDateText } from '../data/profiles';
import { levelInfo, levelTitle } from '../lib/xp';
import { Avatar } from './ui';

/** Stor avatar med roterande glow-ring och mjuk halo */
function HeroAvatar({ dog, size, delay = 0, tilt = 0 }: { dog: DogId; size: number; delay?: number; tilt?: number }) {
  return (
    <div style={{ width: size, height: size, transform: `rotate(${tilt}deg)` }}>
    <div className="relative h-full w-full animate-pop" style={{ animationDelay: `${delay}ms` }}>
      <div className="absolute -inset-6 rounded-full opacity-60 blur-2xl" style={{ background: 'radial-gradient(circle, var(--a1), transparent 70%)' }} />
      <div
        className="absolute -inset-[5px] rounded-full"
        style={{ background: 'conic-gradient(from 0deg, var(--a1), var(--a2), transparent 60%, var(--a1))', animation: 'spin 7s linear infinite' }}
      />
      <div className="absolute -inset-[1px] rounded-full" style={{ background: 'var(--bg)' }} />
      <Avatar dog={dog} size={size} className="relative !ring-0" />
    </div>
    </div>
  );
}

export function ProfileHero() {
  const { profile, state } = useApp();
  const meta = PROFILE_META[profile];

  if (profile === 'both') {
    return (
      <div key="both" className="glass relative mt-4 overflow-hidden px-5 pb-5 pt-7 text-center">
        <div className="relative mx-auto flex w-fit items-center justify-center">
          <HeroAvatar dog="senior" size={128} tilt={-4} />
          <div className="relative z-10 -mx-5 grid h-11 w-11 animate-pop place-items-center rounded-full border-2 border-[var(--bg)] text-ink [animation-delay:200ms]" style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }}>
            <Heart size={18} className="fill-current" />
          </div>
          <HeroAvatar dog="puppy" size={128} delay={90} tilt={4} />
        </div>
        <h2 className="mt-5 animate-rise font-display text-[26px] font-semibold leading-tight">
          {state.dogs.senior.name} <span className="text-grad">&</span> {state.dogs.puppy.name}
        </h2>
        <div className="mt-1 text-xs font-medium text-white/55">
          {ageText(state.dogs.senior.birth)} & {ageText(state.dogs.puppy.birth)} · flock på två labbar
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(['senior', 'puppy'] as DogId[]).map((d) => {
            const lv = levelInfo(state.xp[d]);
            return (
              <div key={d} className="rounded-2xl bg-white/[0.06] px-3 py-2 text-[11px] font-semibold text-white/70">
                <Trophy size={12} className="mr-1 inline text-[var(--a2)]" />
                {d === 'senior' ? 'Senior' : 'Valp'} · Nivå {lv.level}
              </div>
            );
          })}
        </div>
        <FocusChips items={meta.focus} />
      </div>
    );
  }

  const info = state.dogs[profile];
  const lv = levelInfo(state.xp[profile]);
  return (
    <div key={profile} className="glass relative mt-4 overflow-hidden px-5 pb-5 pt-7 text-center">
      <div className="mx-auto w-fit">
        <HeroAvatar dog={profile} size={168} />
      </div>
      <h2 className="mt-5 animate-rise font-display text-[30px] font-semibold leading-tight">{info.name}</h2>
      <div className="mt-1 text-xs font-medium text-white/55">
        {info.breedLabel} · {ageText(info.birth)} · {info.weightKg} kg
      </div>
      <div className="mt-3 inline-flex animate-rise items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold text-ink [animation-delay:80ms]" style={{ background: 'linear-gradient(120deg,var(--a1),var(--a2))' }}>
        <Trophy size={13} /> Nivå {lv.level} · {levelTitle(lv.level)}
      </div>
      {profile === 'puppy' && daysUntilHome(info.birth) > 0 && (
        <div className="mt-2 text-sm font-semibold text-[var(--a1)]">
          🏡 Kommer hem {homeDateText(info.birth)} – om {daysUntilHome(info.birth)} dagar
        </div>
      )}
      <FocusChips items={meta.focus} />
    </div>
  );
}

function FocusChips({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
      {items.map((f, i) => (
        <span key={f} className="chip animate-rise" style={{ animationDelay: `${120 + i * 50}ms` }}>
          {f}
        </span>
      ))}
    </div>
  );
}

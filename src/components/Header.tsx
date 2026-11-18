import { Flame } from 'lucide-react';
import type { ProfileId } from '../types';
import { useApp } from '../store/AppContext';
import { PROFILE_META, ageText } from '../data/profiles';
import { Avatar } from './ui';
import { ProfileHero } from './ProfileHero';
import { streakFor } from '../lib/xp';

const ORDER: ProfileId[] = ['senior', 'both', 'puppy'];

export function Header() {
  const { profile, setProfile, state, tab } = useApp();
  const idx = ORDER.indexOf(profile);
  const streak = streakFor(state);
  const hour = new Date().getHours();
  const greet = hour < 5 ? 'God natt' : hour < 10 ? 'God morgon' : hour < 17 ? 'Hej' : 'God kväll';
  const sub =
    profile === 'both'
      ? `${state.dogs.senior.name} & ${state.dogs.puppy.name}`
      : `${PROFILE_META[profile].label} · ${ageText(state.dogs[profile].birth)}`;
  const nameOf = (p: ProfileId) => (p === 'both' ? PROFILE_META.both.label : state.dogs[p].name);

  return (
    <header className="app-header px-4 pt-[calc(env(safe-area-inset-top)+14px)]">
      <div className="mb-4 flex items-center justify-between px-1">
        <div>
          <div className="label">{greet}</div>
          <div key={profile} className="animate-rise font-display text-[26px] font-semibold leading-tight">
            <span className="text-grad">{nameOf(profile)}</span>
          </div>
          <div className="text-xs font-medium text-white/55">{sub}</div>
        </div>
        <div className="chip !py-2 !text-sm">
          <Flame size={16} className="text-orange-300" />
          {streak}
        </div>
      </div>

      <div className="glass relative grid grid-cols-3 p-1.5">
        <div
          className="absolute bottom-1.5 top-1.5 rounded-[20px] transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]"
          style={{
            width: 'calc((100% - 12px) / 3)',
            left: `calc(6px + ${idx} * (100% - 12px) / 3)`,
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--a1) 35%, transparent), color-mix(in srgb, var(--a2) 25%, transparent))',
            boxShadow: '0 0 30px -4px var(--a1), inset 0 1px 0 rgba(255,255,255,.25)',
            border: '1px solid rgba(255,255,255,.2)',
          }}
        />
        {ORDER.map((p) => {
          const active = p === profile;
          return (
            <button
              key={p}
              onClick={() => setProfile(p)}
              className="relative z-10 flex flex-col items-center gap-1.5 rounded-[20px] py-2.5 transition active:scale-95"
              aria-pressed={active}
              aria-label={`Profil: ${nameOf(p)}`}
            >
              {p === 'both' ? (
                <div className="flex -space-x-3">
                  <Avatar dog="senior" size={active ? 40 : 34} ring={active} className="transition-all duration-500" />
                  <Avatar dog="puppy" size={active ? 40 : 34} ring={active} className="transition-all duration-500" />
                </div>
              ) : (
                <Avatar dog={p} size={active ? 40 : 34} ring={active} className="transition-all duration-500" />
              )}
              <span className={`text-[11px] font-bold tracking-wide transition ${active ? 'text-white' : 'text-white/50'}`}>
                {nameOf(p)}
              </span>
            </button>
          );
        })}
      </div>

      {tab === 'home' && <ProfileHero />}
    </header>
  );
}

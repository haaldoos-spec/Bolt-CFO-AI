import { Activity, Brain, Leaf } from 'lucide-react';
import type { DogId } from '../types';
import { useApp } from '../store/AppContext';
import { dogsOf, daysUntilHome, homeDateText } from '../data/profiles';
import { loadStatus, todayRings, type LoadLevel } from '../lib/insights';
import { Avatar, CountUp } from './ui';

const RING_COLORS = ['var(--a1)', 'var(--a2)', '#6ee7b7'];

/** Tre koncentriska ringar, som en aktivitetsmätare */
function Rings({ values, size = 132 }: { values: number[]; size?: number }) {
  const stroke = 9;
  const gap = 2;
  return (
    <svg width={size} height={size} className="-rotate-90">
      {values.map((v, i) => {
        const r = size / 2 - stroke / 2 - i * (stroke + gap);
        const c = 2 * Math.PI * r;
        const pct = Math.min(1, Math.max(0, v));
        return (
          <g key={i}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={RING_COLORS[i]}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)', filter: pct > 0 ? `drop-shadow(0 0 6px ${RING_COLORS[i]})` : undefined }}
            />
          </g>
        );
      })}
    </svg>
  );
}

const LOAD_STYLE: Record<LoadLevel, { color: string; pos: number }> = {
  bygg: { color: 'rgba(255,255,255,.5)', pos: 0.5 },
  redo: { color: '#67e8f9', pos: 0.2 },
  lagom: { color: '#6ee7b7', pos: 0.5 },
  hog: { color: '#fda4af', pos: 0.85 },
};

function DogToday({ dog }: { dog: DogId }) {
  const { state } = useApp();
  const info = state.dogs[dog];
  const left = dog === 'puppy' ? daysUntilHome(info.birth) : 0;

  if (left > 0) {
    return (
      <div className="glass flex items-center gap-4 p-4">
        <Avatar dog={dog} size={52} ring />
        <div className="min-w-0 flex-1">
          <div className="label">Idag · {info.name}</div>
          <div className="font-display text-lg font-semibold leading-tight">
            Kommer hem om <span className="num text-grad"><CountUp value={left} /></span> dagar
          </div>
          <div className="text-xs text-white/55">Hemflytt {homeDateText(info.birth)} – dagsmålen startar då.</div>
        </div>
      </div>
    );
  }

  const r = todayRings(state, dog);
  const ld = loadStatus(state, dog);
  const rows = [
    { icon: Activity, label: 'Aktivitet', v: r.activity, color: RING_COLORS[0] },
    { icon: Brain, label: 'Hjärngympa', v: r.brain, color: RING_COLORS[1] },
    { icon: Leaf, label: 'Lugn', v: r.calm, color: RING_COLORS[2] },
  ];
  const remaining = Math.max(0, r.goal - r.activity.min);
  const maxDay = Math.max(1, ...ld.week);
  const ls = LOAD_STYLE[ld.level];

  return (
    <div className="glass overflow-hidden p-4">
      <div className="mb-3 flex items-center gap-2">
        <Avatar dog={dog} size={26} />
        <div className="label flex-1">Idag · {info.name}</div>
        <span className="text-[11px] font-semibold text-white/50">{remaining ? `${remaining} min kvar till dagsmålet` : 'Dagsmålet nått ✨'}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Rings values={rows.map((x) => x.v.min / x.v.target)} />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="num font-display text-xl font-semibold leading-none"><CountUp value={r.activity.min} /></div>
              <div className="text-[9px] font-semibold text-white/50">av {r.goal} min</div>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {rows.map(({ icon: I, label, v, color }) => (
            <div key={label} className="flex items-center gap-2">
              <I size={14} style={{ color }} />
              <span className="flex-1 text-[13px] font-semibold text-white/80">{label}</span>
              <span className="num text-xs font-bold text-white/70">
                {v.min}<span className="text-white/35">/{v.target}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/[0.04] p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: ls.color, boxShadow: `0 0 8px ${ls.color}` }} />
          <span className="text-[13px] font-bold">{ld.label}</span>
          {ld.ratio !== null && <span className="num ml-auto text-[11px] font-semibold text-white/45">belastning {ld.ratio.toFixed(2)}</span>}
        </div>
        {/* Mätare: lugnt – lagom – högt */}
        <div className="relative mb-2 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, #67e8f9, #6ee7b7 45%, #6ee7b7 60%, #fda4af)' }}>
          {ld.ratio !== null && (
            <span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--bg)] transition-all duration-700"
              style={{ left: `${Math.min(96, Math.max(4, (ld.ratio / 2) * 100))}%` }}
            />
          )}
        </div>
        <p className="text-xs leading-snug text-white/60">{ld.advice}</p>
        <div className="mt-3 flex h-8 items-end gap-1">
          {ld.week.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-[4px] transition-all duration-700"
                style={{ height: `${Math.max(6, (v / maxDay) * 100)}%`, background: v ? 'linear-gradient(180deg,var(--a1),var(--a2))' : 'rgba(255,255,255,.08)' }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[9px] font-semibold uppercase tracking-wider text-white/35">
          <span>7 dagar sedan</span>
          <span>idag</span>
        </div>
      </div>
    </div>
  );
}

/** "Idag"-panelen på Hem: ringar och belastning per hund */
export function TodayPanel() {
  const { profile } = useApp();
  return (
    <div className="space-y-3">
      {dogsOf(profile).map((d) => <DogToday key={d} dog={d} />)}
    </div>
  );
}

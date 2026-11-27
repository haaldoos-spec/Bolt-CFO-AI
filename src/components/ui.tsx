import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  Bone, Cable, Coffee, Cookie, Disc, Disc3, Dumbbell, Fence, Flag, Footprints, House, LifeBuoy, Link, Megaphone,
  Mountain, MousePointerClick, Package, RectangleHorizontal, Search, Shirt, Signpost, Spline, Sparkles, Square,
  Star, Target, TrafficCone, Music, Medal, Trees, Waves, X, Zap, BedDouble, type LucideIcon,
} from 'lucide-react';
import type { DogId, EquipmentId } from '../types';
import { useApp } from '../store/AppContext';

export const ICONS: Record<string, LucideIcon> = {
  Home: House, Signpost, Footprints, Search, Zap, Sparkles, Trees, Mountain, Coffee, Waves, Music, Medal,
};

export const EQUIP_ICONS: Record<EquipmentId, LucideIcon> = {
  klicker: MousePointerClick, godis: Cookie, sparlina: Cable, koner: TrafficCone, bock: Dumbbell, sele: Shirt,
  koppel: Link, langlina: Spline, filt: BedDouble, skyltar: Signpost, nosework: Package, tunnel: Disc,
  hinder: Fence, balans: Disc3, leksak: Bone, apport: Dumbbell, targetplatta: Target, flytvast: LifeBuoy,
  pall: Square, visselpipa: Megaphone, pinne: Flag, matta: RectangleHorizontal,
};

export function Avatar({ dog, size = 48, ring = false, className = '' }: { dog: DogId; size?: number; ring?: boolean; className?: string }) {
  const { state } = useApp();
  const [err, setErr] = useState(false);
  const src = state.dogs[dog].avatar;
  useEffect(() => setErr(false), [src]);
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${ring ? 'glow-ring' : 'ring-1 ring-white/25'} ${className}`}
      style={{ width: size, height: size, background: dog === 'senior' ? 'radial-gradient(circle at 35% 30%,#5b5b7a,#14141f)' : 'radial-gradient(circle at 35% 30%,#ffe8a8,#c99a4e)' }}
    >
      {!err && <img src={src} alt={state.dogs[dog].name} onError={() => setErr(true)} className="h-full w-full object-cover" draggable={false} />}
      {err && <span className="grid h-full w-full place-items-center text-lg">🐕</span>}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-transparent to-black/20" />
    </div>
  );
}

/** Räknar mjukt upp till ett värde (för siffror som ska kännas levande) */
export function useCountUp(value: number, ms = 650) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(a + (value - a) * eased));
      if (k < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

export function CountUp({ value }: { value: number }) {
  return <>{useCountUp(value)}</>;
}

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  // Dra ner panelen för att stänga
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) setDrag(0);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-end justify-center">
      <div className="absolute inset-0 animate-fade bg-black/60 backdrop-blur-md" style={{ opacity: 1 - Math.min(drag / 400, 0.6) }} onClick={onClose} />
      <div
        ref={panel}
        className="glass-strong no-edge relative max-h-[92dvh] w-full max-w-lg animate-sheet overflow-y-auto rounded-b-none border-t border-white/15 bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3 no-scrollbar"
        style={{ transform: drag ? `translateY(${drag}px)` : undefined, transition: start.current === null ? 'transform .35s cubic-bezier(.2,.9,.2,1)' : 'none' }}
        onTouchStart={(e) => {
          // Bara när panelen är uppskrollad till toppen
          if ((panel.current?.scrollTop ?? 0) <= 0) start.current = e.touches[0].clientY;
        }}
        onTouchMove={(e) => {
          if (start.current === null) return;
          const dy = e.touches[0].clientY - start.current;
          setDrag(dy > 0 ? dy : 0);
        }}
        onTouchEnd={() => {
          const close = drag > 110;
          start.current = null;
          if (close) onClose();
          else setDrag(0);
        }}
      >
        <div className="sticky top-0 z-10 -mx-5 mb-2 flex items-center justify-between bg-gradient-to-b from-[var(--bg)] to-transparent px-5 pb-2 pt-1">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-white/30" />
          <button onClick={onClose} aria-label="Stäng" className="absolute right-4 top-1 grid h-9 w-9 place-items-center rounded-full bg-white/10 transition active:scale-90">
            <X size={18} />
          </button>
        </div>
        {title && <h2 className="mb-4 pr-10 font-display text-2xl font-semibold">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function Progress({ value, className = '', thin = false }: { value: number; className?: string; thin?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-full bg-white/10 ${thin ? 'h-1.5' : 'h-2.5'} ${className}`}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`, background: 'linear-gradient(90deg,var(--a1),var(--a2))', boxShadow: '0 0 12px var(--a1)' }}
      />
    </div>
  );
}

export function Ring({ value, size = 64, stroke = 6, children }: { value: number; size?: number; stroke?: number; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `rg-${size}-${stroke}`;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--a1)" />
            <stop offset="1" stopColor="var(--a2)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.1)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={`url(#${id})`} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, Math.max(0, value)))}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function Stars({ value, onChange, size = 28 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`transition ${onChange ? 'active:scale-75' : ''} ${n <= value ? 'scale-100' : 'scale-90 opacity-40'}`}
          aria-label={`${n} stjärnor`}
        >
          <Star size={size} className={n <= value ? 'fill-[var(--a2)] text-[var(--a2)] drop-shadow-[0_0_8px_var(--a2)]' : 'text-white'} />
        </button>
      ))}
    </div>
  );
}

export function SectionTitle({ kicker, title, right }: { kicker?: string; title: string; right?: ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-end justify-between px-1">
      <div>
        {kicker && (
          <div className="label mb-1.5 flex items-center gap-2">
            <span className="h-px w-4" style={{ background: 'linear-gradient(90deg, var(--a2), transparent)' }} />
            {kicker}
          </div>
        )}
        <h2 className="font-display text-[23px] font-semibold leading-tight tracking-[-0.01em]">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export function DogTag({ dog }: { dog: DogId }) {
  const { state } = useApp();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 py-0.5 pl-0.5 pr-2.5 text-xs font-semibold">
      <Avatar dog={dog} size={20} />
      {state.dogs[dog].name}
    </span>
  );
}

export function Confetti() {
  const { celebrate } = useApp();
  const [bursts, setBursts] = useState<number[]>([]);
  useEffect(() => {
    if (!celebrate) return;
    setBursts((b) => [...b, celebrate]);
    const t = setTimeout(() => setBursts((b) => b.filter((x) => x !== celebrate)), 1400);
    return () => clearTimeout(t);
  }, [celebrate]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[2000] overflow-hidden">
      {bursts.map((b) => (
        <div key={b} className="absolute left-1/2 top-1/2">
          {Array.from({ length: 42 }).map((_, i) => {
            const ang = (i / 42) * Math.PI * 2 + Math.random() * 0.4;
            const dist = 120 + Math.random() * 220;
            const emoji = i % 7 === 0 ? '🐾' : i % 11 === 0 ? '🦴' : '';
            return (
              <span
                key={i}
                className="absolute block animate-confetti"
                style={{
                  ['--dx' as string]: `${Math.cos(ang) * dist}px`,
                  ['--dy' as string]: `${Math.sin(ang) * dist + 120}px`,
                  ['--rot' as string]: `${Math.random() * 720 - 360}deg`,
                  width: emoji ? 'auto' : 8,
                  height: emoji ? 'auto' : 12,
                  borderRadius: 2,
                  background: emoji ? 'none' : i % 2 ? 'var(--a1)' : 'var(--a2)',
                  fontSize: 18,
                  animationDelay: `${Math.random() * 80}ms`,
                }}
              >
                {emoji}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function Toast() {
  const { toastMsg } = useApp();
  if (!toastMsg) return null;
  return (
    <div key={toastMsg.id} className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+12px)] z-[1500] flex justify-center px-4">
      <div className="glass-strong flex animate-rise items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold">
        {toastMsg.xp ? (
          <span className="rounded-full px-2 py-0.5 text-xs font-extrabold text-ink" style={{ background: 'linear-gradient(120deg,var(--a1),var(--a2))' }}>
            +{toastMsg.xp} XP
          </span>
        ) : null}
        {toastMsg.msg}
      </div>
    </div>
  );
}

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div
        className="aurora absolute left-1/2 top-[30%] h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] blur-[80px]"
        style={{ background: 'conic-gradient(from 0deg, var(--b1), transparent 25%, var(--b2), transparent 55%, var(--b3), transparent 85%, var(--b1))' }}
      />
      <div className="absolute -left-24 -top-24 h-80 w-80 animate-floaty rounded-full opacity-50 blur-[90px]" style={{ background: 'var(--b1)' }} />
      <div className="absolute -right-20 top-1/3 h-96 w-96 animate-floaty rounded-full opacity-35 blur-[110px] [animation-delay:-5s]" style={{ background: 'var(--b2)' }} />
      <div className="absolute -bottom-24 left-1/4 h-80 w-80 animate-floaty rounded-full opacity-30 blur-[100px] [animation-delay:-9s]" style={{ background: 'var(--b3)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(0,0,0,.55) 100%)' }} />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence baseFrequency=%27.8%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")' }} />
    </div>
  );
}

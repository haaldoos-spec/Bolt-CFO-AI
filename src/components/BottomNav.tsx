import { ChartNoAxesColumn, Dumbbell, Heart, House, Map } from 'lucide-react';
import type { TabId } from '../types';
import { useApp } from '../store/AppContext';

const TABS: { id: TabId; label: string; icon: typeof House }[] = [
  { id: 'home', label: 'Hem', icon: House },
  { id: 'map', label: 'Platser', icon: Map },
  { id: 'training', label: 'Träning', icon: Dumbbell },
  { id: 'profile', label: 'Statistik', icon: ChartNoAxesColumn },
  { id: 'mamma', label: 'Mamma', icon: Heart },
];

export function BottomNav() {
  const { tab, setTab } = useApp();
  const idx = Math.max(0, TABS.findIndex((t) => t.id === tab));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[900] flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+10px)]">
      <div className="glass-strong relative grid w-full max-w-lg grid-cols-5 rounded-[30px] bg-[color-mix(in_srgb,var(--bg)_60%,transparent)] p-2">
        {/* Glidande kapsel bakom aktiv flik */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 left-2 top-2 rounded-[22px] transition-transform duration-500 [transition-timing-function:cubic-bezier(.3,1.25,.4,1)]"
          style={{
            width: 'calc((100% - 16px) / 5)',
            transform: `translateX(${idx * 100}%)`,
            background: 'linear-gradient(135deg, color-mix(in srgb,var(--a1) 34%,transparent), color-mix(in srgb,var(--a2) 20%,transparent))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25), 0 8px 24px -8px var(--a1)',
          }}
        />
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => {
                if (!active) navigator.vibrate?.(8);
                setTab(id);
              }}
              className={`relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[22px] transition duration-300 active:scale-90 ${active ? 'text-white' : 'text-white/45 hover:text-white/70'}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={22} strokeWidth={active ? 2.3 : 1.8} className={`relative transition duration-300 ${active ? '-translate-y-px drop-shadow-[0_0_10px_var(--a1)]' : ''}`} />
              <span className="relative text-[10.5px] font-semibold leading-none tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

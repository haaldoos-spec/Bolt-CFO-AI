import { ChartNoAxesColumn, Dumbbell, House, Map } from 'lucide-react';
import type { TabId } from '../types';
import { useApp } from '../store/AppContext';

const TABS: { id: TabId; label: string; icon: typeof House }[] = [
  { id: 'home', label: 'Hem', icon: House },
  { id: 'map', label: 'Karta & Dagbok', icon: Map },
  { id: 'training', label: 'Träning', icon: Dumbbell },
  { id: 'profile', label: 'Statistik', icon: ChartNoAxesColumn },
];

export function BottomNav() {
  const { tab, setTab } = useApp();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[900] flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+10px)]">
      <div className="glass-strong grid w-full max-w-lg grid-cols-4 gap-1 rounded-[28px] bg-[color-mix(in_srgb,var(--bg)_55%,transparent)] p-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[20px] transition active:scale-90 ${active ? 'text-white' : 'text-white/45'}`}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <span
                  className="absolute inset-0 animate-pop rounded-[20px]"
                  style={{ background: 'linear-gradient(135deg, color-mix(in srgb,var(--a1) 30%,transparent), color-mix(in srgb,var(--a2) 18%,transparent))', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2)' }}
                />
              )}
              <Icon size={22} strokeWidth={active ? 2.4 : 1.9} className={`relative transition ${active ? 'drop-shadow-[0_0_10px_var(--a1)]' : ''}`} />
              <span className="relative text-[10.5px] font-semibold leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

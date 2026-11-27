import { useState } from 'react';
import { HeartHandshake, Phone } from 'lucide-react';
import { Sheet } from './ui';

const STEPS = [
  { t: 'Andas', d: 'Andas in genom näsan i 4 sekunder och ut genom munnen i 6. Gör det fem gånger. Du behöver inte göra något annat just nu.' },
  { t: 'Be Kyle om ”hand”', d: 'Håll fram handen. När nosen rör vid handflatan – känn hur varm och mjuk den är. Fokusera på just det.' },
  { t: '”Nosa” och ”knä”', d: 'Be honom puffa mjukt med nosen och sedan lägga huvudet i knät. Klappa långsamt och låt axlarna sjunka.' },
];

export function CalmButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass mb-3 flex w-full items-center gap-3 p-4 text-left transition active:scale-[.98]"
      >
        <div className="grid h-11 w-11 place-items-center rounded-2xl text-ink" style={{ background: 'linear-gradient(135deg,var(--a1),var(--a2))' }}>
          <HeartHandshake size={22} />
        </div>
        <div className="flex-1">
          <div className="font-display text-lg font-semibold">Jag har ångest nu</div>
          <div className="text-xs text-white/60">Tre enkla steg tillsammans med Kyle</div>
        </div>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Du är inte ensam – ta det lugnt">
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-bold">{i + 1}</div>
              <div>
                <div className="font-semibold">{s.t}</div>
                <div className="text-sm leading-snug text-white/70">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm">
          <div className="mb-2 flex items-center gap-2 font-bold"><Phone size={15} /> Behöver du mer stöd?</div>
          <ul className="space-y-1 text-white/80">
            <li><b>112</b> – akut fara</li>
            <li><b>1177</b> – sjukvårdsrådgivning</li>
            <li><b>90101</b> – Självmordslinjen (Mind), dygnet runt</li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-white/45">Kyle är ett stöd, inte en ersättning för vård eller behandling.</p>
        </div>
      </Sheet>
    </>
  );
}

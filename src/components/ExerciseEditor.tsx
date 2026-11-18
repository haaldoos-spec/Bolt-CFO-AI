import { useEffect, useState } from 'react';
import { Check, Minus, Plus, Save, Trash2 } from 'lucide-react';
import type { DisciplineId, DogId, EquipmentId, Exercise, ExerciseLevel } from '../types';
import { useApp } from '../store/AppContext';
import { DISCIPLINES, EQUIPMENT, LEVEL_LABEL } from '../data/training';
import { dogsOf } from '../data/profiles';
import { Avatar, EQUIP_ICONS, Sheet } from './ui';
import { newPass } from './PassBuilder';

const field = 'w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-white/35';

/** Skapa eller redigera en egen övning */
export function ExerciseEditor() {
  const { state, profile, dispatch, exerciseEditor, setExerciseEditor, setPassDraft, toast } = useApp();
  const editing = exerciseEditor?.exercise;
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState<DisciplineId>('vardag');
  const [level, setLevel] = useState<ExerciseLevel>('byggsten');
  const [suits, setSuits] = useState<DogId[]>(['senior', 'puppy']);
  const [minutes, setMinutes] = useState(5);
  const [intensity, setIntensity] = useState<1 | 2 | 3>(1);
  const [summary, setSummary] = useState('');
  const [steps, setSteps] = useState(['', '', '']);
  const [criteria, setCriteria] = useState('');
  const [equipment, setEquipment] = useState<EquipmentId[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!exerciseEditor) return;
    const e = exerciseEditor.exercise;
    setTitle(e?.title ?? '');
    setDiscipline(e?.discipline ?? exerciseEditor.discipline ?? 'vardag');
    setLevel(e?.level ?? 'byggsten');
    setSuits(e?.suits ?? dogsOf(profile));
    setMinutes(e?.minutes ?? 5);
    setIntensity(e?.intensity ?? 1);
    setSummary(e?.summary ?? '');
    setSteps(e ? [...e.steps] : ['', '', '']);
    setCriteria(e?.criteria.join('\n') ?? '');
    setEquipment(e?.equipment ?? []);
    setConfirmDelete(false);
  }, [exerciseEditor, profile]);

  if (!exerciseEditor) return null;
  const close = () => setExerciseEditor(null);

  const save = () => {
    if (!title.trim()) {
      toast('Ge övningen ett namn');
      return;
    }
    const s = steps.map((x) => x.trim());
    const ex: Exercise = {
      id: editing?.id ?? `own-${crypto.randomUUID()}`,
      discipline,
      level,
      title: title.trim(),
      summary: summary.trim() || 'Egen övning.',
      suits: suits.length ? suits : ['senior', 'puppy'],
      minutes,
      intensity,
      equipment,
      steps: [s[0] || summary.trim() || title.trim(), s[1], s[2]],
      criteria: criteria.split('\n').map((x) => x.trim()).filter(Boolean),
      custom: true,
    };
    dispatch({ type: 'saveExercise', exercise: ex });
    if (exerciseEditor.addToDraft) {
      setPassDraft((cur) => {
        const base = cur ?? newPass(dogsOf(profile));
        return { ...base, items: [...base.items, { id: crypto.randomUUID(), exerciseId: ex.id, minutes: Math.min(10, ex.minutes) }] };
      });
      toast(`${ex.title} skapad och tillagd i passet`);
    } else {
      toast(editing ? 'Övningen är uppdaterad' : `${ex.title} skapad`);
    }
    close();
  };

  return (
    <Sheet open onClose={close} title={editing ? 'Redigera övning' : 'Ny egen övning'}>
      <input id="ex-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Namn, t.ex. Vänta vid grinden" className={`${field} mb-4 !py-3.5 text-[15px] font-semibold`} />

      <div className="label mb-2">Gren</div>
      <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 no-scrollbar">
        {DISCIPLINES.map((d) => (
          <button
            key={d.id}
            onClick={() => setDiscipline(d.id)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${discipline === d.id ? 'border-transparent text-ink' : 'border-white/15 bg-white/5 text-white/75'}`}
            style={discipline === d.id ? { background: 'linear-gradient(120deg,var(--a1),var(--a2))' } : undefined}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <div className="label mb-2">Passar för</div>
          <div className="flex gap-2">
            {(['senior', 'puppy'] as DogId[]).map((d) => {
              const on = suits.includes(d);
              return (
                <button key={d} onClick={() => setSuits((cur) => (on ? cur.filter((x) => x !== d) : [...cur, d]))} className={`rounded-full p-0.5 transition ${on ? '' : 'opacity-35'}`} aria-label={state.dogs[d].name} aria-pressed={on}>
                  <Avatar dog={d} size={36} ring={on} />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="label mb-2">Tid</div>
          <div className="flex w-fit items-center rounded-full bg-white/[0.07]">
            <button onClick={() => setMinutes((m) => Math.max(1, m - 1))} className="grid h-9 w-9 place-items-center" aria-label="Kortare"><Minus size={14} /></button>
            <span className="w-14 text-center text-sm font-bold tabular-nums">{minutes} min</span>
            <button onClick={() => setMinutes((m) => Math.min(60, m + 1))} className="grid h-9 w-9 place-items-center" aria-label="Längre"><Plus size={14} /></button>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <div className="label mb-2">Nivå</div>
          <select value={level} onChange={(e) => setLevel(e.target.value as ExerciseLevel)} className={`${field} !py-2.5 [&>option]:bg-neutral-900`}>
            {(Object.keys(LEVEL_LABEL) as ExerciseLevel[]).map((l) => <option key={l} value={l}>{LEVEL_LABEL[l]}</option>)}
          </select>
        </div>
        <div>
          <div className="label mb-2">Intensitet</div>
          <div className="flex gap-1.5">
            {([1, 2, 3] as const).map((n) => (
              <button key={n} onClick={() => setIntensity(n)} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${intensity === n ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5 text-white/50'}`}>
                {n === 1 ? 'Lugn' : n === 2 ? 'Medel' : 'Hög'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="label mb-2">Beskrivning</div>
      <textarea id="ex-summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} placeholder="Vad går övningen ut på?" className={`${field} mb-4 resize-none`} />

      <div className="label mb-2">Steg för steg (valfritt)</div>
      <div className="mb-4 space-y-2">
        {steps.map((st, i) => (
          <div key={i} className="flex gap-2">
            <span className="mt-2.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold">{i + 1}</span>
            <textarea value={st} onChange={(e) => setSteps((cur) => cur.map((x, k) => (k === i ? e.target.value : x)))} rows={2} placeholder={i === 0 ? 'Första steget…' : 'Nästa steg…'} className={`${field} resize-none`} />
          </div>
        ))}
      </div>

      <div className="label mb-2">Målbild – när sitter den? (en per rad, valfritt)</div>
      <textarea value={criteria} onChange={(e) => setCriteria(e.target.value)} rows={2} placeholder={'Klarar 3 av 3\nFungerar ute'} className={`${field} mb-4 resize-none`} />

      <div className="label mb-2">Utrustning (valfritt)</div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {(Object.keys(EQUIPMENT) as EquipmentId[]).map((id) => {
          const on = equipment.includes(id);
          const Icon = EQUIP_ICONS[id];
          return (
            <button
              key={id}
              onClick={() => setEquipment((cur) => (on ? cur.filter((x) => x !== id) : [...cur, id]))}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${on ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5 text-white/55'}`}
            >
              {on ? <Check size={12} /> : <Icon size={12} />} {EQUIPMENT[id].name}
            </button>
          );
        })}
      </div>

      <button onClick={save} className="btn-accent w-full">
        <Save size={18} /> {exerciseEditor.addToDraft ? 'Skapa och lägg till i passet' : editing ? 'Spara ändringar' : 'Skapa övning'}
      </button>
      {editing && (
        <button
          onClick={() => {
            if (confirmDelete) {
              dispatch({ type: 'deleteExercise', id: editing.id });
              toast('Övningen är borttagen');
              close();
            } else setConfirmDelete(true);
          }}
          className={`btn-ghost mt-2 w-full !py-2.5 text-sm ${confirmDelete ? '!border-rose-300/50 !text-rose-200' : '!text-rose-300/70'}`}
        >
          <Trash2 size={15} /> {confirmDelete ? 'Tryck igen – tas även bort ur dina pass' : 'Ta bort övningen'}
        </button>
      )}
    </Sheet>
  );
}

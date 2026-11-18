import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Check, ClipboardPaste, ImagePlus, Map as MapIcon, MapPin, MoreHorizontal, Navigation, Plus, Star, Trash2 } from 'lucide-react';
import type { CheckIn, DogId, Place, PlaceCategory } from '../types';
import { useApp } from '../store/AppContext';
import { DEFAULT_CENTER, HOME_LABEL, PLACES, PLACE_CATS, distanceKm } from '../data/places';
import { dogsOf } from '../data/profiles';
import { appleMapsDirectionsUrl, appleMapsPlaceAtUrl, appleMapsSearchUrl, googleMapsDirectionsUrl, googleMapsPlaceUrl, googleMapsSearchUrl, isAppleMobile, mapsAppName, parseMapsLink, type ParsedMapsLink, type TravelMode } from '../lib/maps';
import { Avatar, ICONS, SectionTitle, Sheet } from '../components/ui';

const CAT_EMOJI: Record<PlaceCategory, string> = { skog: '🌲', balans: '🪨', cafe: '☕', vatten: '🌊' };

/** Söktext för platser utan exakt position */
const queryFor = (p: Place) => p.mapsQuery ?? `${p.name}, ${HOME_LABEL}`;

/** Målet för kartappen: egna platser med exakt position, annars söktext */
const destinationFor = (p: Place) => {
  if (p.custom && !p.noCoords) return `${p.lat},${p.lng}`;
  if (p.custom) return p.address ?? (/,/.test(p.name) ? p.name : `${p.name}, ${HOME_LABEL}`);
  return queryFor(p);
};

/** Visa platsen – Apple Kartor på iPhone, Google Maps på datorn */
const mapsLinkFor = (p: Place) => {
  if (!isAppleMobile()) return p.mapsUrl?.includes('google') ? p.mapsUrl : googleMapsSearchUrl(destinationFor(p));
  if (p.custom) return p.noCoords ? (p.mapsUrl || appleMapsSearchUrl(destinationFor(p))) : appleMapsPlaceAtUrl(p.lat, p.lng, p.name);
  return appleMapsSearchUrl(queryFor(p));
};

/** Vägbeskrivning dit – det som öppnas när man trycker på en plats */
const directionsFor = (p: Place, mode: TravelMode = 'driving') => {
  // Kort delningslänk utan position eller adress: öppna länken själv – den visar exakt rätt plats
  if (p.custom && p.noCoords && !p.address && p.mapsUrl) return p.mapsUrl;
  return isAppleMobile() ? appleMapsDirectionsUrl(destinationFor(p), mode) : googleMapsDirectionsUrl(destinationFor(p), mode);
};

const distText = (p: Place) => {
  if (p.noCoords) return null;
  const d = distanceKm(DEFAULT_CENTER, [p.lat, p.lng]);
  return d < 10 ? `${d.toFixed(1)} km` : `${Math.round(d)} km`;
};

const downscale = (file: File, max = 720): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.78));
    };
    img.onerror = reject;
    img.src = url;
  });

const ageAt = (birth: string, iso: string) => {
  const w = Math.floor((+new Date(iso) - +new Date(birth)) / (7 * 864e5));
  if (w < 0) return 'innan han föddes';
  return w < 52 ? `${w} veckor` : `${Math.floor(w / 52)} år`;
};

function PhotoThumb({ c, className = '' }: { c: CheckIn; className?: string }) {
  const { state } = useApp();
  const place = [...state.myPlaces, ...PLACES].find((p) => p.id === c.placeId);
  return c.photo ? (
    <img src={c.photo} alt={c.placeName} className={`object-cover ${className}`} />
  ) : (
    <div className={`grid place-items-center text-4xl ${className}`} style={{ background: 'linear-gradient(135deg, color-mix(in srgb,var(--a1) 55%, #000), color-mix(in srgb,var(--a2) 45%, #000))' }}>
      {place ? (place.custom ? '⭐' : CAT_EMOJI[place.category]) : '🐾'}
    </div>
  );
}

/** En rad i listan: hela raden öppnar vägbeskrivning i Apple Kartor */
function PlaceRow({ p, onMore }: { p: Place; onMore: () => void }) {
  const dist = distText(p);
  return (
    <div className="glass flex items-stretch overflow-hidden">
      <a href={directionsFor(p)} target="_blank" rel="noreferrer" className="flex min-w-0 flex-1 items-center gap-3 p-3.5 transition active:bg-white/5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl" style={{ background: p.custom ? 'rgba(252,211,77,.18)' : `${PLACE_CATS[p.category].color}33` }}>
          {p.custom ? '⭐' : CAT_EMOJI[p.category]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{p.name}</div>
          <div className="truncate text-[11px] text-white/50">
            {PLACE_CATS[p.category].label}
            {p.description ? ` · ${p.description}` : ''}
          </div>
        </div>
        <span className="chip shrink-0">
          <Navigation size={11} /> {dist ?? 'Hitta dit'}
        </span>
      </a>
      <button onClick={onMore} className="grid w-12 shrink-0 place-items-center border-l border-white/10 text-white/60 active:bg-white/5" aria-label={`Mer om ${p.name}`}>
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}

/** Klistra in en delad länk från Apple Kartor eller Google Maps och spara den som en rad i appen */
function AddFromMaps({ onSaved }: { onSaved: (p: Place) => void }) {
  const { profile, dispatch, toast } = useApp();
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<ParsedMapsLink | null>(null);
  const [name, setName] = useState('');
  const [cat, setCat] = useState<PlaceCategory>('skog');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handle = (value: string) => {
    setText(value);
    setError('');
    const p = parseMapsLink(value);
    setParsed(p);
    if (p?.name) setName(p.name);
    if (!p && value.trim()) setError('Hittar ingen länk. I Kartor: tryck på platsen → Dela → Kopiera, och klistra in här.');
  };

  const reset = () => {
    setText('');
    setParsed(null);
    setName('');
    setNote('');
    setCat('skog');
  };

  const saveManual = !parsed && name.trim().length > 1;

  const buildPlace = (): Place => {
    const finalName = name.trim() || parsed?.address || 'Min plats';
    const hasCoords = parsed?.lat !== undefined && parsed?.lng !== undefined;
    return {
      id: `my-${crypto.randomUUID()}`,
      name: finalName,
      category: cat,
      lat: hasCoords ? parsed!.lat! : DEFAULT_CENTER[0],
      lng: hasCoords ? parsed!.lng! : DEFAULT_CENTER[1],
      noCoords: !hasCoords,
      mapsUrl: parsed?.url || undefined,
      address: parsed?.address,
      description: note.trim(),
      goodFor: [],
      seniorFriendly: profile !== 'puppy',
      puppyFriendly: profile !== 'senior',
      custom: true,
      createdAt: new Date().toISOString(),
    };
  };

  const save = () => {
    const place = buildPlace();
    dispatch({ type: 'addPlace', place });
    toast(`${place.name} sparad ⭐`);
    onSaved(place);
    reset();
  };

  return (
    <div className="glass p-4">
      <div className="mb-1 flex items-center gap-2 font-bold">
        <ClipboardPaste size={17} className="text-amber-300" /> Spara plats från Kartor
      </div>
      <p className="mb-3 text-[13px] leading-relaxed text-white/60">
        Hittat en grillplats eller ett bra ställe? Tryck på platsen i Apple Kartor → <b>Dela</b> → <b>Kopiera</b>, och klistra in här. Den hamnar som en rad under Mina platser.
      </p>
      <textarea
        id="maps-paste"
        value={text}
        onChange={(e) => handle(e.target.value)}
        rows={2}
        placeholder="Klistra in länk från Apple Kartor eller Google Maps – eller skriv bara ett namn nedan"
        className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-3.5 text-sm outline-none placeholder:text-white/35 focus:border-white/35"
      />
      {error && <p className="mt-2 text-xs text-rose-200">{error}</p>}
      {parsed && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
          <Check size={14} /> {parsed.source === 'koordinater' ? 'Koordinater' : `Länk från ${parsed.source === 'apple' ? 'Apple Kartor' : parsed.source === 'google' ? 'Google Maps' : 'webben'}`}
          {parsed.lat !== undefined ? ' med position – vägbeskrivning går direkt dit' : parsed.address ? ' med adress – vägbeskrivning går dit' : ' (kort länk utan position)'}
        </p>
      )}

      <input
        id="maps-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Namn, t.ex. Grillplats Egnahem"
        className="mt-3 w-full rounded-2xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-white/35 focus:border-white/35"
      />

      {parsed && parsed.lat === undefined && !parsed.address && (
        <div className="mt-3 rounded-2xl border border-amber-200/25 bg-amber-300/[0.08] p-3 text-[12.5px] leading-relaxed text-white/80">
          Den här korta länken innehåller ingen position, så ett tryck öppnar platsen i Kartor och du får trycka på Vägbeskrivning där.
          För vägen direkt med ett tryck: kopiera platsens <b>koordinater</b> i Kartor (t.ex. ”57.78912, 14.28851”) och klistra in dem på en egen rad under länken.
        </div>
      )}

      {(parsed || name.trim()) && (
        <div className="animate-rise">
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(Object.keys(PLACE_CATS) as PlaceCategory[]).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-xs font-semibold transition active:scale-95 ${cat === c ? 'border-white/45 bg-white/15' : 'border-white/10 bg-white/5 text-white/65'}`}
              >
                <span className="text-base">{CAT_EMOJI[c]}</span> {PLACE_CATS[c].label}
              </button>
            ))}
          </div>
          <input
            id="maps-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anteckning (valfritt) – t.ex. vindskydd, ved finns"
            className="mt-3 w-full rounded-2xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm outline-none placeholder:text-white/35 focus:border-white/35"
          />
          {/* Länken sparar platsen och öppnar vägbeskrivningen i samma tryck */}
          <a href={directionsFor(buildPlace())} target="_blank" rel="noreferrer" onClick={save} className="btn-accent mt-3 w-full">
            <Navigation size={18} /> Spara och visa vägen dit
          </a>
          <button onClick={save} className="btn-ghost mt-2 w-full !py-2.5 text-sm">
            <Star size={16} /> Spara utan att öppna kartan
          </button>
          {saveManual && <p className="mt-2 text-[11px] text-white/45">Utan länk söker kartan på namnet i {HOME_LABEL}. Säkrast är att klistra in en länk eller koordinater.</p>}
        </div>
      )}
    </div>
  );
}

function CheckinSheet({ open, onClose, initialPlace, questTitle, onSaved }: {
  open: boolean; onClose: () => void; initialPlace?: Place | null; questTitle?: string; onSaved: (c: CheckIn) => void;
}) {
  const { profile, state, dispatch, toast, fireCelebrate } = useApp();
  const allPlaces = [...state.myPlaces, ...PLACES];
  const [placeId, setPlaceId] = useState<string>('');
  const [photo, setPhoto] = useState<string | undefined>();
  const [note, setNote] = useState('');
  const [dogs, setDogs] = useState<DogId[]>(dogsOf(profile));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPlaceId(initialPlace?.id ?? 'hemma');
      setPhoto(undefined);
      setNote(questTitle ? `Quest: ${questTitle} ✅ ` : '');
      setDogs(dogsOf(profile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialPlace, questTitle, profile]);

  const save = () => {
    const p = allPlaces.find((x) => x.id === placeId);
    const c: CheckIn = {
      id: crypto.randomUUID(),
      placeId: p?.id,
      placeName: p?.name ?? `Hemma i ${HOME_LABEL}`,
      lat: p?.lat ?? DEFAULT_CENTER[0],
      lng: p?.lng ?? DEFAULT_CENTER[1],
      date: new Date().toISOString(),
      dogs,
      note: note.trim(),
      photo,
      questTitle,
    };
    dispatch({ type: 'addCheckin', checkin: c });
    dispatch({ type: 'xp', dogs, amount: 15 });
    fireCelebrate();
    toast('Minne sparat i dagboken!', 15);
    onSaved(c);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Nytt minne">
      {questTitle && <div className="chip mb-4 !text-[var(--a2)]"><Check size={12} /> {questTitle}</div>}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setPhoto(await downscale(f));
          e.target.value = '';
        }}
      />
      <button onClick={() => fileRef.current?.click()} className="relative mb-4 grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-3xl border border-dashed border-white/25 bg-white/5 transition active:scale-[.98]">
        {photo ? (
          <>
            <img src={photo} alt="" className="absolute inset-0 h-full w-full animate-fade object-cover" />
            <span className="chip absolute bottom-3 right-3 !bg-black/50"><Camera size={12} /> Byt bild</span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/60">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10"><ImagePlus size={26} /></div>
            <span className="text-sm font-semibold">Ta eller välj ett foto</span>
          </div>
        )}
      </button>

      <div className="label mb-2">Plats</div>
      <select value={placeId} onChange={(e) => setPlaceId(e.target.value)} className="mb-4 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm font-semibold outline-none [&>option]:bg-neutral-900">
        <option value="hemma">🏡 Hemma i {HOME_LABEL}</option>
        {allPlaces.map((p) => (
          <option key={p.id} value={p.id}>{p.custom ? '⭐' : CAT_EMOJI[p.category]} {p.name}</option>
        ))}
      </select>

      <div className="label mb-2">Vem var med?</div>
      <div className="mb-4 flex gap-2">
        {(['senior', 'puppy'] as DogId[]).map((d) => {
          const on = dogs.includes(d);
          return (
            <button
              key={d}
              onClick={() => setDogs((cur) => (on ? (cur.length > 1 ? cur.filter((x) => x !== d) : cur) : [...cur, d]))}
              className={`flex flex-1 items-center gap-2 rounded-2xl border p-2 pr-3 text-sm font-semibold transition active:scale-95 ${on ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5 text-white/50'}`}
            >
              <Avatar dog={d} size={30} ring={on} /> {state.dogs[d].name}
            </button>
          );
        })}
      </div>

      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Vad hände idag?" className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-4 text-sm outline-none placeholder:text-white/35 focus:border-white/35" />
      <button onClick={save} className="btn-accent mt-4 w-full"><MapPin size={18} /> Spara minne</button>
    </Sheet>
  );
}

export function Places() {
  const { state, dispatch, pendingCheckin, setPendingCheckin, toast } = useApp();
  const [filters, setFilters] = useState<PlaceCategory[]>([]);
  const [onlyMine, setOnlyMine] = useState(false);
  const [placeOpen, setPlaceOpen] = useState<Place | null>(null);
  const [memory, setMemory] = useState<CheckIn | null>(null);
  const [checkin, setCheckin] = useState<{ place?: Place | null; quest?: string } | null>(null);
  const [dogFilter, setDogFilter] = useState<DogId | 'all'>('all');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingCheckin) {
      setCheckin({ quest: pendingCheckin.questTitle });
      setPendingCheckin(null);
    }
  }, [pendingCheckin, setPendingCheckin]);

  const matches = (p: Place) => !filters.length || filters.includes(p.category);
  const mine = state.myPlaces.filter(matches);
  const tips = useMemo(
    () =>
      PLACES.filter(matches)
        .map((p) => ({ p, d: distanceKm(DEFAULT_CENTER, [p.lat, p.lng]) }))
        .sort((a, b) => a.d - b.d)
        .map((x) => x.p),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters],
  );

  const timeline = state.checkins
    .filter((c) => dogFilter === 'all' || c.dogs.includes(dogFilter))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const grouped = timeline.reduce<Record<string, CheckIn[]>>((acc, c) => {
    const k = new Date(c.date).toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });
    (acc[k] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="animate-rise">
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        <button
          onClick={() => setOnlyMine((v) => !v)}
          className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold backdrop-blur-xl transition active:scale-95 ${onlyMine ? 'border-white/50 bg-white/20' : 'border-white/15 bg-white/[0.06] text-white/75'}`}
        >
          <Star size={15} className="text-amber-300" /> Mina platser{state.myPlaces.length ? ` · ${state.myPlaces.length}` : ''}
        </button>
        {(Object.keys(PLACE_CATS) as PlaceCategory[]).map((c) => {
          const on = filters.includes(c);
          const Icon = ICONS[PLACE_CATS[c].icon];
          return (
            <button
              key={c}
              onClick={() => setFilters((f) => (on ? f.filter((x) => x !== c) : [...f, c]))}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold backdrop-blur-xl transition active:scale-95 ${on ? 'border-white/50 bg-white/20' : 'border-white/15 bg-white/[0.06] text-white/75'}`}
            >
              <Icon size={15} style={{ color: PLACE_CATS[c].color }} /> {PLACE_CATS[c].label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a href={isAppleMobile() ? appleMapsPlaceAtUrl(DEFAULT_CENTER[0], DEFAULT_CENTER[1], HOME_LABEL) : `https://www.google.com/maps/@${DEFAULT_CENTER[0]},${DEFAULT_CENTER[1]},13z`} target="_blank" rel="noreferrer" className="btn-ghost !justify-start !py-3.5">
          <MapIcon size={18} className="text-[var(--a1)]" /> Öppna Kartor
        </a>
        <button onClick={() => setCheckin({})} className="btn-accent !justify-start !py-3.5">
          <Camera size={18} /> Nytt minne
        </button>
      </div>

      <SectionTitle
        kicker="Favoriter"
        title="Mina platser"
        right={<button onClick={() => addRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="chip active:scale-95"><Plus size={12} /> Lägg till</button>}
      />
      <div className="space-y-2">
        {mine.map((p) => <PlaceRow key={p.id} p={p} onMore={() => setPlaceOpen(p)} />)}
        {!mine.length && !filters.length && (
          <p className="px-1 text-sm text-white/50">Inga egna platser än. Spara din första nedan – trycker du på den får du vägbeskrivning dit.</p>
        )}
      </div>
      <div ref={addRef} className="mt-3">
        <AddFromMaps onSaved={() => setOnlyMine(false)} />
      </div>

      {!onlyMine && (
        <>
          <SectionTitle kicker="Tips" title={`Äventyr runt ${HOME_LABEL}`} />
          <div className="space-y-2">
            {tips.map((p) => <PlaceRow key={p.id} p={p} onMore={() => setPlaceOpen(p)} />)}
          </div>
          <p className="mt-2 px-1 text-[11px] text-white/40">Tryck på en plats för vägbeskrivning – i Apple Kartor på iPhone, i Google Maps på datorn. Avstånd räknas från {HOME_LABEL} centrum.</p>
        </>
      )}

      <SectionTitle kicker="Bilddagbok" title="Tidslinje" right={<span className="text-xs font-semibold text-white/50">{timeline.length} minnen</span>} />
      <div className="mb-4 flex gap-2">
        {(['all', 'senior', 'puppy'] as const).map((f) => (
          <button key={f} onClick={() => setDogFilter(f)} className={`flex items-center gap-1.5 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs font-semibold transition ${dogFilter === f ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5 text-white/60'}`}>
            {f === 'all' ? <span className="grid h-6 w-6 place-items-center">🐾</span> : <Avatar dog={f} size={24} />}
            {f === 'all' ? 'Alla' : state.dogs[f].name}
          </button>
        ))}
      </div>

      <div className="relative pl-5">
        <span className="absolute bottom-2 left-[7px] top-2 w-0.5 rounded-full bg-gradient-to-b from-[var(--a1)] via-[var(--a2)] to-transparent opacity-50" />
        {Object.entries(grouped).map(([month, list]) => (
          <div key={month} className="mb-6">
            <div className="relative mb-3 text-sm font-bold capitalize text-white/80">
              <span className="absolute -left-[19px] top-1 h-3 w-3 rounded-full border-2 border-[var(--bg)]" style={{ background: 'var(--a1)', boxShadow: '0 0 10px var(--a1)' }} />
              {month}
            </div>
            <div className="space-y-3">
              {list.map((c) => (
                <button key={c.id} onClick={() => setMemory(c)} className="glass flex w-full gap-3 overflow-hidden p-2.5 text-left transition active:scale-[.98]">
                  <PhotoThumb c={c} className="h-24 w-24 shrink-0 rounded-2xl" />
                  <div className="min-w-0 flex-1 py-1 pr-1">
                    <div className="text-[11px] font-semibold text-white/45">{new Date(c.date).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                    <div className="truncate text-sm font-bold">{c.placeName}</div>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-white/65">{c.note}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">{c.dogs.map((d) => <Avatar key={d} dog={d} size={18} />)}</div>
                      {c.dogs.includes('puppy') && <span className="text-[10px] font-semibold text-[var(--a2)]">{state.dogs.puppy.name} {ageAt(state.dogs.puppy.birth, c.date)}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {!timeline.length && <div className="text-sm text-white/50">Inga minnen än – tryck på ”Nytt minne”.</div>}
      </div>

      {/* Platsinfo */}
      <Sheet open={!!placeOpen} onClose={() => { setPlaceOpen(null); setConfirmDelete(false); }} title={placeOpen?.name}>
        {placeOpen && (
          <>
            <div className="-mt-2 mb-4 flex flex-wrap gap-2">
              {placeOpen.custom && <span className="chip !text-amber-200">⭐ Min plats</span>}
              <span className="chip" style={{ color: PLACE_CATS[placeOpen.category].color }}>{CAT_EMOJI[placeOpen.category]} {PLACE_CATS[placeOpen.category].label}</span>
              {distText(placeOpen) && <span className="chip"><Navigation size={11} /> {distText(placeOpen)} från {HOME_LABEL}</span>}
            </div>
            {placeOpen.description && <p className="mb-4 text-[15px] leading-relaxed text-white/75">{placeOpen.description}</p>}
            {placeOpen.custom && (
              <div className="mb-4 rounded-2xl bg-white/[0.05] p-3 text-[11px] leading-relaxed text-white/50">
                {placeOpen.noCoords ? (placeOpen.address ? `Adress: ${placeOpen.address}` : 'Ingen position – öppnar den sparade länken.') : `Position: ${placeOpen.lat.toFixed(5)}, ${placeOpen.lng.toFixed(5)}`}
                {placeOpen.mapsUrl && <div className="mt-1 select-all break-all text-white/40">{placeOpen.mapsUrl}</div>}
              </div>
            )}
            {placeOpen.goodFor.length > 0 && (
              <>
                <div className="label mb-2">Bra för</div>
                <div className="mb-5 flex flex-wrap gap-2">{placeOpen.goodFor.map((g) => <span key={g} className="chip !bg-white/10">{g}</span>)}</div>
              </>
            )}
            {state.checkins.filter((c) => c.placeId === placeOpen.id).length > 0 && (
              <>
                <div className="label mb-2">Era minnen här</div>
                <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar">
                  {state.checkins.filter((c) => c.placeId === placeOpen.id).map((c) => (
                    <button key={c.id} onClick={() => { setPlaceOpen(null); setMemory(c); }}><PhotoThumb c={c} className="h-20 w-20 rounded-2xl" /></button>
                  ))}
                </div>
              </>
            )}
            <div className="space-y-2">
              <a href={directionsFor(placeOpen, 'driving')} target="_blank" rel="noreferrer" className="btn-accent w-full">
                <Navigation size={18} /> Vägbeskrivning med bil
              </a>
              {(
                <a href={directionsFor(placeOpen, 'walking')} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                  <Navigation size={16} /> Vägbeskrivning till fots
                </a>
              )}
              <a href={mapsLinkFor(placeOpen)} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                <MapIcon size={16} /> Visa platsen i {mapsAppName()}
              </a>
              {isAppleMobile() && (
                <a href={placeOpen.mapsUrl?.includes('google') ? placeOpen.mapsUrl : googleMapsPlaceUrl(destinationFor(placeOpen), '')} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                  <MapIcon size={16} /> Google Maps
                </a>
              )}
              <button onClick={() => { const p = placeOpen; setPlaceOpen(null); setCheckin({ place: p }); }} className="btn-ghost w-full">
                <Camera size={16} /> Spara ett minne här
              </button>
              {placeOpen.custom && (
                <button
                  onClick={() => {
                    if (confirmDelete) {
                      dispatch({ type: 'deletePlace', id: placeOpen.id });
                      setPlaceOpen(null);
                      setConfirmDelete(false);
                      toast('Platsen är borttagen');
                    } else {
                      setConfirmDelete(true);
                      setTimeout(() => setConfirmDelete(false), 4000);
                    }
                  }}
                  className={`btn-ghost w-full ${confirmDelete ? '!border-rose-300/50 !text-rose-200' : '!text-rose-300/80'}`}
                >
                  <Trash2 size={16} /> {confirmDelete ? 'Tryck igen för att ta bort' : 'Ta bort platsen'}
                </button>
              )}
            </div>
          </>
        )}
      </Sheet>

      {/* Minne */}
      <Sheet open={!!memory} onClose={() => setMemory(null)}>
        {memory && (
          <>
            <PhotoThumb c={memory} className="mb-4 aspect-[4/3] w-full rounded-3xl !text-7xl" />
            <div className="text-xs font-semibold text-white/50">{new Date(memory.date).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <h2 className="font-display text-2xl font-semibold">{memory.placeName}</h2>
            {memory.questTitle && <div className="chip mt-2 !text-[var(--a2)]">🏆 {memory.questTitle}</div>}
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">{memory.note || 'Ingen anteckning.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {memory.dogs.map((d) => (
                <span key={d} className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm font-semibold">
                  <Avatar dog={d} size={24} /> {state.dogs[d].name}
                  <span className="text-xs font-normal text-white/50">{ageAt(state.dogs[d].birth, memory.date)}</span>
                </span>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {(() => {
                const p = [...state.myPlaces, ...PLACES].find((x) => x.id === memory.placeId);
                return p ? (
                  <a href={directionsFor(p)} target="_blank" rel="noreferrer" className="btn-ghost"><Navigation size={16} /> Hitta dit</a>
                ) : (
                  <span className="btn-ghost opacity-40"><MapIcon size={16} /> Ingen plats</span>
                );
              })()}
              <button onClick={() => { dispatch({ type: 'deleteCheckin', id: memory.id }); setMemory(null); }} className="btn-ghost !text-rose-300"><Trash2 size={16} /> Ta bort</button>
            </div>
          </>
        )}
      </Sheet>

      <CheckinSheet
        open={!!checkin}
        onClose={() => setCheckin(null)}
        initialPlace={checkin?.place}
        questTitle={checkin?.quest}
        onSaved={() => setCheckin(null)}
      />
    </div>
  );
}


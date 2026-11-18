import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Camera, Check, ImagePlus, LocateFixed, MapPin, Navigation, Plus, Trash2 } from 'lucide-react';
import type { CheckIn, DogId, Place, PlaceCategory } from '../types';
import { useApp } from '../store/AppContext';
import { DEFAULT_CENTER, PLACES, PLACE_CATS, distanceKm } from '../data/places';
import { dogsOf } from '../data/profiles';
import { Avatar, ICONS, SectionTitle, Sheet } from '../components/ui';

const CAT_EMOJI: Record<PlaceCategory, string> = { skog: '🌲', balans: '🪨', cafe: '☕', vatten: '🌊' };

const placeIcon = (p: Place) =>
  L.divIcon({
    className: '',
    html: `<div class="place-pin" style="background:${PLACE_CATS[p.category].color}"><span>${CAT_EMOJI[p.category]}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });

const photoIcon = (c: CheckIn) =>
  L.divIcon({
    className: '',
    html: `<div class="photo-pin">${c.photo ? `<img src="${c.photo}" alt=""/>` : '🐾'}</div>`,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
  });

const meIcon = L.divIcon({ className: '', html: '<div class="me-pin"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });

function FlyTo({ target }: { target: { pos: [number, number]; zoom: number; k: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target.pos, target.zoom, { duration: 1.1 });
  }, [target, map]);
  return null;
}

/** Skalar ner bilden så den ryms i localStorage */
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
  return w < 52 ? `${w} veckor` : `${Math.floor(w / 52)} år`;
};

function PhotoThumb({ c, className = '' }: { c: CheckIn; className?: string }) {
  const place = PLACES.find((p) => p.id === c.placeId);
  return c.photo ? (
    <img src={c.photo} alt={c.placeName} className={`object-cover ${className}`} />
  ) : (
    <div className={`grid place-items-center text-4xl ${className}`} style={{ background: 'linear-gradient(135deg, color-mix(in srgb,var(--a1) 55%, #000), color-mix(in srgb,var(--a2) 45%, #000))' }}>
      {place ? CAT_EMOJI[place.category] : '🐾'}
    </div>
  );
}

function CheckinSheet({ open, onClose, initialPlace, userPos, questTitle, onSaved }: {
  open: boolean; onClose: () => void; initialPlace?: Place | null; userPos: [number, number] | null; questTitle?: string; onSaved: (c: CheckIn) => void;
}) {
  const { profile, state, dispatch, toast, fireCelebrate } = useApp();
  const [placeId, setPlaceId] = useState<string>('');
  const [photo, setPhoto] = useState<string | undefined>();
  const [note, setNote] = useState('');
  const [dogs, setDogs] = useState<DogId[]>(dogsOf(profile));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPlaceId(initialPlace?.id ?? (userPos ? 'me' : PLACES[0].id));
      setPhoto(undefined);
      setNote(questTitle ? `Quest: ${questTitle} ✅ ` : '');
      setDogs(dogsOf(profile));
    }
  }, [open, initialPlace, userPos, questTitle, profile]);

  const save = () => {
    const p = PLACES.find((x) => x.id === placeId);
    const pos: [number, number] = p ? [p.lat, p.lng] : userPos ?? DEFAULT_CENTER;
    const jitter = () => (Math.random() - 0.5) * 0.0012;
    const c: CheckIn = {
      id: crypto.randomUUID(),
      placeId: p?.id,
      placeName: p?.name ?? 'Min plats',
      lat: pos[0] + (p ? jitter() : 0),
      lng: pos[1] + (p ? jitter() : 0),
      date: new Date().toISOString(),
      dogs,
      note: note.trim(),
      photo,
      questTitle,
    };
    dispatch({ type: 'addCheckin', checkin: c });
    dispatch({ type: 'xp', dogs, amount: 15 });
    fireCelebrate();
    toast('Minne sparat på kartan!', 15);
    onSaved(c);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Checka in">
      {questTitle && <div className="chip mb-4 !text-[var(--a2)]"><Check size={12} /> {questTitle}</div>}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
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
        {userPos && <option value="me">📍 Min nuvarande position</option>}
        {PLACES.map((p) => (
          <option key={p.id} value={p.id}>{CAT_EMOJI[p.category]} {p.name}</option>
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

export function MapDiary() {
  const { state, dispatch, pendingCheckin, setPendingCheckin, toast } = useApp();
  const [filters, setFilters] = useState<PlaceCategory[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [fly, setFly] = useState<{ pos: [number, number]; zoom: number; k: number } | null>(null);
  const [placeOpen, setPlaceOpen] = useState<Place | null>(null);
  const [memory, setMemory] = useState<CheckIn | null>(null);
  const [checkin, setCheckin] = useState<{ place?: Place | null; quest?: string } | null>(null);
  const [dogFilter, setDogFilter] = useState<DogId | 'all'>('all');
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingCheckin) {
      setCheckin({ quest: pendingCheckin.questTitle });
      setPendingCheckin(null);
    }
  }, [pendingCheckin, setPendingCheckin]);

  const places = PLACES.filter((p) => !filters.length || filters.includes(p.category));
  const nearby = useMemo(() => {
    if (!userPos) return [];
    return places.map((p) => ({ p, d: distanceKm(userPos, [p.lat, p.lng]) })).sort((a, b) => a.d - b.d).slice(0, 4);
  }, [userPos, places]);

  const flyTo = (pos: [number, number], zoom = 14) => {
    setFly({ pos, zoom, k: Date.now() });
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const locate = () => {
    if (!navigator.geolocation) {
      toast('Platstjänster saknas – visar Stockholm');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(p);
        flyTo(p, 12);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setUserPos(DEFAULT_CENTER);
        flyTo(DEFAULT_CENTER, 11);
        toast('Kunde inte hämta position – visar Stockholm');
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

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
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 no-scrollbar">
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

      <div ref={mapRef} className="glass relative h-[52vh] min-h-[340px] overflow-hidden !rounded-[28px] p-0">
        <MapContainer center={DEFAULT_CENTER} zoom={11} className="h-full w-full" attributionControl>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          <FlyTo target={fly} />
          {places.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={placeIcon(p)} eventHandlers={{ click: () => setPlaceOpen(p) }} />
          ))}
          {state.checkins.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={photoIcon(c)} zIndexOffset={500} eventHandlers={{ click: () => setMemory(c) }} />
          ))}
          {userPos && <Marker position={userPos} icon={meIcon} />}
        </MapContainer>
        <div className="pointer-events-none absolute inset-0 z-[400] rounded-[28px] ring-1 ring-inset ring-white/15" />
        <div className="absolute inset-x-3 bottom-3 z-[500] flex gap-2">
          <button onClick={locate} className="glass-strong flex flex-1 items-center justify-center gap-2 !rounded-2xl bg-black/40 py-3.5 text-sm font-bold active:scale-95">
            {locating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <LocateFixed size={18} />}
            Hitta äventyr nära mig
          </button>
          <button onClick={() => setCheckin({})} className="btn-accent !h-[52px] !w-[52px] !rounded-2xl !p-0" aria-label="Checka in">
            <Plus size={24} />
          </button>
        </div>
      </div>

      {nearby.length > 0 && (
        <>
          <SectionTitle kicker="Nära dig" title="Äventyr i närheten" />
          <div className="space-y-2">
            {nearby.map(({ p, d }) => (
              <button key={p.id} onClick={() => { flyTo([p.lat, p.lng], 14); setPlaceOpen(p); }} className="glass flex w-full items-center gap-3 p-3.5 text-left active:scale-[.98]">
                <div className="grid h-11 w-11 place-items-center rounded-2xl text-xl" style={{ background: `${PLACE_CATS[p.category].color}33` }}>{CAT_EMOJI[p.category]}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{p.name}</div>
                  <div className="text-[11px] text-white/50">{PLACE_CATS[p.category].label}</div>
                </div>
                <span className="chip"><Navigation size={11} /> {d < 10 ? d.toFixed(1) : Math.round(d)} km</span>
              </button>
            ))}
          </div>
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
                      {c.dogs.includes('puppy') && <span className="text-[10px] font-semibold text-[var(--a2)]">Valpen {ageAt(state.dogs.puppy.birth, c.date)}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {!timeline.length && <div className="text-sm text-white/50">Inga minnen än – checka in på en plats!</div>}
      </div>

      {/* Platsinfo */}
      <Sheet open={!!placeOpen} onClose={() => setPlaceOpen(null)} title={placeOpen?.name}>
        {placeOpen && (
          <>
            <div className="-mt-2 mb-4 flex flex-wrap gap-2">
              <span className="chip" style={{ color: PLACE_CATS[placeOpen.category].color }}>{CAT_EMOJI[placeOpen.category]} {PLACE_CATS[placeOpen.category].label}</span>
              {placeOpen.seniorFriendly && <span className="chip">✓ Seniorvänlig</span>}
              {placeOpen.puppyFriendly && <span className="chip">✓ Valpvänlig</span>}
            </div>
            <p className="mb-4 text-[15px] leading-relaxed text-white/75">{placeOpen.description}</p>
            <div className="label mb-2">Bra för</div>
            <div className="mb-5 flex flex-wrap gap-2">{placeOpen.goodFor.map((g) => <span key={g} className="chip !bg-white/10">{g}</span>)}</div>
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
            <button onClick={() => { const p = placeOpen; setPlaceOpen(null); setCheckin({ place: p }); }} className="btn-accent w-full"><Camera size={18} /> Checka in här</button>
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
              <button onClick={() => { flyTo([memory.lat, memory.lng], 15); setMemory(null); }} className="btn-ghost"><MapPin size={16} /> Visa på karta</button>
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
        userPos={userPos}
        onSaved={(c) => {
          setCheckin(null);
          flyTo([c.lat, c.lng], 14);
        }}
      />
    </div>
  );
}

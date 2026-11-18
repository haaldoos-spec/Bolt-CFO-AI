# Labbeliv – träning & äventyr för två labradorer

PWA-prototyp i React + TypeScript + Tailwind CSS + Lucide, med Leaflet-karta.

## Kom igång
```bash
npm install
npm run dev      # http://localhost:5173
npm run build && npm run preview   # produktionsbygge med service worker
```

## Struktur
- `src/data/` – mock-data: profiler & teman, övningar (byggsten → kedja → program), quests, kartplatser, demohistorik
- `src/lib/` – Smart Coach-regler, pass-generator, XP/nivåer/streaks
- `src/store/AppContext.tsx` – global state (sparas i localStorage) + temabyte via CSS-variabler
- `src/views/` – Hem, Karta & Bilddagbok, Träning & Sporter, Profil & Statistik
- `src/components/` – header/profilväxlare, bottenmeny, pass-generator & timer, glas-UI

## Egna 3D-avatarer
Lägg bilderna i `public/avatars/` (t.ex. `senior.png`, `puppy.png`) och uppdatera `avatar` i
`src/data/profiles.ts` – eller ladda upp direkt i appen via kameraknappen under **Statistik**.
Namn går att ändra genom att trycka på hundens namn där.

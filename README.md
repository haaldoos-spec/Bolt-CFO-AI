# Labbeliv – träning & äventyr för två labradorer

PWA-prototyp i React + TypeScript + Tailwind CSS + Lucide.

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
- `src/views/` – Hem, Platser & Bilddagbok, Träning & Sporter, Profil & Statistik
- `src/lib/maps.ts` – länkar till Apple Kartor/Google Maps och tolkning av delade kartlänkar
- `src/components/` – header/profilväxlare, bottenmeny, pass-generator & timer, glas-UI

## Egna 3D-avatarer
Lägg bilderna i `public/avatars/` (t.ex. `senior.png`, `puppy.png`) och uppdatera `avatar` i
`src/data/profiles.ts` – eller ladda upp direkt i appen via kameraknappen under **Statistik**.
Namn går att ändra genom att trycka på hundens namn där.

## Som Claude-artefakt (iPhone-hemskärm)
```bash
npm run build:artifact   # → dist-artifact/labbeliv.html (allt i en fil)
```
Filen publiceras som en Claude-artefakt. Platser öppnas i Apple Kartor via länkar, och egna platser
sparas genom att klistra in en delad länk från Kartor.

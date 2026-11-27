import type { Exercise } from '../types';

/**
 * Valpträning – bara för valpen (Kyle). Korta pass på 2–5 minuter,
 * lek och belöning, inga hopp eller långa promenader under tillväxten.
 */
export const PUPPY_EXERCISES: Exercise[] = [
  // ───────────── BYGGSTENAR ─────────────
  {
    id: 'vp-namn', discipline: 'valp', level: 'byggsten', title: 'Namnlek',
    summary: 'Namnet betyder alltid något gott – valpen vänder sig mot dig direkt.',
    suits: ['puppy'], minutes: 3, intensity: 1, equipment: ['godis'],
    steps: [
      'Säg namnet en gång när valpen redan tittar på dig – ge godis direkt. 5 reps.',
      'Säg namnet när valpen tittar bort på något tråkigt. Vänder den sig – godis och glad röst.',
      'Gör det i nya rum och i trädgården. Säg aldrig namnet för att skälla eller för något tråkigt.',
    ],
    criteria: ['Vänder sig på namnet inomhus 9 av 10', 'Fungerar i trädgården'],
    labbeHack: { puppy: 'Ta godiset från dagsransonen – en labbevalp blir lätt för rund, och det belastar lederna.' },
  },
  {
    id: 'vp-sitt', discipline: 'valp', level: 'byggsten', title: 'Första sitt',
    summary: 'Lura in sitt med godis över nosen – inga tryck på rumpan.',
    suits: ['puppy'], minutes: 3, intensity: 1, equipment: ['godis', 'klicker'],
    steps: [
      'Håll godiset vid nosen och för det långsamt bakåt över huvudet. Rumpan landar – ”ja!” och godis.',
      'Gör samma rörelse med tom hand och belöna från andra handen.',
      'Säg ”sitt” precis innan handrörelsen. Efter några dagar räcker ordet.',
    ],
    criteria: ['Sitter på handtecken', 'Sitter på ordet ”sitt” i köket'],
  },
  {
    id: 'vp-rumsren', discipline: 'valp', level: 'byggsten', title: 'Rumsrenhet',
    summary: 'Ut ofta, alltid samma plats, och fest när det kommer.',
    suits: ['puppy'], minutes: 5, intensity: 1, equipment: ['godis', 'koppel'],
    steps: [
      'Gå ut direkt efter sömn, mat, lek och minst varje timme vaken tid. Bär valpen de första veckorna.',
      'Stå still på samma plats och var tråkig. När valpen kissar: säg ”kissa” lugnt och belöna direkt efteråt.',
      'Olyckor inne: torka upp med enzymrengöring utan att säga något. Skäll aldrig – det lär bara valpen att gömma sig.',
    ],
    criteria: ['Kissar inom 3 min ute', 'En dag utan olyckor', 'Går själv mot dörren'],
    labbeHack: { puppy: 'Tumregel: en valp kan hålla sig ungefär lika många timmar som den är månader gammal, plus en.' },
  },
  {
    id: 'vp-bett', discipline: 'valp', level: 'byggsten', title: 'Bitstopp – mjuka tänder',
    summary: 'Valpen lär sig att människohud är ömt och att leksaken är det som gäller.',
    suits: ['puppy'], minutes: 3, intensity: 1, equipment: ['leksak'],
    steps: [
      'Ha alltid en leksak i handen när ni leker. Biter valpen i händerna – byt till leksaken.',
      'Bits det hårt: säg ”aj” lugnt, ta bort händerna och var stilla 5 sekunder. Leken fortsätter sedan.',
      'Blir valpen övertrött och biter mer: det är dags för sömn, inte mer lek. Lyft in den i bädden med ett tuggben.',
    ],
    criteria: ['Byter själv till leksaken', 'Mjukare munn mot händer efter några veckor'],
    labbeHack: { puppy: 'Labbevalpar är väldigt munniga – det är normalt. Frusna tuggleksaker hjälper när tänderna byts (ca 3–6 mån).' },
  },
  {
    id: 'vp-hantering', discipline: 'valp', level: 'byggsten', title: 'Hantering – tassar, öron, mun',
    summary: 'Valpen tycker om att bli undersökt. Gör veterinär, kloklipp och borstning enkelt.',
    suits: ['puppy'], minutes: 3, intensity: 1, equipment: ['godis', 'filt'],
    steps: [
      'Rör en tass i 1 sekund – godis. Släpp. Samma med öron, svans och läppar.',
      'Håll lite längre: titta mellan trampdynorna, lyft läppen och se på tänderna. Godis efter varje.',
      'Lägg till borste och klotång (bara visa och nudda). Klipp en klo i taget när valpen är lugn.',
    ],
    criteria: ['Står lugnt när du tittar i munnen', 'Tillåter tasshantering på alla fyra'],
  },
  {
    id: 'vp-ensam', discipline: 'valp', level: 'byggsten', title: 'Ensamträning',
    summary: 'Korta stunder ensam som valpen knappt märker – öka mycket långsamt.',
    suits: ['puppy'], minutes: 5, intensity: 1, equipment: ['filt', 'leksak'],
    steps: [
      'När valpen är trött: ge ett tuggben i hägnet och gå ut ur rummet i 10 sekunder. Kom tillbaka lugnt.',
      'Öka till 1, 3 och 5 minuter över flera dagar. Gå tillbaka innan valpen piper.',
      'Gör avsked och hemkomst odramatiska. Börja aldrig med lång tid ensam samma vecka som valpen kommer hem.',
    ],
    criteria: ['5 min ensam utan att pipa', 'Somnar själv i bädden'],
  },
  {
    id: 'vp-socialisering', discipline: 'valp', level: 'byggsten', title: 'Socialisering – nya saker',
    summary: 'Möt nya ljud, människor, underlag och djur – i lagom dos och på valpens villkor.',
    suits: ['puppy'], minutes: 5, intensity: 1, equipment: ['godis', 'sele', 'koppel'],
    steps: [
      'Välj en ny sak per dag: dammsugare på avstånd, galler, en paraplyöppning, en man med hatt.',
      'Låt valpen själv välja att gå fram. Godis när den tittar nyfiket. Backa om den blir rädd.',
      'Avsluta när valpen är nyfiken och glad – inte när den är trött. Före ca 12 veckor: bär valpen på okända platser där andra hundar kissat.',
    ],
    criteria: ['Tittar nyfiket på nya saker', 'Återhämtar sig snabbt efter en skräll'],
    labbeHack: { puppy: 'Socialiseringsfönstret stänger gradvis kring 12–16 veckor – det valpen möter lugnt nu blir normalt resten av livet.' },
  },
  {
    id: 'vp-sele', discipline: 'valp', level: 'byggsten', title: 'Sele och koppel',
    summary: 'Selen betyder godis och kopplet är inget att bita i.',
    suits: ['puppy'], minutes: 3, intensity: 1, equipment: ['sele', 'koppel', 'godis'],
    steps: [
      'Håll fram selen och lägg godis i öppningen – valpen stoppar själv in huvudet.',
      'Spänn fast och ge godis direkt. Ta av efter 30 sekunder. Öka tiden med lek och mat i selen.',
      'Fäst kopplet och låt det släpa inomhus under uppsikt. Följ med valpen – dra inte.',
    ],
    criteria: ['Stoppar själv in huvudet', 'Går glatt med kopplet fäst'],
  },
  {
    id: 'vp-inkallning', discipline: 'valp', level: 'byggsten', title: 'Valpinkallning – spring ifrån',
    summary: 'Valpen följer naturligt efter dig. Använd det och belöna hejvilt.',
    suits: ['puppy'], minutes: 3, intensity: 1, equipment: ['godis', 'visselpipa'],
    steps: [
      'Säg namnet glatt och spring några steg bakåt. Valpen kommer – fest och flera godisbitar.',
      'Med en kompis: kalla valpen mellan er på 2–3 meter. Belöna varje gång.',
      'Ladda visselpipan: pip och ge godis direkt, utan att valpen behöver göra något.',
    ],
    criteria: ['Kommer direkt på namnet inomhus', 'Springer till dig i trädgården'],
    labbeHack: { general: 'Ropa bara in valpen när du är säker på att den kommer. Ropa aldrig in för något tråkigt som bad eller att gå in.' },
  },
  {
    id: 'vp-byta', discipline: 'valp', level: 'byggsten', title: 'Byta – släpp det du har',
    summary: 'Valpen lämnar en sak när du ger något bättre. Förebygger resursvaktande.',
    suits: ['puppy'], minutes: 3, intensity: 1, equipment: ['leksak', 'godis'],
    steps: [
      'Valpen har en leksak. Håll godis vid nosen. Släpper den – säg ”tack”, ge godis och ge tillbaka leksaken.',
      'Öka värdet på det valpen har: tuggben, strumpa. Ha alltid något ännu godare att byta med.',
      'Gå förbi matskålen och släpp i en extra godbit – din hand nära skålen betyder bara mer gott.',
    ],
    criteria: ['Släpper leksak på ”tack”', 'Lugn när du går nära matskålen'],
    labbeHack: { puppy: 'Labbar bär gärna saker i munnen. Jaga aldrig valpen för att ta något – byt i stället, annars lär den sig springa iväg.' },
  },

  // ───────────── MINI-KEDJOR ─────────────
  {
    id: 'vp-kedja-morgon', discipline: 'valp', level: 'kedja', title: 'Kedja: Morgonrutinen',
    summary: 'Ut och kissa → sele på → namnlek → sitt före frukost.',
    suits: ['puppy'], minutes: 8, intensity: 1, equipment: ['sele', 'koppel', 'godis'],
    builtFrom: ['vp-rumsren', 'vp-sele', 'vp-namn', 'vp-sitt'],
    steps: [
      'Direkt ut till kissplatsen, belöna när det kommer.',
      'Sele på med godis i öppningen, 3 namnlekar på vägen in.',
      'Sitt innan matskålen ställs ner – skålen är belöningen.',
    ],
    criteria: ['Hela rutinen utan olycka', 'Sitter självmant vid matskålen'],
  },
  {
    id: 'vp-kedja-besok', discipline: 'valp', level: 'kedja', title: 'Kedja: Besöket',
    summary: 'Hälsa lugnt → bli hanterad av gästen → varva ner på filten.',
    suits: ['puppy'], minutes: 10, intensity: 1, equipment: ['godis', 'filt'],
    builtFrom: ['vp-socialisering', 'vp-hantering', 'v-passivitet'],
    steps: [
      'Gästen sätter sig på huk och väntar. Valpen hälsar när fyra tassar är i golvet – då får den godis.',
      'Gästen tittar kort på en tass och ett öra och ger godis.',
      'Valpen får ett tuggben på filten medan ni fikar.',
    ],
    criteria: ['Hälsar utan att hoppa upp', 'Somnar på filten med gäst i rummet'],
  },

  // ───────────── PROGRAM ─────────────
  {
    id: 'vp-program-valpkurs', discipline: 'valp', level: 'program', title: 'Program: Valpkursen',
    summary: 'Allt en valpkurs brukar ta upp – klart när Kyle är ca 16 veckor.',
    suits: ['puppy'], minutes: 15, intensity: 1, equipment: ['godis', 'sele', 'koppel', 'leksak', 'filt'],
    builtFrom: ['vp-namn', 'vp-sitt', 'vp-inkallning', 'vp-byta', 'vp-hantering', 'vp-sele', 'v-passivitet'],
    moments: ['Namnlek', 'Sitt på ord', 'Inkallning 5 m', 'Byta leksak mot godis', 'Hantering av tassar och mun', '10 steg i koppel', 'Lugn på filten 3 min'],
    steps: [
      'Kör 2–3 moment per pass – aldrig alla på en gång. Pausa och lek mellan.',
      'Flytta momenten till nya miljöer: trädgården, en lugn park, utanför affären.',
      'När allt sitter: kör hela programmet i en lugn park med glad avslutning.',
    ],
    criteria: ['Alla moment i en ny miljö', 'Valpen är glad och intresserad hela vägen'],
    labbeHack: { puppy: 'Tumregel för promenader: ca 5 min per månad i ålder, två gånger per dag. Lek på mjukt underlag i stället för långa rundor.' },
  },
];

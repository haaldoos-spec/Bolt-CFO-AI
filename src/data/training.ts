import type { Discipline, DisciplineId, Equipment, EquipmentId, Exercise } from '../types';
import { BASE_PROGRAM_MOMENTS, MORE_EXERCISES } from './trainingMore';
import { SPORT_EXERCISES } from './trainingSports';

export const EQUIPMENT: Record<EquipmentId, Equipment> = {
  klicker: { id: 'klicker', name: 'Klicker' },
  godis: { id: 'godis', name: 'Godis (små bitar)' },
  sparlina: { id: 'sparlina', name: 'Spårlina 10 m' },
  koner: { id: 'koner', name: 'Koner' },
  bock: { id: 'bock', name: 'Apportbock' },
  sele: { id: 'sele', name: 'Sele' },
  koppel: { id: 'koppel', name: 'Koppel' },
  langlina: { id: 'langlina', name: 'Långlina' },
  filt: { id: 'filt', name: 'Filt / bädd' },
  skyltar: { id: 'skyltar', name: 'Rallyskyltar' },
  nosework: { id: 'nosework', name: 'Doftburkar & kartonger' },
  tunnel: { id: 'tunnel', name: 'Kort tunnel' },
  hinder: { id: 'hinder', name: 'Låga hinder (marknivå)' },
  balans: { id: 'balans', name: 'Balansplatta / bräda' },
  leksak: { id: 'leksak', name: 'Dragleksak' },
  apport: { id: 'apport', name: 'Dummy / apportbock' },
  targetplatta: { id: 'targetplatta', name: 'Targetplatta' },
  flytvast: { id: 'flytvast', name: 'Flytväst' },
  pall: { id: 'pall', name: 'Pall / låg plattform' },
  visselpipa: { id: 'visselpipa', name: 'Visselpipa' },
  pinne: { id: 'pinne', name: 'Spårpinnar' },
  matta: { id: 'matta', name: 'Halkfri matta' },
};

export const DISCIPLINES: Discipline[] = [
  {
    id: 'vardag', name: 'Vardagslydnad', tagline: 'Grunden för ett lugnt liv ihop', goalLabel: 'Startklass Lydnad', icon: 'Home',
    rules: {
      org: 'Svenska Brukshundklubben (SBK) – Regler lydnadstävling', period: 'Gäller 2023-01-01 – 2026-12-31', official: true,
      facts: [
        'Hunden ska ha fyllt 10 månader (dagen före tävlingen) för startklass.',
        'Sex moment + helhetsintryck: Följsamhet (koeff. 4), Inkallande (3), Sitt under marsch (3), Apportering (3), Fjärrdirigering (2), Hopp över hinder (2), Helhetsintryck (3).',
        'Följsamhet: lös eller kopplad, 30–50 m med en höger- och en vänstersväng och 5–10 m språngmarsch.',
        'Inkallande från ca 15 m. Apportbock av trä läggs ca 3 m från hunden och du står ca 10 m bort.',
        'Fjärrdirigering: från sitt till ligg på ca 5 m avstånd. Hopp: täckt hinder i mankhöjd, högst 50 cm.',
        'Ingen godis eller leksak i ringen – varken under eller mellan momenten. Att klappa hunden under ett moment underkänner momentet; mellan momenten får du berömma och klappa.',
        '1:a pris = 160–200 poäng och krävs för klass 1. Tre 1:a pris ger LD Startklass. Under 100 poäng är underkänt.',
      ],
    },
  },
  {
    id: 'rally', name: 'Rallylydnad', tagline: 'Skylt för skylt, glädje hela vägen', goalLabel: 'Rally Nybörjarklass', icon: 'Signpost',
    rules: {
      org: 'Svenska Brukshundklubben (SBK) – Regler rallylydnad', period: 'Gäller 2023-01-01 – 2026-12-31', official: true,
      facts: [
        'Hunden ska ha fyllt 10 månader (dagen före tävlingen).',
        'Nybörjarklass: 12–15 moment (start och mål räknas inte), hunden i löst hängande koppel. Momenten är skylt 101–138.',
        'Sele är tillåten bara i nybörjarklass, och kopplet ska fästas på ryggen/manken.',
        'Du får prata och berömma men inte medvetet röra hunden. Godis eller leksak synligt på banan = diskvalificering.',
        'Man startar med 100 poäng. Minst 70 är kvalificerande; tre kvalificerande eller en 100-poängare ger uppflyttning. Tre kvalificerande ger RLD N.',
        'Fortsättningsklass: okopplad, 13–17 moment varav minst 5 från fortsättningsklassen (skylt 201–). Kvalificerande från 75 poäng.',
        'Förslaget till nya regler från 2027: nybörjarklass 12–14 moment och inga nya nybörjarmoment.',
      ],
    },
  },
  {
    id: 'spar', name: 'Spår', tagline: 'Följ doften steg för steg', goalLabel: 'Viltspårprov anlagsklass', icon: 'Footprints',
    rules: {
      org: 'SKK – Regler för viltspårprov', period: 'Gäller 2022-01-01 – 2026-12-31', official: true,
      facts: [
        'Hunden ska ha fyllt 9 månader. Anlagsklass först – öppen klass kräver godkänd anlagsklass.',
        'Spåret är 600–700 m med fyra vinklar, minst 50 m mellan vinklarna, i mestadels skogsmark.',
        'Det läggs med 2 dl blod (stämplar ca var 1 m, tätare i början) och en släpad viltdel (klöv) hela vägen. Vid en vinkel görs ett bloduppehåll på ca 20 m.',
        'Start i en sökruta på 25 × 25 m med ”skottplats”. Anlagsklass: blodat 2–5 timmar före start. Öppen klass: 12–24 timmar (nattgammalt).',
        'Spårlina högst 10 m (minst 5 m rekommenderas). Spårtid högst 30 min i anlagsklass, 45 min i öppen klass.',
        'Anlagsklass bedöms godkänd / ej godkänd.',
        'Spår i bruksprov (SBK) är en annan gren; appellklass är öppen från 12 månader.',
      ],
    },
  },
  {
    id: 'sok', name: 'Sök', tagline: 'Nosework & doftsök', goalLabel: 'Doftprov & NW1', icon: 'Search',
    rules: {
      org: 'Svenska Nose Work Klubben (SNWK) – Regler för prov och tävling', period: 'Gäller 2022-01-01 – 2026-12-31', official: true,
      facts: [
        'Doftprov från 10 månader, tävling från 12 månader. Godkänt doftprov krävs för att tävla och gäller hela livet.',
        'Doftprovet: 12 likadana kartonger, eukalyptus i en. Hunden ska visa rätt kartong inom 3 minuter och föraren säger ”markerat”.',
        'NW1: bara eukalyptus, en gömma i varje moment. Fyra moment – behållarsök (bara kartonger), inomhussök, utomhussök och fordonssök (1–3 fordon) – à 25 poäng.',
        'Gömmor inomhus och utomhus högst 120 cm upp, och hunden ska kunna nå ända fram.',
        'Söktid 1–5 minuter per sökområde. Tiden stoppas när föraren säger ”markerat”; fel markering avbryter momentet.',
        'Du får belöna hunden under söket – även med godis.',
      ],
    },
  },
  {
    id: 'agility', name: 'Agility', tagline: 'Valpanpassat – marknivå & kroppskontroll', goalLabel: 'Valpbana (hoppfri)', icon: 'Zap',
    rules: {
      org: 'Svenska Agilityklubben (SAgiK) – Regler för agilitytävlingar', period: 'Gäller 2022–2026 (nya regler 2027–2031)', official: true,
      facts: [
        'Hunden ska ha fyllt 18 månader senast tävlingsdagen.',
        'Mankhöjden mäts av en agilitydomare tidigast vid 18 månader och slutgiltigt före start efter 24 månader.',
        'Storleksgrupper: XS, S, M, L (43–under 50 cm) och XL. En labrador hamnar oftast i extra large (från 43 cm i dag, från 48 cm med 2027 års regler).',
        'Hopphöjd för extra large: 50–55 cm i klass 1 och 50–60 cm i klass 2–3. För large: 40–45 cm i klass 1.',
        'Två grenar: agilityklass (med A-hinder, balansbom och gungbräda) och hoppklass (utan kontaktfältshinder). Klass 1–3.',
        'Uppflyttning: tre felfria lopp bland de 15 % bästa i klass 1. Fem uppflyttningsresultat ger diplom (AgD 1 / AgHD 1).',
        'Godis eller leksak på banan – eller att avbryta för att klappa hunden – ger diskvalificering.',
        'Banorna i appen är inte tävlingsbanor – de är valpanpassade förberedelser utan hopp.',
      ],
    },
  },
  {
    id: 'freestyle', name: 'Freestyle & HtM', tagline: 'Kreativ lydnad till musik', goalLabel: 'Freestyle klass 1', icon: 'Music',
    rules: {
      org: 'Svenska Hundfreestyleklubben (SHFK) – Regler för freestyle', period: 'Gäller 2022–2026 (nya regler 2027–2031 har samma grunder)', official: true,
      facts: [
        'Hunden ska ha fyllt 12 månader på tävlingsdagen.',
        'Programlängd: klass 1 minst 1 och högst 2 min, klass 2 2–3 min, klass 3 3–4 min.',
        'HtM: minst 75 % av programmet i de tio HtM-positionerna. Freestyle: högst 25 % HtM-positioner. Annars minst 2,6 poängs avdrag i Innehåll.',
        'En HtM-position räknas bara när hunden rör sig på alla fyra tassarna inom ca 50 cm från föraren – sitt eller kryp räknas inte.',
        'Bedöms i Precision och samarbete, Innehåll och Tolkning av musik, 0–10 poäng var.',
        'Uppflyttning: minst 75 % i snitt i alla tre kategorier. Tre sådana resultat ger diplom (klass 1–2).',
        'Godis eller leksak får finnas i fickan men inte synas. Belöning på planen = diskvalificering – belöna efter att ni lämnat planen.',
        'Rekvisita får användas men inte som belöningsleksak.',
      ],
    },
  },
  {
    id: 'bruks', name: 'Bruks', tagline: 'Lydnad + spår eller sök – appellklass', goalLabel: 'Appellklass', icon: 'Medal',
    rules: {
      org: 'Svenska Brukshundklubben (SBK) – Regler bruksprov', period: 'Gäller 2023-01-01 – 2026-12-31', official: true,
      facts: [
        'Appellklass från 12 månader. Lägre klass kräver uppflyttning i appellklass och att hunden fyllt 18 månader.',
        'Från 18 månader krävs mentalbeskrivning (MH). För raser som SBK inte har avelsansvar för, som labrador, kan MH ersättas med BPH.',
        'Skyddshundsgruppen är bara öppen för raser som SBK har avelsansvar för – inte labrador. Spår, sök och rapport går bra.',
        'Lydnad (koeff. 16): linförighet i koppel, framförgående, platsläggande, inkallande, hopp över hinder och platsliggande 3 min.',
        'Specialmoment (koeff. 9): budföring ca 50 m + spår (ca 300 m, 40–50 min, tre föremål), rapportföring eller genomsök av område.',
        'Godkänt: 125 poäng varav 45 i specialmoment. Uppflyttning: 175 poäng varav 63.',
      ],
    },
  },
  {
    id: 'tricks', name: 'Tricks & Roligt', tagline: 'Hjärngympa och skratt', goalLabel: 'Trickhund Novice', icon: 'Sparkles',
    rules: {
      org: 'Ingen SKK-gren', period: 'Inofficiellt', official: false,
      facts: [
        'Tricks är ingen officiell tävlingsgren hos SKK.',
        'Trickhundstitlar (t.ex. Novice) delas ut av fristående organisationer via filmade prov.',
        'Många tricks bygger färdigheter som används i lydnad och rally: backa, stå, apport och handtarget.',
      ],
    },
  },
];

export const LEVEL_LABEL = {
  byggsten: 'Byggsten',
  kedja: 'Mini-kedja',
  program: 'Program / bana',
} as const;

const BASE_EXERCISES: Exercise[] = [
  // ───────────── VARDAGSLYDNAD ─────────────
  {
    id: 'v-kontakt', discipline: 'vardag', level: 'byggsten', title: 'Kontakt på namn',
    summary: 'Hunden vänder blicken mot dig direkt när den hör sitt namn.',
    suits: ['senior', 'puppy'], minutes: 5, intensity: 1, equipment: ['klicker', 'godis'],
    steps: [
      'Säg namnet en gång i lugn miljö. När hunden tittar på dig – klick + godis vid ditt ansikte.',
      'Öka svårigheten: säg namnet när hunden nosar på något ointressant. Belöna snabba vändningar extra (jackpot).',
      'Ta övningen ut på promenaden. Belöna 8 av 10 lyckade, sänk svårighet om under 6.',
    ],
    criteria: ['Vänder sig inom 1 sekund', '8/10 lyckade i trädgård eller lugn park', 'Fungerar med lätt störning'],
    labbeHack: {
      puppy: 'Labbevalpar är matmotiverade – men använd hälften av dagsransonen som träningsgodis så valpen inte blir för tjock under tillväxten.',
      senior: 'Om hörseln börjat svikta: komplettera med ett handtecken (öppen handflata) eller en vibration i marken med foten.',
    },
  },
  {
    id: 'v-sitt-stanna', discipline: 'vardag', level: 'byggsten', title: 'Sitt-stanna (de 3 D:na)',
    summary: 'Bygg duration, distans och distraktion – ett D i taget.',
    suits: ['senior', 'puppy'], minutes: 8, intensity: 1, equipment: ['godis', 'koppel'],
    steps: [
      'Duration: Be om sitt, belöna i positionen var 2:a sekund. Släpp med ”varsågod”. Öka till 30 sek.',
      'Distans: Ta ett steg bakåt, gå tillbaka och belöna. Bygg upp till 5 meter. Sänk duration när du ökar distans.',
      'Distraktion: Släpp en vante, studsa en boll, eller låt den andra hunden gå förbi. Belöna generöst.',
    ],
    criteria: ['30 sek sitt med dig 5 m bort', 'Håller med en tappad leksak', 'Släpper bara på frisläppningsord'],
    labbeHack: {
      senior: 'Låt senioren göra ”ligg-stanna” på mjukt underlag i stället för långa sitt – skonsamt för höfter och armbågar.',
      puppy: 'Valpens hjärna orkar kort: 3–5 repetitioner, sedan lek. Avsluta alltid på en lyckad rep.',
    },
  },
  {
    id: 'v-skvaller', discipline: 'vardag', level: 'byggsten', title: 'Skvaller på tappad mat',
    summary: 'Hunden lämnar mat på marken och tittar på dig i stället – livsviktigt för labbar.',
    suits: ['senior', 'puppy'], minutes: 6, intensity: 1, equipment: ['godis', 'koppel'],
    steps: [
      'Ha en godisbit i stängd hand. Vänta tills hunden slutar nosa/slicka och tittar upp – klick + belöning från ANDRA handen.',
      'Lägg godiset på golvet under din fot. Belöna när hunden ser på dig. Lyft foten gradvis.',
      'Tappa godis ”av misstag” på promenaden (i koppel). Belöna blickkontakt – tappad mat blir en signal att titta på matte/husse.',
    ],
    criteria: ['Lämnar godis på golvet utan att du täcker det', 'Tittar självmant upp när mat tappas', 'Fungerar utomhus'],
    labbeHack: {
      general: 'Labradorer har ofta en genvariant (POMC) som gör dem extra hungriga. Skvallerträning är därför inte bara lydnad – det är säkerhet mot giftigt skräp och stulna mackor.',
    },
  },
  {
    id: 'v-linforing', discipline: 'vardag', level: 'byggsten', title: 'Slakt koppel – ”trädet”',
    summary: 'Koppeln ska hänga som ett leende. Drar hunden blir du ett träd.',
    suits: ['puppy', 'senior'], minutes: 10, intensity: 2, equipment: ['koppel', 'sele', 'godis'],
    steps: [
      'Belöna vid ditt vänstra knä var 2:a steg inomhus. Bygg en ”belöningszon”.',
      'Utomhus: när kopplet sträcks – stanna helt. När det slaknar – klick, belöning vid knät, gå vidare.',
      'Byt riktning ofta och belöna när hunden hänger med. Öka antal steg mellan belöningar.',
    ],
    criteria: ['20 steg med slakt koppel förbi en annan hund', 'Hunden söker själv tillbaka till belöningszonen'],
    labbeHack: {
      puppy: 'Använd sele i stället för halsband under tillväxten – en dragande valp belastar hals och sköldkörtel.',
      senior: 'Senioren får gärna gå i egen takt och nosa. Ge en signal (”nosa fritt”) så vet hen när det är ”jobb” och när det är ledigt.',
    },
  },
  {
    id: 'v-inkallning', discipline: 'vardag', level: 'byggsten', title: 'Inkallning med visselpipa',
    summary: 'Pipsignal = festmåltid. Den säkraste inkallningen ute i skogen.',
    suits: ['puppy', 'senior'], minutes: 8, intensity: 2, equipment: ['visselpipa', 'godis', 'langlina'],
    steps: [
      'Laddning: pip (två korta) och ge direkt 5 godisbitar i rad. 10 reps under några dagar, hunden behöver inte göra något.',
      'Pip när hunden redan är på väg mot dig. Fest när den kommer fram – handtag i selen + godis.',
      'I långlina ute: pip när hunden är lätt distraherad. Spring bakåt för att trigga jakten på dig.',
    ],
    criteria: ['Vänder direkt på pip från 15 m', 'Kommer in förbi en lätt distraktion', 'Låter sig fångas i selen'],
    labbeHack: {
      general: 'Visselpipan är klassisk retrieverutrustning – den låter likadant oavsett om du är stressad eller glad.',
    },
  },
  {
    id: 'v-passivitet', discipline: 'vardag', level: 'byggsten', title: 'Passivitet på filt',
    summary: 'Hunden lär sig att ”ingenting” är värt att belöna – grunden för café och tävling.',
    suits: ['puppy', 'senior'], minutes: 10, intensity: 1, equipment: ['filt', 'godis'],
    steps: [
      'Lägg filten, belöna allt hunden gör nära/på den. Lugnt, långsamt, godis direkt på filten.',
      'Belöna bara när hunden ligger avslappnat – höftrullning, huvudet ner, suckar = jackpot.',
      'Ta filten till nya miljöer: trädgård, parkbänk, café. Läs en tidning – belöna lugnet med ojämna mellanrum.',
    ],
    criteria: ['Ligger avslappnat 10 min på filten hemma', '5 min på café med lätt störning'],
    labbeHack: {
      puppy: 'Ge en tuggben eller frusen Kong på filten – tuggande sänker pulsen och lär valpen att varva ner.',
    },
    pairTip: 'Grunden för Dual Mode: den ena hunden ligger på filten medan den andra tränar.',
  },
  {
    id: 'v-kedja-promenad', discipline: 'vardag', level: 'kedja', title: 'Kedja: Stadspromenaden',
    summary: 'Slakt koppel → sitt vid övergångsställe → skvaller förbi korvkiosken.',
    suits: ['puppy', 'senior'], minutes: 15, intensity: 2, equipment: ['koppel', 'sele', 'godis'],
    builtFrom: ['v-linforing', 'v-sitt-stanna', 'v-skvaller'],
    steps: [
      'Gå 50 m med slakt koppel, belöna med variabelt schema.',
      'Vid trottoarkant: automatiskt sitt, vänta på ”varsågod” innan ni går över.',
      'Passera ett matställe – belöna blickkontakt och skvaller i stället för dammsugning.',
    ],
    criteria: ['Hela kedjan utan att kopplet sträcks mer än 2 gånger', 'Automatiskt sitt vid 3 av 3 kanter'],
    labbeHack: { general: 'Ta med vatten. Labbar blir varma snabbt i stadsmiljö på asfalt.' },
  },
  {
    id: 'v-program-startklass', discipline: 'vardag', level: 'program', title: 'Program: Startklass Lydnad',
    summary: 'Startklassens sex moment enligt SBK:s regler 2023–2026, i träningsform.',
    suits: ['senior', 'puppy'], minutes: 25, intensity: 2, equipment: ['koppel', 'apport', 'godis', 'koner', 'hinder'],
    builtFrom: ['v-linforing', 'v-kedja-inkallning', 'v-sitt-marsch', 'v-apport-lydnad', 'v-fjarr', 'v-hopp'],
    steps: [
      'Kör momenten ett och ett med belöning efter varje. Sätt ihop två och två när de sitter.',
      'Träna tävlingslikt: ingen belöning eller beröring under momentet – bara mellan momenten.',
      'Avsluta med en genomkörning av hela programmet och stor lek efteråt.',
    ],
    criteria: ['Alla sex moment i följd med belöning bara mellan momenten', 'Avlämning av apportbocken i handen'],
    labbeHack: {
      senior: 'Hoppet kan sänkas eller hoppas över i träning. Tävling är inte målet – glädjen är.',
      puppy: 'Kör programmet i delar och vänta med hoppet tills lederna är färdigväxta (ca 12–15 mån).',
    },
  },

  // ───────────── RALLYLYDNAD ─────────────
  {
    id: 'r-fot-vanster', discipline: 'rally', level: 'byggsten', title: 'Fotposition & vänstervändning',
    summary: 'Hunden hittar fotposition och följer med i en tät vänstervändning.',
    suits: ['puppy', 'senior'], minutes: 8, intensity: 2, equipment: ['godis', 'koner', 'klicker'],
    steps: [
      'Lura in hunden i fotposition med godis i vänster hand. Klick när höften är parallell med ditt ben.',
      'Ta ett steg och vänd vänster runt en kon – låt handen leda nosen bakåt så hunden flyttar bakdelen.',
      'Fasa ut godiset i handen: gör samma rörelse med tom hand, belöna från fickan.',
    ],
    criteria: ['Rak fotposition 3 av 4 gånger', '90° vänster utan att hunden hamnar framför'],
    labbeHack: { senior: 'Gör vida vändningar för senioren – snäva svängar belastar ryggen.' },
  },
  {
    id: 'r-sitt-ligg', discipline: 'rally', level: 'byggsten', title: 'Sitt – Ligg – Sitt vid skylt',
    summary: 'Positionsbyten på verbal signal medan du står bredvid.',
    suits: ['puppy', 'senior'], minutes: 6, intensity: 1, equipment: ['godis', 'skyltar'],
    steps: [
      'Med hunden i fot: lura sitt → ligg → sitt. Belöna varje position.',
      'Säg signalen INNAN handrörelsen. Vänta 2 sek – låt hunden tänka.',
      'Ställ upp en skylt och kör hela sekvensen på verbal signal.',
    ],
    criteria: ['Byten utan handsignal', 'Stannar kvar i fotposition'],
    labbeHack: { senior: 'Låt senioren ligga på gräs eller matta – undvik hårda golv vid många positionsbyten.' },
  },
  {
    id: 'r-runt', discipline: 'rally', level: 'byggsten', title: 'Höger runt (360°)',
    summary: 'Förare och hund går en hel cirkel åt höger med hunden på utsidan.',
    suits: ['puppy', 'senior'], minutes: 6, intensity: 2, equipment: ['koner', 'godis'],
    steps: [
      'Gå en stor cirkel runt en kon, belöna hunden vid ditt knä var 3:e steg.',
      'Minska cirkeln. Prata och peppa – hunden ska hålla kontakt.',
      'Kör vid skylt och gå direkt vidare i rak linje.',
    ],
    criteria: ['Hel cirkel utan att tappa fotposition'],
  },
  {
    id: 'r-kedja-start', discipline: 'rally', level: 'kedja', title: 'Kedja: Start – Halt – Vänster',
    summary: 'Tre skyltar i rad för att börja känna banflyt.',
    suits: ['puppy', 'senior'], minutes: 10, intensity: 2, equipment: ['skyltar', 'koner', 'godis'],
    builtFrom: ['r-fot-vanster', 'r-sitt-ligg'],
    steps: [
      'Startskylt: hunden sitter i fot, du ger signal och går.',
      'Halt-skylt: stanna, hunden sätter sig automatiskt.',
      'Vänster 90°, några steg till målet – fest!',
    ],
    criteria: ['Hela kedjan med en belöning i mål'],
  },
  {
    id: 'r-bana-nyborjare', discipline: 'rally', level: 'program', title: 'Bana: Nybörjarklass (12 skyltar)',
    summary: 'Övningsbana i nybörjarstil: 12 moment, koppel hela vägen och ingen godis på banan. Momenten är exempel – skyltarna finns i regelboken.',
    suits: ['puppy', 'senior'], minutes: 20, intensity: 2, equipment: ['skyltar', 'koner', 'koppel', 'godis'],
    builtFrom: ['r-fot-vanster', 'r-sitt-ligg', 'r-runt', 'r-kedja-start'],
    steps: [
      'Gå banan utan hund först (banvandring) och memorera skyltarna.',
      'Kör banan i två halvor med belöning vid halvtid.',
      'Hela banan. Läs varje skylt i förväg – rösten styr hunden.',
    ],
    criteria: ['Hela banan med slakt koppel', 'Max 2 omtag'],
    labbeHack: { general: 'Labbar älskar att få prata med föraren. Beröm verbalt hela vägen – det är tillåtet i rallylydnad!' },
  },

  // ───────────── SPÅR ─────────────
  {
    id: 's-fotsteg', discipline: 'spar', level: 'byggsten', title: 'Godis i varje fotsteg',
    summary: 'Ett rakt 15 m-spår med godis i varje steg. Lär hunden att näsa ner = belöning.',
    suits: ['puppy', 'senior'], minutes: 15, intensity: 1, equipment: ['sparlina', 'sele', 'godis', 'pinne'],
    steps: [
      'Markera start med en pinne. Trampa en tydlig ruta (1×1 m) med godis i.',
      'Gå rakt 15 m, lägg en godisbit i varje fotavtryck. Avsluta med en jackpot-skål.',
      'Vänta 10 min. Led hunden i sele + lina till rutan, följ efter i lugnt tempo.',
    ],
    criteria: ['Hunden går nos i marken hela sträckan', 'Hittar jackpoten utan hjälp'],
    labbeHack: {
      senior: 'Spår är perfekt seniorträning: hög mental belastning, låg fysisk. 15 min spår tröttar som 1 h promenad.',
      puppy: 'Valpar har fantastiska näsor – men kort uthållighet. Max 30 m de första veckorna.',
    },
  },
  {
    id: 's-vinkel', discipline: 'spar', level: 'byggsten', title: 'Första vinkeln',
    summary: 'Introducera en 90° sväng med extra godistäthet i hörnet.',
    suits: ['puppy', 'senior'], minutes: 15, intensity: 1, equipment: ['sparlina', 'sele', 'godis', 'pinne'],
    steps: [
      'Gå 20 m rakt, gör en 90° sväng. Trampa extra i hörnet och lägg 3 godisar.',
      'Fortsätt 20 m och avsluta med en apport/leksak.',
      'Låt hunden lösa svängen själv – stå still och vänta om hen tappar spåret.',
    ],
    criteria: ['Hunden ringar in och hittar ny riktning själv'],
  },
  {
    id: 's-apport', discipline: 'spar', level: 'byggsten', title: 'Markering av föremål',
    summary: 'Hunden lägger sig vid eller apporterar tappade föremål på spåret.',
    suits: ['puppy', 'senior'], minutes: 10, intensity: 1, equipment: ['godis', 'apport', 'pinne'],
    steps: [
      'Lägg en handske med godis på. Belöna när hunden nosar på den.',
      'Belöna bara när hunden stannar/lägger sig vid föremålet.',
      'Lägg föremålet på ett kort spår och belöna markeringen extra.',
    ],
    criteria: ['Markerar 2 av 2 föremål på spår'],
    labbeHack: { general: 'Labradorer apporterar gärna – välj om du vill ha markering (ligg) eller apport, och var konsekvent.' },
  },
  {
    id: 's-anlag', discipline: 'spar', level: 'program', title: 'Grundspår 300 m',
    summary: 'Ett träningsspår med två vinklar och slutföremål – steget före viltspårets 600 m.',
    suits: ['senior', 'puppy'], minutes: 30, intensity: 2, equipment: ['sparlina', 'sele', 'pinne', 'apport', 'godis'],
    builtFrom: ['s-fotsteg', 's-vinkel', 's-apport'],
    steps: [
      'Lägg spåret i skog med vindskydd: 100 m – vinkel – 100 m – vinkel – 100 m. Glesa godisar var 10:e m.',
      'Liggtid 30 min. Värm upp hunden med lugn kopplad promenad.',
      'Spåra! Följ med på 5–8 m lina och var tyst. Fest vid slutföremålet.',
    ],
    criteria: ['Hela spåret utan hjälp', 'Hittar slutföremålet'],
    labbeHack: { senior: 'Välj mjuk skogsmark utan stora rötter och stenar. Bryt hellre efter 200 m än att senioren blir stel i morgon.' },
  },

  // ───────────── SÖK ─────────────
  {
    id: 'k-lada', discipline: 'sok', level: 'byggsten', title: 'Lådsök – 5 kartonger',
    summary: 'Godis i en av fem kartonger. Hunden letar, du väntar.',
    suits: ['senior', 'puppy'], minutes: 8, intensity: 1, equipment: ['nosework', 'godis'],
    steps: [
      'Ställ ut 5 kartonger, lägg godis i en. Släpp hunden med signal ”sök”.',
      'När hunden hittar – belöna DIREKT vid lådan (i lådan).',
      'Flytta runt lådorna, lägg dem på sidan, staplade eller i rad.',
    ],
    criteria: ['Hittar rätt låda inom 30 sek', 'Ignorerar tomma lådor'],
    labbeHack: { senior: 'Perfekt regndagsaktivitet. Senioren kan söka i lugn takt och får hjärngympa utan belastning.' },
  },
  {
    id: 'k-doft', discipline: 'sok', level: 'byggsten', title: 'Doftinlärning (eukalyptus)',
    summary: 'Koppla måldoften till godis med en doftburk.',
    suits: ['senior', 'puppy'], minutes: 8, intensity: 1, equipment: ['nosework', 'godis', 'klicker'],
    steps: [
      'Lägg en droppe eukalyptusolja på en bomullspinne i en burk med hål. Klick när hunden nosar.',
      'Lägg burken bland två neutrala burkar. Belöna bara på rätt.',
      'Göm doftburken i rummet – första ”riktiga” sök!',
    ],
    criteria: ['Visar tydlig markering (stanna/titta) vid doften'],
  },
  {
    id: 'k-rum', discipline: 'sok', level: 'kedja', title: 'Rumsök med 2 gömmor',
    summary: 'Två gömmor i ett rum: på höjd, under möbel, i hörn.',
    suits: ['senior', 'puppy'], minutes: 10, intensity: 1, equipment: ['nosework', 'godis'],
    builtFrom: ['k-lada', 'k-doft'],
    steps: [
      'Göm två doftburkar: en i golvnivå, en på 50 cm höjd.',
      'Släpp hunden, håll dig passiv. Belöna markering, säg ”sök vidare”.',
      'När båda är hittade: ”färdigt” och belöna med lek.',
    ],
    criteria: ['Båda gömmor inom 2 min', 'Tydliga markeringar'],
  },
  {
    id: 'k-nw1', discipline: 'sok', level: 'program', title: 'Doftprov NW1-simulering',
    summary: 'NW1-tävlingens fyra sökmoment à 25 poäng: behållare, inomhus, utomhus och fordon.',
    suits: ['senior', 'puppy'], minutes: 25, intensity: 1, equipment: ['nosework', 'godis', 'koppel'],
    builtFrom: ['k-doftprov', 'k-behallare', 'k-rum', 'k-ute', 'k-fordon'],
    steps: [
      'Behållarsök: 6 kartonger, 1 gömma. Inomhussök: ett rum, 1 gömma.',
      'Utomhussök: 10×10 m yta i trädgården. Fordonssök: gömma vid hjulet på bilen.',
      'Säg ”markerat” högt när hunden visar gömman – som till domaren. Belöna stort vid gömman.',
    ],
    criteria: ['Alla 4 moment godkända', 'Inga falska markeringar'],
    labbeHack: {
      senior: 'Nosework är den perfekta ”tävlingssporten” för en labrador i seniorålder – många hundar tävlar långt upp i 12–13-årsåldern.',
    },
  },

  // ───────────── AGILITY (VALPANPASSAD) ─────────────
  {
    id: 'a-balans', discipline: 'agility', level: 'byggsten', title: 'Kroppskontroll på balansplatta',
    summary: 'Fram- och bakbenskännedom på en vinglig yta – stärker bålen.',
    suits: ['puppy', 'senior'], minutes: 5, intensity: 1, equipment: ['balans', 'godis', 'klicker'],
    steps: [
      'Belöna framtassar på plattan. Håll den stilla med foten i början.',
      'Låt plattan vippa lite. Belöna lugn och stabilitet.',
      'Bakbenskännedom: belöna när hunden kliver upp med alla fyra.',
    ],
    criteria: ['Står stilla med 4 tassar 5 sek'],
    labbeHack: {
      puppy: 'Inga hopp eller tvära vändningar före ca 12–15 månader. Labbar är tunga och tillväxtzonerna i lederna sluter sig sent.',
      senior: 'Balansträning är fantastiskt för seniorens rörlighet och stabilitet – kör 2–3 min varje dag.',
    },
  },
  {
    id: 'a-tunnel', discipline: 'agility', level: 'byggsten', title: 'Kort rak tunnel',
    summary: 'En hoptryckt, kort tunnel – hunden springer igenom mot belöning.',
    suits: ['puppy'], minutes: 5, intensity: 2, equipment: ['tunnel', 'leksak', 'godis'],
    steps: [
      'Tryck ihop tunneln till 1 m. Någon håller hunden, du lockar från andra sidan.',
      'Förläng tunneln gradvis. Belöna med leksak direkt vid utgången.',
      'Sänd hunden från din sida med signal ”tunnel”.',
    ],
    criteria: ['Springer igenom en rak 3 m tunnel på signal'],
  },
  {
    id: 'a-target', discipline: 'agility', level: 'byggsten', title: 'Target för kontaktfält',
    summary: 'Två bak på marken, två fram på plattan – grunden för kontakter.',
    suits: ['puppy', 'senior'], minutes: 6, intensity: 1, equipment: ['targetplatta', 'pall', 'godis', 'klicker'],
    steps: [
      'Belöna nos-touch på targetplattan.',
      'Placera plattan precis framför en låg pall. Hunden kliver ner och nuddar.',
      'Bygg duration: stanna 2 sek i position innan klick.',
    ],
    criteria: ['Hittar positionen självständigt'],
  },
  {
    id: 'a-kedja', discipline: 'agility', level: 'kedja', title: 'Kedja: Tunnel – kon – mark-bom',
    summary: 'Tunnel, runda en kon och gå över en bom som ligger på marken.',
    suits: ['puppy'], minutes: 10, intensity: 2, equipment: ['tunnel', 'koner', 'hinder', 'leksak'],
    builtFrom: ['a-tunnel', 'a-target'],
    steps: [
      'Tunnel → belöning.',
      'Tunnel → runda kon (runt din kropp) → belöning.',
      'Hela kedjan + kliva över marklagd bom. Lek!',
    ],
    criteria: ['Kedjan i följd med fart och glädje'],
  },
  {
    id: 'a-valpbana', discipline: 'agility', level: 'program', title: 'Valpbana (hoppfri)',
    summary: '6 moment på marknivå: tunnel, koner, platta, kliv-bommar och target.',
    suits: ['puppy'], minutes: 15, intensity: 2, equipment: ['tunnel', 'koner', 'balans', 'hinder', 'targetplatta'],
    builtFrom: ['a-balans', 'a-tunnel', 'a-target', 'a-kedja'],
    steps: [
      'Bygg banan i en ”S”-form: tunnel – kon – balansplatta – 2 bommar – target.',
      'Kör i två halvor. Pausa och låt valpen dricka.',
      'Hela banan i lugn galopp. Max 3 genomgångar.',
    ],
    criteria: ['Hela banan utan att tappa fokus', 'Stannar på target i slutet'],
    labbeHack: { puppy: 'Ingen slalom, inga hopp, ingen gungbräda innan lederna är färdigväxta. Halt underlag = nej.' },
  },

  // ───────────── TRICKS ─────────────
  {
    id: 't-apport-grepp', discipline: 'tricks', level: 'byggsten', title: 'Mjukt grepp & avlämning',
    summary: 'Hunden håller apporten lugnt och släpper i handen.',
    suits: ['puppy', 'senior'], minutes: 6, intensity: 1, equipment: ['apport', 'godis', 'klicker'],
    steps: [
      'Klicka när hunden nuddar dummyn med munnen. Sedan för att greppa.',
      'Håll din hand under hakan – klick för 1, 2, 3 sek lugnt hållande.',
      'Säg ”loss” och byt mot godis. Hunden lämnar i handen, aldrig på marken.',
    ],
    criteria: ['Håller lugnt 5 sek', 'Avlämnar i handen'],
    labbeHack: {
      general: 'Labradorer är avlade för ”mjuk mun” – men tuggande på apporten måste tränas bort tidigt. Belöna stilla grepp, inte tugg.',
    },
  },
  {
    id: 't-snurr', discipline: 'tricks', level: 'byggsten', title: 'Snurra åt båda håll',
    summary: 'Klassiskt trick som också värmer upp ryggraden.',
    suits: ['puppy', 'senior'], minutes: 4, intensity: 1, equipment: ['godis'],
    steps: [
      'Locka nosen i en cirkel med godis. Belöna hel snurr.',
      'Gör samma rörelse med tom hand.',
      'Lägg till ord: ”snurr” (höger) och ”virvel” (vänster).',
    ],
    criteria: ['Snurrar på verbal signal åt båda håll'],
    labbeHack: { senior: 'Gör stora, långsamma snurrar – det är en mjuk uppvärmning för senioren.' },
  },
  {
    id: 't-tass', discipline: 'tricks', level: 'byggsten', title: 'Tass i hand & high five',
    summary: 'Hunden lyfter tassen och lägger den i din hand.',
    suits: ['puppy', 'senior'], minutes: 4, intensity: 1, equipment: ['godis', 'klicker'],
    steps: [
      'Ha godis i stängd hand vid golvet. Klick när tassen nuddar handen.',
      'Öppna handen – belöna när tassen läggs i den.',
      'Höj handen gradvis till high five.',
    ],
    criteria: ['Tass på signal med båda tassarna'],
  },
  {
    id: 't-stada', discipline: 'tricks', level: 'kedja', title: 'Städa leksakerna i lådan',
    summary: 'Apport + släpp över låda = städande labrador.',
    suits: ['puppy', 'senior'], minutes: 10, intensity: 1, equipment: ['leksak', 'godis', 'klicker'],
    builtFrom: ['t-apport-grepp'],
    steps: [
      'Håll godis över lådan. När hunden har leksaken i munnen och lutar sig över – säg ”loss”.',
      'Klick när leksaken landar i lådan.',
      'Sprid ut 3 leksaker och säg ”städa”.',
    ],
    criteria: ['Lägger 3 leksaker i lådan på en signal'],
    labbeHack: { general: 'Apporterande raser lär sig detta snabbt – och det sparar ryggen på matte/husse!' },
  },
  {
    id: 't-novice', discipline: 'tricks', level: 'program', title: 'Trickhund Novice – showen',
    summary: 'En kort trickserie inför kamera: tass, snurr, städa, buga och ”pang”.',
    suits: ['puppy', 'senior'], minutes: 15, intensity: 1, equipment: ['godis', 'leksak', 'matta'],
    builtFrom: ['t-snurr', 't-tass', 't-stada'],
    steps: [
      'Välj 5 tricks och sätt dem i en rolig ordning.',
      'Kör igenom med belöning efter varje trick, sedan efter varannan.',
      'Filma hela serien – perfekt minne till bilddagboken!',
    ],
    criteria: ['5 tricks i rad med en belöning i slutet'],
    pairTip: 'I Dual Mode: låt hundarna göra ”tass” samtidigt – den som väntar lär sig passivitet.',
  },

  // ───────── SENIOR-FRISKVÅRD (ligger i tricks/agility för enkelhetens skull) ─────────
  {
    id: 'a-cavaletti', discipline: 'agility', level: 'byggsten', title: 'Cavaletti-skritt (låga bommar)',
    summary: '4–6 bommar på marken i skritt – stärker koordination och rörlighet.',
    suits: ['senior', 'puppy'], minutes: 6, intensity: 1, equipment: ['hinder', 'godis', 'koppel'],
    steps: [
      'Lägg bommar på marken med en hundlängds avstånd.',
      'Led hunden i lugn skritt över bommarna med godis i höjd med nosen.',
      'Höj bommarna 3–5 cm för senioren (aldrig mer). För valpen: kvar på marken.',
    ],
    criteria: ['Skritt utan att röra bommarna'],
    labbeHack: { senior: 'Cavaletti är fysioterapeuters favorit för äldre labbar med artros – mjukt, kontrollerat och bygger muskler kring höfterna.' },
  },
  {
    id: 't-stretch', discipline: 'tricks', level: 'byggsten', title: 'Buga & godis-stretch',
    summary: 'Stretcha nacke och rygg med hjälp av godis.',
    suits: ['senior', 'puppy'], minutes: 4, intensity: 1, equipment: ['godis', 'matta'],
    steps: [
      'Hunden står. För godis från nosen mot bröstet – nacken sträcks ner.',
      'För godiset mot höften – sidböj, båda hållen. Håll 3 sek.',
      'Buga: led godis ner mellan frambenen tills bröstet sänks.',
    ],
    criteria: ['Mjuka rörelser, håll 3 sek åt varje håll'],
    labbeHack: { senior: 'Perfekt som uppvärmning och nedvarvning. Gör på halkfri matta.' },
  },
];

export const EXERCISES: Exercise[] = [
  ...BASE_EXERCISES.map((e) => (BASE_PROGRAM_MOMENTS[e.id] ? { ...e, moments: BASE_PROGRAM_MOMENTS[e.id] } : e)),
  ...MORE_EXERCISES,
  ...SPORT_EXERCISES,
];

export const exerciseById = (id: string) => EXERCISES.find((e) => e.id === id);
export const disciplineById = (id: DisciplineId) => DISCIPLINES.find((d) => d.id === id)!;

/** Uppvärmning & nedvarvning för pass-generatorn */
export const WARMUPS = {
  senior: [
    'Lugn kopplad promenad, låt hunden nosa fritt (skritt)',
    'Godis-stretch: nacke ner, sidböj åt båda håll',
    'Stora långsamma snurrar åt båda håll',
  ],
  puppy: [
    'Lek och kontakt – namninlärning med godis',
    'Kort skritt och trav i koppel',
    'Balansplatta 1 min',
  ],
};

export const COOLDOWNS = {
  senior: [
    'Lugn promenad i skritt',
    'Mjuk massage längs ryggen och baklåren',
    'Vatten och vila på bädd',
  ],
  puppy: [
    'Tugg-ben eller slickmatta på filten',
    'Lugn passivitet – belöna suckar',
    'Vatten och tupplur',
  ],
};

import type { Discipline, DisciplineId, Equipment, EquipmentId, Exercise } from '../types';

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
  { id: 'vardag', name: 'Vardagslydnad', tagline: 'Grunden för ett lugnt liv ihop', goalLabel: 'Startklass Lydnad', icon: 'Home' },
  { id: 'rally', name: 'Rallylydnad', tagline: 'Skylt för skylt, glädje hela vägen', goalLabel: 'Rally Nybörjarklass', icon: 'Signpost' },
  { id: 'spar', name: 'Spår', tagline: 'Följ doften steg för steg', goalLabel: 'Anlagsprov Spår', icon: 'Footprints' },
  { id: 'sok', name: 'Sök', tagline: 'Nosework & doftsök', goalLabel: 'Doftprov NW1', icon: 'Search' },
  { id: 'agility', name: 'Agility', tagline: 'Valpanpassat – marknivå & kroppskontroll', goalLabel: 'Valpbana (hoppfri)', icon: 'Zap' },
  { id: 'tricks', name: 'Tricks & Roligt', tagline: 'Hjärngympa och skratt', goalLabel: 'Trickhund Novice', icon: 'Sparkles' },
];

export const LEVEL_LABEL = {
  byggsten: 'Byggsten',
  kedja: 'Mini-kedja',
  program: 'Program / bana',
} as const;

export const EXERCISES: Exercise[] = [
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
    summary: 'Hela startklassprogrammet i träningsform: platsliggning, linförighet, inkallning, ställande och apport.',
    suits: ['senior', 'puppy'], minutes: 25, intensity: 2, equipment: ['koppel', 'apport', 'godis', 'koner'],
    builtFrom: ['v-sitt-stanna', 'v-linforing', 'v-inkallning', 't-apport-grepp'],
    steps: [
      'Platsliggning 1 min i grupp (träna med den andra hunden bredvid). Fritt följ med vändningar.',
      'Inkallning från 15 m, sedan ”Ställande under gång”. Belöna mellan momenten i början.',
      'Apportering av bock på 5 m: utgångsställning, sänd, avlämning i sitt. Avsluta med lek.',
    ],
    criteria: ['Klarar alla moment i följd med max 3 belöningar', 'Avlämning utan att tappa bocken'],
    labbeHack: {
      senior: 'Byt ut ställande/sitt-moment mot det som är bekvämt för leden. Tävling är inte målet – glädjen är.',
      puppy: 'Kör programmet i delar. En valp under 1 år ska inte köra hela program i följd.',
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
    summary: 'Komplett övningsbana i nybörjarklass – helt med koppel.',
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
    id: 's-anlag', discipline: 'spar', level: 'program', title: 'Anlagsspår 300 m',
    summary: 'Ett realistiskt anlagsspår med två vinklar, en apport och 30 min liggtid.',
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
    summary: 'Fyra sökmoment: behållare, inomhus, utomhus och fordon – som på riktigt prov.',
    suits: ['senior', 'puppy'], minutes: 25, intensity: 1, equipment: ['nosework', 'godis', 'koppel'],
    builtFrom: ['k-lada', 'k-doft', 'k-rum'],
    steps: [
      'Behållarsök: 6 kartonger, 1 gömma. Inomhussök: ett rum, 1 gömma.',
      'Utomhussök: 10×10 m yta i trädgården. Fordonssök: gömma vid hjulet på bilen.',
      'Säg ”Hittat!” högt vid markering – som till domaren. Belöna stort.',
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

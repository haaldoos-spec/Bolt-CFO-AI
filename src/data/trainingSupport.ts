import type { Exercise } from '../types';

/**
 * Stödhund – bara för valpen (Kyle). Egenträning utan formell utbildning.
 * Varje moment har en rekommenderad startålder: hjärnan och lederna ska hinna med.
 */
export const SUPPORT_EXERCISES: Exercise[] = [
  // ───────────── BYGGSTENAR ─────────────
  {
    id: 'sh-handtarget', discipline: 'stod', level: 'byggsten', title: 'Fokusbyte – nos mot hand',
    summary: 'Startålder: från början. Kyle trycker nosen mot din hand, och din uppmärksamhet flyttas från oron till honom.',
    suits: ['puppy'], minutes: 3, intensity: 1, equipment: ['godis', 'klicker'],
    steps: [
      'Håll fram en öppen hand 5 cm från nosen. Så fort nosen nuddar – ”ja!” och godis.',
      'Flytta handen lite varje gång: åt sidan, lägre, högre. Lägg till ordet ”hand”.',
      'Öva när du mår bra, så att det sitter. Sedan kan du be om ”hand” när du behöver något annat att fokusera på.',
    ],
    criteria: ['Nosar i handen 9 av 10', 'Gör det i ett annat rum', 'Gör det när du sitter på golvet'],
    labbeHack: { puppy: 'Labbar är sociala och älskar att få vara till nytta. Små, glada pass slår långa.' },
  },
  {
    id: 'sh-nosa', discipline: 'stod', level: 'byggsten', title: 'Putta på signal – ”nosa”',
    summary: 'Startålder: ca 3 mån. Kyle puffar mjukt med nosen mot din hand, ditt ben eller din arm, så att du avbryter det du håller på med.',
    suits: ['puppy'], minutes: 4, intensity: 1, equipment: ['godis', 'klicker'],
    steps: [
      'Fånga det: när Kyle råkar nosa på dig – ”ja!” och godis. Lägg till ordet ”nosa”.',
      'Be om ”nosa” på olika ställen: handen, benet, armen. Belöna mjuka puffar, inte stötar.',
      'Bygg på med 2–3 puffar i rad innan belöningen. Efter varje tillfälle: vänta och se om hans uppmärksamhet fångar din.',
    ],
    criteria: ['Nosar mjukt på signal 8 av 10', 'Gör det när du sitter eller ligger'],
  },
  {
    id: 'sh-hamta', discipline: 'stod', level: 'byggsten', title: 'Hämta och lämna',
    summary: 'Startålder: ca 3–4 mån. Kyle tar upp en sak och lägger den i din hand.',
    suits: ['puppy'], minutes: 5, intensity: 1, equipment: ['apport', 'godis', 'klicker'],
    steps: [
      'Belöna varje gång han nosar på en mjuk leksak. Sedan när han tar den i munnen.',
      'Ta ett steg bakåt så att han följer efter. Belöna när han lägger leksaken i din hand – inte att han tappar den.',
      'Öka avståndet till 2–3 meter. Lägg till ordet ”hämta”.',
    ],
    criteria: ['Hämtar en mjuk sak 3 m och lämnar i handen', 'Lämnar utan att du tjatar'],
    labbeHack: { puppy: 'Labbar är född apportörer. Låt det vara roligt, inte en uppgift – annars tappar han lusten.' },
  },
  {
    id: 'sh-hamta-saker', discipline: 'stod', level: 'byggsten', title: 'Hämta telefon, vatten och jacka',
    summary: 'Startålder: ca 6 mån. Bygg på hämta-övningen med vardagsföremål du faktiskt behöver.',
    suits: ['puppy'], minutes: 6, intensity: 1, equipment: ['apport', 'godis'],
    steps: [
      'Börja med föremål som är lätta att ta: en mjuk tygpåse, en gammal mjuk plånbok, en liten vattenflaska i plast med handtag.',
      'Ge varje sak ett eget ord (”telefon”, ”vatten”, ”jacka”). Lägg bara en sak åt gången på golvet.',
      'Öva när du sitter i sängen eller soffan. Lägg till små avstånd, och blanda in två olika saker med varsitt ord.',
    ],
    criteria: ['Hämtar rätt sak på ordet 4 av 5', 'Lämnar i handen i soffan'],
    labbeHack: { puppy: 'Mjuka påsar och snöre går bra. Hårda föremål och glas ska han aldrig bära.' },
  },
  {
    id: 'sh-huvud-knä', discipline: 'stod', level: 'byggsten', title: 'Huvud i knät',
    summary: 'Startålder: från början. Kyle lägger huvudet i ditt knä och blir där – lugnande närhet utan vikt.',
    suits: ['puppy'], minutes: 4, intensity: 1, equipment: ['godis', 'filt'],
    steps: [
      'Sitt på golvet. Belöna varje gång han har nosen eller hakan på knät. Lägg till ordet ”knä”.',
      'Vänta lite längre mellan belöningarna: 2 sekunder, sedan 5, sedan 10.',
      'Klappa lugnt och långsamt. Bygg upp till en minut, och belöna när han slappnar av och suckar.',
    ],
    criteria: ['Lägger huvudet i knät på ordet', 'Stannar 30 sek lugnt'],
    labbeHack: { puppy: 'Tryck med vikt är inte aktuellt förrän lederna är färdigväxta (ca 12–18 mån). Huvudet i knät är helt skonsamt.' },
  },
  {
    id: 'sh-ligg-bredvid', discipline: 'stod', level: 'byggsten', title: 'Ligg bredvid mig',
    summary: 'Startålder: från början. Kyle lägger sig ner tätt intill dig och slappnar av när du behöver det.',
    suits: ['puppy'], minutes: 5, intensity: 1, equipment: ['filt', 'godis'],
    steps: [
      'Lägg filten bredvid dig. Belöna allt som liknar att lägga sig på den. Lägg till ordet ”bredvid”.',
      'Belöna först när han ligger kvar. Flytta filten närmare dig tills den är mot din sida.',
      'Ta bort filten och be om ”bredvid” på golvet eller i soffan.',
    ],
    criteria: ['Ligger lugnt bredvid dig 3 min', 'Gör det på två olika platser'],
  },
  {
    id: 'sh-tryck', discipline: 'stod', level: 'byggsten', title: 'Lutning och tryck mot benet',
    summary: 'Startålder: lätt lutning från ca 4 mån. Kyle lutar sig mjukt mot dina ben. Tyngre tryck först när han är vuxen.',
    suits: ['puppy'], minutes: 4, intensity: 1, equipment: ['godis', 'matta'],
    steps: [
      'Sitt på golvet eller i en stol. Belöna när hans sida eller rygg rör vid ditt ben. Lägg till ordet ”tryck”.',
      'Be honom stanna kvar i 5, 10, sedan 30 sekunder. Belöna med lugn röst och långsam klappning.',
      'Vuxen hund: öva att lägga sig på dina ben eller över knäna. Börja mycket kort. Gör aldrig övningen om Kyle verkar obekväm.',
    ],
    criteria: ['Lutar sig mot dig 30 sek', 'Gör det på signal'],
    labbeHack: { puppy: 'Djupt tryck med full kroppsvikt: vänta tills Kyle är minst 12–18 månader och vägen över 25 kg. Fråga veterinären om lederna först.' },
  },
  {
    id: 'sh-bakom', discipline: 'stod', level: 'byggsten', title: 'Stå bakom mig – skydda utrymme',
    summary: 'Startålder: ca 5 mån. Kyle ställer sig bakom eller framför dig så att folk håller avstånd.',
    suits: ['puppy'], minutes: 5, intensity: 1, equipment: ['godis', 'koppel'],
    steps: [
      'Lär ”bakom”: lura honom runt dig med godis så att han hamnar bakom dina ben. Belöna när han stannar där.',
      'Lär ”sitt” eller ”stå” bakom dig. Bygg tiden: 5, 10, 30 sekunder, i koppel.',
      'Öva med en kompis som går nära. Han ska stanna lugnt – inte skälla eller morra. Belöna avslappnat beteende.',
    ],
    criteria: ['Stannar bakom dig 30 sek', 'Är lugn när någon går förbi'],
    labbeHack: { puppy: 'Det handlar om att vara en trygg buffert, inte en vakthund. Skäller eller morrar han: sänk svårigheten.' },
  },
  {
    id: 'sh-ga-fore', discipline: 'stod', level: 'byggsten', title: 'Gå före till dörren',
    summary: 'Startålder: ca 6 mån. Kyle leder dig i en riktning, till dörren eller en tydlig plats.',
    suits: ['puppy'], minutes: 5, intensity: 1, equipment: ['godis', 'koppel', 'targetplatta'],
    steps: [
      'Lägg en matta vid dörren. Belöna varje gång han går dit. Lägg till ordet ”dörren”.',
      'Be om ”dörren” från längre bort, och från olika rum. Gå med honom.',
      'Öva ute: ”dörren” blir en utgång, en bänk eller en bil. Belöna när han stannar vid målet och väntar på dig.',
    ],
    criteria: ['Går till dörren från ett annat rum', 'Stannar vid dörren och väntar på dig'],
  },
  {
    id: 'sh-hitta-hem', discipline: 'stod', level: 'byggsten', title: 'Hitta hem',
    summary: 'Startålder: ca 8–10 mån. Kyle leder dig hem eller till bilen på ordet.',
    suits: ['puppy'], minutes: 8, intensity: 1, equipment: ['godis', 'langlina'],
    steps: [
      'Börja 20 meter från dörren. Säg ”hem” och gå med honom. Belöna stort vid dörren.',
      'Öka avståndet, och gå från olika håll. Använd samma ord och samma belöning hemma.',
      'Låt honom gå före på långlina på kända rutter. Kom ihåg att korta rundor räcker – han är ung.',
    ],
    criteria: ['Leder hem från 100 m', 'Gör det på två olika rutter'],
    labbeHack: { puppy: 'Valpars promenadlängd: ca 5 min per månad i ålder, två gånger om dagen. Prioritera korta, kvalitativa rundor.' },
  },

  // ───────────── MINI-KEDJOR ─────────────
  {
    id: 'sh-kedja-angest', discipline: 'stod', level: 'kedja', title: 'Kedja: Ångestkedjan',
    summary: 'Fokusbyte → nosa → huvud i knät. Tre enkla steg att ta till när det knyter sig.',
    suits: ['puppy'], minutes: 8, intensity: 1, equipment: ['godis', 'filt'],
    builtFrom: ['sh-handtarget', 'sh-nosa', 'sh-huvud-knä'],
    steps: [
      'Be om ”hand” – fokusera på hans nos mot din handflata och på andningen.',
      'Be om ”nosa” – känn puffen, räkna tre. Låt den avbryta tanken.',
      'Be om ”knä” – klappa långsamt och låt axlarna sjunka. Andas ut längre än du andas in.',
    ],
    criteria: ['Alla tre steg i följd utan tjat', 'Klarar kedjan även när du är stressad (träna i små doser)'],
    labbeHack: { general: 'Träna kedjan när du mår bra. Då sitter den som en vana den dag du behöver den.' },
  },
  {
    id: 'sh-kedja-affar', discipline: 'stod', level: 'kedja', title: 'Kedja: Ut ur affären',
    summary: 'Stå bakom → gå före → dörren. Så tar ni er ut när det blir för mycket.',
    suits: ['puppy'], minutes: 10, intensity: 1, equipment: ['koppel', 'godis'],
    builtFrom: ['sh-bakom', 'sh-ga-fore', 'sh-hitta-hem'],
    steps: [
      'Hemma: stå i hallen, be om ”bakom”, och därefter ”dörren”. Belöna vid dörren.',
      'Ute: öva på en lugn plats som en bänk eller entré. Kort, och hem igen innan han blir trött.',
      'Offentlig miljö (kräver att Kyle är vaccinerad, vuxen nog och trygg): träna på tider med få människor. Ta alltid reda på reglerna för platsen.',
    ],
    criteria: ['Klarar kedjan i tre olika miljöer', 'Är glad och avslappnad när ni kommer ut'],
    labbeHack: { puppy: 'Utan officiell certifiering har du ingen laglig rätt att ta med hund i butiker, på buss eller i andra privata miljöer. Fråga alltid först.' },
  },

  // ───────────── PROGRAM ─────────────
  {
    id: 'sh-program-grund', discipline: 'stod', level: 'program', title: 'Program: Stödhund – grunderna',
    summary: 'Allt ni tränat samlat i ett lugnt pass hemma, när Kyle är runt 12 månader.',
    suits: ['puppy'], minutes: 15, intensity: 1, equipment: ['godis', 'filt', 'apport', 'koppel'],
    builtFrom: ['sh-handtarget', 'sh-nosa', 'sh-huvud-knä', 'sh-hamta', 'sh-ligg-bredvid', 'sh-ga-fore'],
    moments: ['Fokusbyte (nos mot hand)', 'Nosa på signal', 'Huvud i knät', 'Hämta och lämna', 'Ligg bredvid', 'Gå till dörren'],
    steps: [
      'Kör 2–3 moment i taget. Avsluta med något Kyle gillar.',
      'Öva även när du mår bra, och varva med tid då inget tränas – bara vila och närhet.',
      'Utvärdera: vad hjälper dig mest, och vad vill du träna mer? Det är ditt program.',
    ],
    criteria: ['Alla moment utan godis i handen', 'Kyle är glad och avspänd under hela passet'],
    labbeHack: { puppy: 'Tänk på att Kyle är en hund, inte en behandling. Han behöver vila, lek och egna dagar. Boka tid hos vården om du mår dåligt – hunden är ett stöd, inte en ersättning.' },
  },
];

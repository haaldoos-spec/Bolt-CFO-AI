/**
 * Guide: Första tiden med valpen. Gäller bara valpen.
 * Tumregler för en labradorvalp som kommer hem vid ca 8 veckor.
 */

export interface GuideTopic {
  id: string;
  emoji: string;
  title: string;
  intro: string;
  steps: string[];
  mistakes?: string[];
  labbe?: string;
  checklist: { id: string; text: string }[];
}

export interface GuidePhase {
  id: string;
  label: string;
  age: string;
  summary: string;
  topics: GuideTopic[];
}

export const DAY_SCHEDULE: { time: string; what: string; kind: 'ut' | 'mat' | 'sov' | 'lek' | 'traning' }[] = [
  { time: '06.30', what: 'Direkt ut och kissa – bär valpen de första veckorna', kind: 'ut' },
  { time: '07.00', what: 'Frukost (mål 1), sedan ut igen efter 10–15 min', kind: 'mat' },
  { time: '07.30', what: 'Lek och mys 15–20 min, 2 min namnträning', kind: 'lek' },
  { time: '08.00', what: 'Sömn i bädden eller hägnet – 1,5–2 h', kind: 'sov' },
  { time: '10.00', what: 'Ut, kort upptäcktsrunda i trädgården', kind: 'ut' },
  { time: '11.30', what: 'Lunch (mål 2) + ut. Kort hanteringsövning', kind: 'mat' },
  { time: '12.00', what: 'Lång tupplur – ensamhetsträning när valpen sover', kind: 'sov' },
  { time: '14.30', what: 'Ut, miljöträning i liten skala (nytt underlag, nytt ljud)', kind: 'traning' },
  { time: '16.30', what: 'Middag (mål 3) + ut', kind: 'mat' },
  { time: '17.00', what: 'Sömn', kind: 'sov' },
  { time: '19.00', what: 'Kvällsmål (mål 4, de första veckorna) + lugn lek', kind: 'mat' },
  { time: '21.30', what: 'Sista kisset – lugnt och tråkigt, inga lekar', kind: 'ut' },
  { time: '22.00', what: 'Natt i bädd/bur bredvid din säng. Ut en gång i natt vid behov', kind: 'sov' },
];

export const FEEDING: { age: string; meals: string; note: string }[] = [
  { age: '8–12 v', meals: '4 mål', note: 'Samma foder som hos uppfödaren de första veckorna' },
  { age: '3–6 mån', meals: '3 mål', note: 'Byt foder gradvis under 7–10 dagar om du vill byta' },
  { age: '6–12 mån', meals: '2 mål', note: 'Valpfoder för stora raser, följ viktkurvan' },
  { age: '12 mån+', meals: '2 mål', note: 'Gå över till vuxenfoder i lugn takt' },
];

export const SLEEP_NOTE = 'En valp på 8–12 veckor behöver sova 18–20 timmar per dygn. En övertrött valp bits och busar mer – ge tvångsvila i hägn eller bur efter 45–60 min vaken tid.';

export const PUPPY_PHASES: GuidePhase[] = [
  {
    id: 'fore',
    label: 'Före hemkomst',
    age: '1–2 veckor innan',
    summary: 'Förbered hemmet, köp det viktigaste och bestäm regler i familjen.',
    topics: [
      {
        id: 'prep-hem',
        emoji: '🏠',
        title: 'Valpsäkra hemmet',
        intro: 'En labradorvalp utforskar med munnen. Det som ligger lågt kommer att tuggas på.',
        steps: [
          'Lyft upp sladdar, skor, barnleksaker, krukväxter och allt som går att svälja.',
          'Sätt grind i trappan – valpen ska inte springa i trappor under tillväxten.',
          'Bestäm ett "valprum" (t.ex. köket) med halkfritt golv, hägn och bädd.',
          'Kolla giftiga växter och livsmedel: choklad, xylitol (tuggummi), vindruvor/russin, lök.',
        ],
        labbe: 'Labbar är kända för att svälja strumpor och leksaksbitar. Lägg allt i lådor eller korgar på höjd.',
        checklist: [
          { id: 'prep-hem-1', text: 'Sladdar och skor undanplockade' },
          { id: 'prep-hem-2', text: 'Trappgrind på plats' },
          { id: 'prep-hem-3', text: 'Valprummet iordningställt' },
        ],
      },
      {
        id: 'prep-kop',
        emoji: '🛒',
        title: 'Inköpslista',
        intro: 'Köp hellre lite och bra än mycket. Det mesta växer valpen ur.',
        steps: [
          'Bädd eller bur (för en vuxen labbe: ca 90 cm lång) + filt som luktar uppfödaren.',
          'Valphägn, mat- och vattenskål, samma foder som hos uppfödaren.',
          'Mjuk sele + lätt koppel (2 m) och långlina (5–10 m), ID-bricka.',
          'Tuggben/Kong, slickmatta och 2–3 leksaker av olika material.',
          'Klotång, mjuk borste, enzymrengöring för olyckor (luktar inte kvar).',
        ],
        checklist: [
          { id: 'prep-kop-1', text: 'Bädd/bur och hägn' },
          { id: 'prep-kop-2', text: 'Foder, skålar och tuggsaker' },
          { id: 'prep-kop-3', text: 'Sele, koppel, långlina och ID-bricka' },
          { id: 'prep-kop-4', text: 'Enzymrengöring för kiss' },
        ],
      },
      {
        id: 'prep-regler',
        emoji: '📋',
        title: 'Familjens regler',
        intro: 'Valpen lär sig snabbast om alla gör likadant.',
        steps: [
          'Bestäm ord: "sitt", "ligg", "varsågod", "fy" (eller hellre "nej tack"), "kissa".',
          'Bestäm vad som gäller i soffan och sängen – från dag ett.',
          'Gör ett schema för vem som går ut på morgonen, mitt på dagen och på kvällen.',
          'Förbered senioren: ordna en egen vrå dit valpen inte får gå.',
        ],
        labbe: 'Den äldre hunden behöver få vila ifrån valpen. Grind eller hägn skyddar senioren lika mycket som valpen.',
        checklist: [
          { id: 'prep-regler-1', text: 'Signalord bestämda' },
          { id: 'prep-regler-2', text: 'Seniorens fristad ordnad' },
        ],
      },
    ],
  },
  {
    id: 'dag1',
    label: 'Första dygnet',
    age: 'ca 8 veckor',
    summary: 'Lugn hämtning, lugn hemkomst och en trygg första natt.',
    topics: [
      {
        id: 'd1-hamtning',
        emoji: '🚗',
        title: 'Hämtning och bilresa',
        intro: 'Första bilresan formar valpens bilvana. Gör den så lugn som möjligt.',
        steps: [
          'Hämta på förmiddagen så valpen hinner landa innan natten.',
          'Låt valpen ligga i en bur eller i knät hos en passagerare med handduk under.',
          'Ingen mat strax innan resan. Pausa för kiss om resan är lång.',
          'Be uppfödaren om en filt som luktar mamma och syskon.',
        ],
        checklist: [
          { id: 'd1-hamtning-1', text: 'Filt från uppfödaren med' },
          { id: 'd1-hamtning-2', text: 'Foder- och vaccinationspapper med' },
        ],
      },
      {
        id: 'd1-hem',
        emoji: '🐾',
        title: 'Hemkomsten och mötet med senioren',
        intro: 'Börja i trädgården, inte i hallen.',
        steps: [
          'Bär valpen direkt till kisstället. Vänta tyst, beröm lugnt när valpen kissar.',
          'Låt valpen utforska ett rum i taget. Inga gäster de första dagarna.',
          'Senioren och valpen möts på neutral mark (trädgården), senioren i koppel och lugn.',
          'Belöna senioren för lugn. Avbryt innan någon blir för uppspelt.',
        ],
        mistakes: ['Att bjuda hem släkt och vänner första helgen', 'Att låta valpen hänga på seniorens öron utan att avbryta'],
        labbe: 'Många äldre labbar säger ifrån med ett kort morr – det är okej och lärorikt. Men se till att senioren alltid kan gå undan.',
        checklist: [
          { id: 'd1-hem-1', text: 'Första kisset i trädgården' },
          { id: 'd1-hem-2', text: 'Lugnt första möte med senioren' },
        ],
      },
      {
        id: 'd1-natt',
        emoji: '🌙',
        title: 'Första natten',
        intro: 'Valpen har aldrig sovit ensam. Närhet nu ger en tryggare hund senare.',
        steps: [
          'Ställ bädden eller buren bredvid din säng så du kan lägga en hand vid valpen.',
          'Sista kisset precis före läggdags. Lugnt och tråkigt, ingen lek.',
          'Vaknar valpen och piper: bär ut direkt, kissa, in igen utan lek eller prat.',
          'Flytta bädden en bit längre bort först när valpen sover tryggt flera nätter i rad.',
        ],
        checklist: [
          { id: 'd1-natt-1', text: 'Bädden står vid sängen' },
          { id: 'd1-natt-2', text: 'Första natten avklarad' },
        ],
      },
    ],
  },
  {
    id: 'v1',
    label: 'Vecka 1–2',
    age: '8–10 veckor',
    summary: 'Rutiner för mat, sömn och rumsrenhet. Valpen lär sig sitt namn.',
    topics: [
      {
        id: 'v1-rutiner',
        emoji: '⏰',
        title: 'Mat- och sovrutiner',
        intro: 'Förutsägbara dagar ger en lugn valp. Se dagsschemat ovan.',
        steps: [
          'Fyra mål om dagen på fasta tider. Ta bort skålen efter 10 minuter.',
          'Tvångsvila: efter 45–60 min vaken tid går valpen in i hägnet med något att tugga på.',
          'Låt valpen sova ostört – barn och senior får inte väcka.',
          'Använd en del av dagsransonen som träningsgodis.',
        ],
        labbe: 'Labbar blir lätt runda. Känn efter revbenen – de ska gå att känna utan att synas. För mycket vikt under tillväxten belastar höfter och armbågar.',
        checklist: [
          { id: 'v1-rutiner-1', text: 'Fasta mattider i en vecka' },
          { id: 'v1-rutiner-2', text: 'Tvångsvila i hägnet fungerar' },
        ],
      },
      {
        id: 'v1-rumsren',
        emoji: '🚽',
        title: 'Rumsrenhet',
        intro: 'Målet är att valpen aldrig hinner göra fel inomhus. Varje lyckat kiss ute är en investering.',
        steps: [
          'Gå ut: när valpen vaknar, efter mat, efter lek, och minst varannan timme.',
          'Gå till samma ställe. Säg "kissa" när valpen gör det, beröm och ge godis direkt efteråt.',
          'Tecken på kissnödig valp: nosar i cirkel, går mot dörren, avbryter leken.',
          'Olycka inne? Säg ingenting, bär ut, städa med enzymrengöring. Skäll aldrig.',
          'De flesta labbar är rumsrena vid 4–6 månader. Bakslag är normalt.',
        ],
        mistakes: ['Att skälla eller trycka ner nosen i kisset – valpen lär sig bara att gömma sig', 'Tidningspapper inne – det lär valpen att det är okej att kissa inne'],
        checklist: [
          { id: 'v1-rumsren-1', text: 'Fast kissställe ute' },
          { id: 'v1-rumsren-2', text: 'Signalordet "kissa" inlärt' },
          { id: 'v1-rumsren-3', text: 'En hel dag utan olyckor' },
          { id: 'v1-rumsren-4', text: 'En hel vecka utan olyckor' },
        ],
      },
      {
        id: 'v1-namn',
        emoji: '📣',
        title: 'Första träningen: namn och kontakt',
        intro: 'Två minuter några gånger om dagen räcker. Allt ska vara roligt.',
        steps: [
          'Säg namnet en gång – tittar valpen på dig får den godis. 5 gånger, sedan paus.',
          'Belöna varje gång valpen självmant tittar på dig eller kommer till dig.',
          'Ladda visselpipan: pip och ge 5 godisbitar i rad. Ingen krav, bara fest.',
          'Klicka eller säg "bra" och ge godis för sitt – lura inte, vänta tills det händer.',
        ],
        labbe: 'Kör pipladdningen redan nu – en labrador som älskar visselpipan är guld värd i skogen.',
        checklist: [
          { id: 'v1-namn-1', text: 'Vänder sig om på namnet' },
          { id: 'v1-namn-2', text: 'Visselpipan laddad' },
          { id: 'v1-namn-3', text: 'Erbjuder sitt' },
        ],
      },
      {
        id: 'v1-bett',
        emoji: '🦷',
        title: 'Valpbett',
        intro: 'Alla valpar biter. Det är så de leker. Vi lär dem att mänsklig hud är skör.',
        steps: [
          'Bit i händerna: säg lugnt "aj", ta bort handen och ge en leksak i stället.',
          'Fortsätter valpen: res dig och gå därifrån 30 sekunder.',
          'Mycket bitande betyder oftast övertrött valp – dags för tvångsvila.',
          'Ha alltid en tuggsak nära, särskilt kvällstid ("vargtimmen").',
        ],
        checklist: [{ id: 'v1-bett-1', text: 'Bitandet minskar märkbart' }],
      },
    ],
  },
  {
    id: 'v3',
    label: 'Vecka 3–6',
    age: '10–14 veckor',
    summary: 'Ensamhetsträning, hantering, koppelvana och försiktig socialisering.',
    topics: [
      {
        id: 'v3-ensam',
        emoji: '🚪',
        title: 'Ensamhetsträning',
        intro: 'Börja långt innan valpen behöver vara ensam på riktigt. Bygg sekunder, inte timmar.',
        steps: [
          'Steg 1: Gå ut ur rummet i 5 sekunder när valpen tuggar på något. Kom tillbaka lugnt.',
          'Steg 2: Öka till 30 sek, 1 min, 3 min. Variera – ibland kort, ibland lite längre.',
          'Steg 3: Gå ut genom ytterdörren 1 min. Ge en frusen Kong precis innan du går.',
          'Steg 4: Bygg mot 30 min, sedan 1 h. Max ca 3–4 h för en vuxen hund.',
          'Gör avfärd och hemkomst odramatiska. Hälsa först när valpen är lugn.',
        ],
        mistakes: ['Att öka för fort – piper valpen har du gått för långt; backa ett steg', 'Att börja med en hel arbetsdag'],
        labbe: 'Senioren hemma hjälper ofta, men träna även att valpen klarar sig utan den äldre hunden – annars blir det svårt den dag senioren ska till veterinären.',
        checklist: [
          { id: 'v3-ensam-1', text: '1 minut ensam i rummet utan pip' },
          { id: 'v3-ensam-2', text: '10 minuter ensam hemma' },
          { id: 'v3-ensam-3', text: '30 minuter ensam hemma' },
          { id: 'v3-ensam-4', text: '1 timme ensam hemma' },
          { id: 'v3-ensam-5', text: 'Ensam utan senioren' },
        ],
      },
      {
        id: 'v3-hantering',
        emoji: '✋',
        title: 'Hantering och pälsvård',
        intro: 'En hund som gillar att bli hanterad är lättare att sköta – hos dig och hos veterinären.',
        steps: [
          'Titta i öronen, lyft på läppen, håll en tass – godis efter varje del.',
          'Klipp en klo i taget. Det räcker att klippa en klo per dag.',
          'Borsta kort med mjuk borste, torka tassarna efter promenaden.',
          'Lek "veterinär": ställ valpen på ett bord på en matta och känn på magen.',
        ],
        checklist: [
          { id: 'v3-hantering-1', text: 'Tittar i öron och mun utan protest' },
          { id: 'v3-hantering-2', text: 'Klor klippta' },
          { id: 'v3-hantering-3', text: 'Står stilla på bordet' },
        ],
      },
      {
        id: 'v3-koppel',
        emoji: '🦮',
        title: 'Sele och koppelvana',
        intro: 'Sele först inomhus, sedan kopplet – utan att dra.',
        steps: [
          'Sätt på selen vid matdags några minuter, ta av när valpen är lugn.',
          'Låt kopplet släpa inne under uppsikt.',
          'Gå några steg ute, belöna vid ditt ben. Stanna om det blir drag.',
          'Promenadregel: ca 5 min per levnadsmånad och pass. Fri lek får vara längre.',
        ],
        labbe: 'Sele i stället för halsband skyddar halsen när valpen drar. Undvik långa promenader på asfalt de första månaderna.',
        checklist: [
          { id: 'v3-koppel-1', text: 'Selen är okej' },
          { id: 'v3-koppel-2', text: '10 steg med slakt koppel ute' },
        ],
      },
      {
        id: 'v3-social',
        emoji: '🌍',
        title: 'Socialisering och miljö',
        intro: 'Fönstret för socialisering stänger runt 12–16 veckor. Kvalitet slår kvantitet.',
        steps: [
          'Varje dag: något nytt men lagom. Ett nytt underlag, ett nytt ljud, en ny människa.',
          'Valpen får titta på avstånd och ta eget initiativ. Ingen tvingas hälsa.',
          'Bär valpen till stan, torget och busshållplatsen innan vaccinationerna är klara.',
          'Lek med vuxna, vaccinerade och snälla hundar. Undvik hundrastgårdar tills valpen är fullvaccinerad.',
          'Låt ljud på låg volym spela hemma: åska, fyrverkerier, dammsugare.',
        ],
        labbe: 'Labbar älskar ofta alla – lär valpen även att det är okej att INTE hälsa på varje hund och människa. Annars får du en hund som drar mot alla.',
        checklist: [
          { id: 'v3-social-1', text: '10 olika underlag' },
          { id: 'v3-social-2', text: '10 olika sorters människor' },
          { id: 'v3-social-3', text: 'Bilresa utan oro' },
          { id: 'v3-social-4', text: 'Stadsmiljö på avstånd' },
        ],
      },
      {
        id: 'v3-veterinar',
        emoji: '💉',
        title: 'Veterinär och vaccin',
        intro: 'Följ uppfödarens och veterinärens schema. Vanligt i Sverige:',
        steps: [
          'Vaccination vid 8 veckor (oftast hos uppfödaren) och ytterligare vid ca 12 veckor.',
          'Ofta en till runt 16 veckor, beroende på vaccin.',
          'Avmaskning enligt uppfödarens rekommendation.',
          'Registrera ägarbytet i Jordbruksverkets hundregister och teckna försäkring.',
          'Gör ett "trevligt besök" på kliniken bara för att få godis och gå hem igen.',
        ],
        checklist: [
          { id: 'v3-vet-1', text: 'Andra vaccinationen klar' },
          { id: 'v3-vet-2', text: 'Ägarbyte registrerat' },
          { id: 'v3-vet-3', text: 'Försäkring tecknad' },
        ],
      },
    ],
  },
  {
    id: 'm3',
    label: 'Månad 3–6',
    age: '3–6 månader',
    summary: 'Grundlydnad, passivitet, valpkurs och tandbyte.',
    topics: [
      {
        id: 'm3-lydnad',
        emoji: '🎓',
        title: 'Grundlydnad',
        intro: 'Nu kan valpen jobba lite längre. Korta pass, 3–5 minuter, flera gånger om dagen.',
        steps: [
          'Sitt, ligg och stanna kvar några sekunder. Släpp med "varsågod".',
          'Inkallning i långlina – alltid fest när valpen kommer.',
          'Skvaller: valpen lämnar tappad mat och tittar på dig.',
          'Gå en valpkurs – bra för både miljö och kunskap. Se Träning för detaljerade övningar.',
        ],
        checklist: [
          { id: 'm3-lydnad-1', text: 'Sitt och ligg på signal' },
          { id: 'm3-lydnad-2', text: 'Inkallning på visselpipa i långlina' },
          { id: 'm3-lydnad-3', text: 'Valpkurs påbörjad' },
        ],
      },
      {
        id: 'm3-passiv',
        emoji: '🧘',
        title: 'Passivitet och vardagslugn',
        intro: 'Att kunna göra ingenting är den viktigaste färdigheten för en labbe.',
        steps: [
          'Filten: belöna när valpen ligger avslappnat på filten.',
          'Ta filten till caféet – börja med 5 minuter.',
          'Låt valpen ligga på filten när senioren tränar.',
        ],
        checklist: [
          { id: 'm3-passiv-1', text: '5 min på filten hemma' },
          { id: 'm3-passiv-2', text: 'Första cafébesöket' },
        ],
      },
      {
        id: 'm3-tander',
        emoji: '🦴',
        title: 'Tandbyte',
        intro: 'Mellan ca 4 och 6 månader byter valpen tänder. Det kan klia och göra ont.',
        steps: [
          'Ge kalla saker att tugga: blöt, frusen handduk eller fryst Kong.',
          'Titta i munnen varje vecka – sitter en mjölktand kvar bredvid den nya, prata med veterinären.',
          'Räkna med mer tuggande och bitande en period.',
        ],
        checklist: [{ id: 'm3-tander-1', text: 'Tandbytet klart' }],
      },
      {
        id: 'm3-leder',
        emoji: '🦵',
        title: 'Skona lederna',
        intro: 'Labradorer är en av raserna där höft- och armbågsledsdysplasi förekommer. Rätt belastning minskar risken.',
        steps: [
          'Inga hopp ur bilen, inga trappor i fart, ingen jogging med valpen.',
          'Fri lek i varierad terräng är bättre än långa promenader på asfalt.',
          'Simning och balansträning är bra – i lugn takt.',
          'HD/ED-röntgen görs tidigast vid 12 månader. Prata med uppfödaren.',
        ],
        checklist: [
          { id: 'm3-leder-1', text: 'Bilramp eller lyft in i bilen' },
          { id: 'm3-leder-2', text: 'Vikten kollad – revbenen går att känna' },
        ],
      },
    ],
  },
];

export const ALL_GUIDE_ITEMS = PUPPY_PHASES.flatMap((p) => p.topics.flatMap((t) => t.checklist));

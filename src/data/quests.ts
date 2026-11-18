import type { Quest } from '../types';

export const QUESTS: Quest[] = [
  // Båda / alla
  { id: 'q-grill', title: 'Grilla i skogen med hunden', description: 'Packa korv, termos och en filt. Öva passivitet vid elden medan korven grillas – och skvaller när något trillar ner!', for: ['both', 'senior', 'puppy'], xp: 60, minutes: 90, category: 'natur', photoPrompt: 'Fånga hundarna vid elden 🔥' },
  { id: 'q-bankar', title: 'Besök 4 bänkar på promenaden', description: 'Vid varje bänk: sitt-stanna i 30 sek medan du sätter dig. Ta en bild vid den finaste.', for: ['both', 'senior', 'puppy'], xp: 40, minutes: 45, category: 'stad', photoPrompt: 'Bild vid den finaste bänken' },
  { id: 'q-tallar', title: 'Göm 3 godbitar i barken på tallar', description: 'Gömmor i skrovlig tallbark på nos- och bröst-höjd. Säg ”sök” och se näsan jobba.', for: ['both', 'senior', 'puppy'], xp: 35, minutes: 20, category: 'hjarna', photoPrompt: 'Nos mot bark – fånga ögonblicket!' },
  { id: 'q-cafe', title: '3 minuters stanna-kvar vid ett café', description: 'Filt under bordet, beställ en kaffe och belöna lugnet var 20:e sekund. Öka till var 40:e.', for: ['both', 'puppy', 'senior'], xp: 45, minutes: 30, category: 'stad', photoPrompt: 'Kaffe + lugn hund = bild!' },
  { id: 'q-tandem', title: 'Tandem-promenad: 1 km slakt koppel', description: 'Båda hundarna, en på var sida. Belöna båda när koppeln hänger. Byt sida halvvägs.', for: ['both'], xp: 70, minutes: 30, category: 'natur', photoPrompt: 'Selfie med båda kopplen slaka' },
  { id: 'q-turordning', title: 'Turordnings-utmaningen', description: 'Hundarna sitter bredvid varandra. Säg namn – endast den du nämner får komma. 5 rundor var.', for: ['both'], xp: 55, minutes: 10, category: 'hjarna', photoPrompt: 'Båda i sitt – sida vid sida' },
  { id: 'q-picknick', title: 'Picknick-passivitet', description: 'Duka upp på en filt i parken. Hundarna ligger på var sin filt medan ni äter. Belöna lugn.', for: ['both', 'puppy'], xp: 60, minutes: 45, category: 'mys', photoPrompt: 'Picknick med två lugna labbar' },
  { id: 'q-dubbelapport', title: 'Dubbel-apport vid vattnet', description: 'En hund väntar, den andra hämtar dummyn. Byt. Senior simmar, valpen plaskar i strandkanten.', for: ['both'], xp: 70, minutes: 40, category: 'vatten', photoPrompt: 'Blöta labbar i motljus 💦' },

  // Senior
  { id: 'q-sniffari', title: 'Sniffari – 30 min fri nos', description: 'Långlina och ingen agenda. Låt senioren bestämma vägen och nosa så länge hen vill.', for: ['senior'], xp: 35, minutes: 30, category: 'natur', photoPrompt: 'Nos i mossan 🌿' },
  { id: 'q-simtur', title: 'Skonsam simtur', description: '3 korta simpass à 2 min med vila emellan. Avsluta med handduk och massage.', for: ['senior'], xp: 50, minutes: 30, category: 'vatten', photoPrompt: 'Simmande senior' },
  { id: 'q-kartong', title: 'Kartong-julafton', description: 'Linda in godis i tidningspapper i 5 kartonger. Senioren får öppna sina ”paket”.', for: ['senior', 'puppy'], xp: 30, minutes: 15, category: 'hjarna', photoPrompt: 'Paketöppning!' },
  { id: 'q-massage', title: 'Spa-kväll för senioren', description: '10 min massage, tassvård och klokontroll. Belöna lugnet. Avsluta med frusen Kong.', for: ['senior'], xp: 30, minutes: 20, category: 'mys', photoPrompt: 'Avslappnad spa-hund' },
  { id: 'q-nyvag', title: 'Ny promenadväg', description: 'Gå en helt ny väg – nya dofter är hjärngympa. Max 3 km och mjukt underlag.', for: ['senior', 'both'], xp: 40, minutes: 45, category: 'natur', photoPrompt: 'Ny utsikt' },

  // Valp
  { id: 'q-5ytor', title: 'Gå på 5 nya underlag', description: 'Galler, sand, gungande brygga, plåt, blött gräs. Belöna nyfikenhet, tvinga aldrig.', for: ['puppy'], xp: 45, minutes: 30, category: 'stad', photoPrompt: 'Tassar på konstigt underlag' },
  { id: 'q-buss', title: 'Åk buss en hållplats', description: 'Sitt på golvet vid dina fötter. Godis när bussen bromsar. Kliv av och fira.', for: ['puppy'], xp: 60, minutes: 30, category: 'stad', photoPrompt: 'Valp på bussresa' },
  { id: 'q-10manniskor', title: 'Möt 10 olika människor', description: 'Hatt, rullator, barnvagn, skägg, cykelhjälm... Valpen tittar, du belönar. Ingen hälsning krävs.', for: ['puppy'], xp: 50, minutes: 40, category: 'stad', photoPrompt: 'Valp som tittar ut över torget' },
  { id: 'q-ljud', title: 'Ljudsafari', description: 'Sitt vid en byggarbetsplats eller tågstation på avstånd. Belöna att valpen hör och slappnar av.', for: ['puppy'], xp: 45, minutes: 20, category: 'stad', photoPrompt: 'Lugn valp i stadsbrus' },
  { id: 'q-plask', title: 'Första plasket', description: 'Grund, långgrund strand. Kasta en flytande leksak 1 m ut. Låt valpen välja själv.', for: ['puppy'], xp: 50, minutes: 20, category: 'vatten', photoPrompt: 'Första plasket 💧' },
  { id: 'q-kloss', title: 'Klätterklossen', description: 'Hitta en låg stubbe eller sten. Belöna fyra tassar upp, fyra tassar ner – lugnt.', for: ['puppy', 'senior'], xp: 30, minutes: 15, category: 'lek', photoPrompt: 'Kung/drottning av stubben' },
  { id: 'q-lekfest', title: 'Lekdejt med en vuxen hund', description: '15 min lek med en stabil, snäll vuxen hund. Avbryt med inkallning var 3:e minut.', for: ['puppy'], xp: 45, minutes: 20, category: 'lek', photoPrompt: 'Lekkompisar' },
];

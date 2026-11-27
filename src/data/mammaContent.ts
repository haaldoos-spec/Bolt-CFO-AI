import type { DogId } from '../types';

export type MammaKind = 'promenad' | 'lek' | 'traning';

export interface MammaItem {
  id: string;
  kind: MammaKind;
  title: string;
  /** Vad är det? (en mening) */
  what: string;
  /** Hur gör man? Korta steg. */
  how: string[];
  /** När passar det? */
  when: string;
  minutes: number;
  dogs: DogId[];
}

export const MAMMA_KINDS: { id: MammaKind; label: string }[] = [
  { id: 'promenad', label: 'Promenad' },
  { id: 'lek', label: 'Lek' },
  { id: 'traning', label: 'Träning' },
];

export const MAMMA_ITEMS: MammaItem[] = [
  // ───── PÅ PROMENADEN ─────
  {
    id: 'm-sniffa', kind: 'promenad', title: 'Sniffpromenad',
    what: 'Hunden får bestämma takten och nosa så mycket den vill. Nosen är hundens sätt att läsa tidningen.',
    how: ['Gå en lugn runda i hundens tempo.', 'Stanna när hunden nosar – dra inte i kopplet.', 'Räkna inte kilometer. Nöjd hund är målet.'],
    when: 'Varje dag. Särskilt bra på dagar när du inte orkar mycket.', minutes: 20, dogs: ['senior', 'puppy'],
  },
  {
    id: 'm-bank', kind: 'promenad', title: 'Bänkpaus',
    what: 'Ta en paus på en bänk. Hunden lär sig att vila och vara lugn ute.',
    how: ['Sätt dig på en bänk med hunden bredvid.', 'Säg ”ligg” och peka på marken.', 'Ge en liten godbit när hunden ligger lugnt. Sitt kvar någon minut.'],
    when: 'Mitt i promenaden, när hunden är lite varm och glad.', minutes: 5, dogs: ['senior', 'puppy'],
  },
  {
    id: 'm-ny-vag', kind: 'promenad', title: 'Ny väg, nya dofter',
    what: 'Välj en annan väg än vanligt. Nya dofter är som en bok till hunden.',
    how: ['Gå en väg ni inte gått förut, helst en kort.', 'Låt hunden titta och nosa.', 'Prata lugnt och berömma när hunden går fint bredvid dig.'],
    when: 'En gång i veckan, när vädret är fint.', minutes: 30, dogs: ['senior', 'puppy'],
  },
  {
    id: 'm-valp-kort', kind: 'promenad', title: 'Kort valprunda',
    what: 'Valpar blir fort trötta. Hellre kort och fin än lång och jobbig.',
    how: ['Gå max 10–15 minuter åt gången.', 'Vänd om innan valpen blir trött.', 'Låt valpen titta på bilar och människor på lite avstånd, och ge en godbit när den är lugn.'],
    when: 'Flera gånger om dagen, inte en lång runda.', minutes: 15, dogs: ['puppy'],
  },

  // ───── LEKAR ─────
  {
    id: 'm-goma', kind: 'lek', title: 'Hitta godiset',
    what: 'Du gömmer godbitar och hunden letar. Tröttar ut hjärnan på riktigt.',
    how: ['Be hunden sitta kvar (eller håll i den).', 'Göm 3–5 godbitar i gräset eller bakom en sten.', 'Säg ”sök!” och låt hunden leta. Beröm när den hittar.'],
    when: 'På promenaden vid en gräsplätt, eller inomhus när det regnar.', minutes: 10, dogs: ['senior', 'puppy'],
  },
  {
    id: 'm-vilken-hand', kind: 'lek', title: 'Vilken hand?',
    what: 'En enkel gissningslek med godis i handen. Funkar var du än är.',
    how: ['Ha en godbit i ena handen och stäng båda nävarna.', 'Låt hunden nosa. När den nosar på rätt hand: öppna och ge godbiten.', 'Gör det 5–6 gånger.'],
    when: 'Vid bänkpausen eller hemma i soffan.', minutes: 5, dogs: ['senior', 'puppy'],
  },
  {
    id: 'm-drag', kind: 'lek', title: 'Dra-leken',
    what: 'Lugn dragkamp med en rep- eller tygleksak. Valpen älskar det.',
    how: ['Låt hunden ta leksaken och dra försiktigt.', 'Låt hunden ”vinna” ibland.', 'Sluta leken med att säga ”tack” och byt mot en godbit.'],
    when: 'När valpen är pigg. Håll det kort och lugnt för Zeppelin.', minutes: 5, dogs: ['puppy'],
  },
  {
    id: 'm-hitta-dig', kind: 'lek', title: 'Var är jag?',
    what: 'Du gömmer dig och hunden hittar dig. Bra för att hunden ska vilja stanna nära dig.',
    how: ['Ta ett par steg bakom ett träd eller en buske medan hunden tittar på något annat.', 'Säg hundens namn en gång.', 'När hunden kommer: mycket beröm och en godbit.'],
    when: 'På en lugn plats där hunden kan gå lös eller i lång lina.', minutes: 10, dogs: ['senior', 'puppy'],
  },

  // ───── LÄTT TRÄNING ─────
  {
    id: 'm-sitt', kind: 'traning', title: 'Sitt',
    what: 'Hunden sätter sig på ditt kommando. Den första och viktigaste övningen.',
    how: ['Håll en godbit vid hundens nos.', 'Lyft den sakta över huvudet – rumpan går ner av sig själv.', 'Säg ”bra!” och ge godbiten direkt. Upprepa 5 gånger.'],
    when: 'Hemma eller ute, före en måltid eller dörr. Max 3 minuter.', minutes: 3, dogs: ['senior', 'puppy'],
  },
  {
    id: 'm-vanta', kind: 'traning', title: 'Vänta',
    what: 'Hunden stannar kvar tills du säger till. Bra vid dörrar och vägar.',
    how: ['Be hunden sitta.', 'Säg ”vänta” och visa handflatan. Räkna till 3.', 'Säg ”varsågod” och ge en godbit. Öka tiden lite i taget.'],
    when: 'Vid ytterdörren eller innan matskålen ställs ner.', minutes: 3, dogs: ['senior', 'puppy'],
  },
  {
    id: 'm-hit', kind: 'traning', title: 'Hit (inkallning)',
    what: 'Hunden kommer när du ropar. Gör det till det roligaste som finns.',
    how: ['Stå nära hunden. Säg ”hit!” med glad röst.', 'När hunden kommer: stor beröm och 2–3 godbitar.', 'Öka avståndet lite i taget. Ropa aldrig ”hit” när något tråkigt ska hända.'],
    when: 'Hemma i trädgården eller i lång lina ute.', minutes: 5, dogs: ['senior', 'puppy'],
  },
  {
    id: 'm-lugn-kopp', kind: 'traning', title: 'Slakt koppel',
    what: 'Hunden går bredvid dig utan att dra.',
    how: ['Stå still när kopplet blir spänt och vänta tills det blir slakt.', 'Gå vidare när kopplet hänger. Ge en godbit vid ditt ben.', 'Gör det i korta stunder, inte hela promenaden.'],
    when: 'De första minuterna av promenaden.', minutes: 5, dogs: ['senior', 'puppy'],
  },
];

/** Ett förslag per dag och hund – samma hela dagen, utan slump som ändras. */
export function dailyPick(dog: DogId, date = new Date()): MammaItem {
  const pool = MAMMA_ITEMS.filter((i) => i.dogs.includes(dog));
  const day = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86_400_000);
  return pool[(day + (dog === 'puppy' ? 3 : 0)) % pool.length];
}

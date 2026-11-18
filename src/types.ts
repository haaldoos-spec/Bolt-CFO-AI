export type DogId = 'senior' | 'puppy';
export type ProfileId = DogId | 'both';
export type TabId = 'home' | 'map' | 'training' | 'profile';

export type DisciplineId = 'vardag' | 'rally' | 'spar' | 'sok' | 'agility' | 'tricks';
export type ExerciseLevel = 'byggsten' | 'kedja' | 'program';

export type EquipmentId =
  | 'klicker' | 'godis' | 'sparlina' | 'koner' | 'bock' | 'sele' | 'koppel' | 'langlina'
  | 'filt' | 'skyltar' | 'nosework' | 'tunnel' | 'hinder' | 'balans' | 'leksak' | 'apport'
  | 'targetplatta' | 'flytvast' | 'pall' | 'visselpipa' | 'pinne' | 'matta';

export interface Equipment {
  id: EquipmentId;
  name: string;
}

export interface Exercise {
  id: string;
  discipline: DisciplineId;
  level: ExerciseLevel;
  title: string;
  summary: string;
  /** Vilka hundar övningen passar för */
  suits: DogId[];
  minutes: number;
  /** 1 = skonsam, 3 = intensiv */
  intensity: 1 | 2 | 3;
  equipment: EquipmentId[];
  steps: [string, string, string];
  criteria: string[];
  labbeHack?: { senior?: string; puppy?: string; general?: string };
  /** För kedjor/program: vilka byggstenar som ingår */
  builtFrom?: string[];
  pairTip?: string;
}

export interface Discipline {
  id: DisciplineId;
  name: string;
  tagline: string;
  goalLabel: string;
  icon: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  for: ProfileId[];
  xp: number;
  minutes: number;
  category: 'natur' | 'stad' | 'hjarna' | 'lek' | 'vatten' | 'mys';
  photoPrompt: string;
}

export type PlaceCategory = 'skog' | 'balans' | 'cafe' | 'vatten';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  description: string;
  goodFor: string[];
  seniorFriendly: boolean;
  puppyFriendly: boolean;
  /** Egen markerad favoritplats */
  custom?: boolean;
  createdAt?: string;
}

export interface CheckIn {
  id: string;
  placeId?: string;
  placeName: string;
  lat: number;
  lng: number;
  date: string; // ISO
  dogs: DogId[];
  note: string;
  photo?: string; // dataURL
  questTitle?: string;
}

export interface SessionRecord {
  id: string;
  date: string; // ISO
  dogs: DogId[];
  discipline: DisciplineId | 'mix';
  minutes: number;
  intensity: 1 | 2 | 3;
  ratings: Partial<Record<DogId, number>>;
  note?: string;
  title: string;
}

export interface DogInfo {
  id: DogId;
  name: string;
  breedLabel: string;
  ageLabel: string;
  birth: string;
  avatar: string; // url eller dataURL
  /** true när ägaren laddat upp en egen bild i appen */
  customAvatar?: boolean;
  weightKg: number;
}

export interface AppState {
  dogs: Record<DogId, DogInfo>;
  xp: Record<DogId, number>;
  completed: Record<DogId, string[]>; // exercise-id:n
  sessions: SessionRecord[];
  checkins: CheckIn[];
  myPlaces: Place[];
  /** Avbockade punkter i guiden Första tiden med valpen */
  puppyGuide: string[];
  questsDone: { id: string; questId: string; date: string; profile: ProfileId }[];
}

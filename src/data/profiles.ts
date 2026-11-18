import type { DogId, DogInfo, ProfileId } from '../types';

export interface ThemeDef {
  a1: string;
  a2: string;
  bg: string;
  ink: string; // textfärg på accentknappar
  blobs: [string, string, string];
}

export const THEMES: Record<ProfileId, ThemeDef> = {
  senior: {
    a1: '#93c5fd',
    a2: '#a78bfa',
    bg: '#0a0c1a',
    ink: '#0b1024',
    blobs: ['#3b5bdb', '#7c3aed', '#38bdf8'],
  },
  puppy: {
    a1: '#fcd34d',
    a2: '#fdba8c',
    bg: '#16110a',
    ink: '#2a1a05',
    blobs: ['#f59e0b', '#fb923c', '#fde68a'],
  },
  both: {
    a1: '#a78bfa',
    a2: '#fcd34d',
    bg: '#110e1c',
    ink: '#1a1030',
    blobs: ['#7c3aed', '#f59e0b', '#60a5fa'],
  },
};

export const PROFILE_META: Record<ProfileId, { label: string; short: string; focus: string[] }> = {
  senior: {
    label: 'Svart Senior',
    short: 'Senior',
    focus: ['Nosarbete', 'Ledvänlig rörlighet', 'Simning & friskvård', 'Hjärngympa'],
  },
  puppy: {
    label: 'Gul Valp',
    short: 'Valp',
    focus: ['Grundlydnad', 'Socialisering', 'Miljöträning', 'Passivitet', 'Valpagility'],
  },
  both: {
    label: 'Båda hundarna',
    short: 'Båda',
    focus: ['Par-övningar', 'Passivitet medan den andra jobbar', 'Tandem-promenader', 'Gemensamma äventyr'],
  },
};

/**
 * Byt ut avatarerna genom att lägga dina egna 3D-bilder i /public/avatars
 * (t.ex. senior.png & puppy.png) och ändra sökvägen här – eller ladda upp
 * direkt i appen under Profil & Statistik.
 */
export const DEFAULT_DOGS: Record<DogId, DogInfo> = {
  senior: {
    id: 'senior',
    name: 'Svart Senior',
    breedLabel: 'Svart labrador',
    ageLabel: '9 år',
    birth: '2017-09-02',
    avatar: '/avatars/senior.svg',
    weightKg: 32,
  },
  puppy: {
    id: 'puppy',
    name: 'Gul Valp',
    breedLabel: 'Gul labrador',
    ageLabel: '5 mån',
    birth: '2026-06-10',
    avatar: '/avatars/puppy.svg',
    weightKg: 17,
  },
};

export const dogsOf = (p: ProfileId): DogId[] => (p === 'both' ? ['senior', 'puppy'] : [p]);

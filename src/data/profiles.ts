import type { DogId, DogInfo, ProfileId } from '../types';
import seniorAvatar from '../assets/senior.jpg';
import puppyAvatar from '../assets/puppy.jpg';

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
 * Avatarerna ligger i src/assets (senior.jpg & puppy.jpg). Byt filerna för nya
 * standardbilder – eller ladda upp direkt i appen under Profil & Statistik.
 */
export const DEFAULT_DOGS: Record<DogId, DogInfo> = {
  senior: {
    id: 'senior',
    name: 'Zeppelin',
    breedLabel: 'Svart labrador',
    ageLabel: '9 år',
    birth: '2017-09-02',
    avatar: seniorAvatar,
    weightKg: 32,
  },
  puppy: {
    id: 'puppy',
    name: 'Kyle',
    breedLabel: 'Gul labrador',
    ageLabel: '8 veckor den 14 december 2026',
    birth: '2026-10-19',
    avatar: puppyAvatar,
    weightKg: 3,
  },
};

/** Ålder räknat från födelsedagen: veckor för valpar, månader under 2 år, sedan år */
export const ageText = (birth: string, at: Date = new Date()) => {
  const days = Math.floor((+at - +new Date(birth)) / 864e5);
  if (days < 7 * 16) return `${Math.max(0, Math.floor(days / 7))} veckor`;
  const months = Math.floor(days / 30.44);
  if (months < 24) return `${months} mån`;
  return `${Math.floor(days / 365.25)} år`;
};

/** Valpen flyttar hem vid 8 veckors ålder. Returnerar antal dagar kvar (0 = hemma). */
export const daysUntilHome = (birth: string, at: Date = new Date()) => {
  const home = new Date(birth);
  home.setDate(home.getDate() + 56);
  return Math.max(0, Math.ceil((+home - +at) / 864e5));
};

export const homeDateText = (birth: string) => {
  const home = new Date(birth);
  home.setDate(home.getDate() + 56);
  return home.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' });
};

export const OLD_DEFAULT_NAMES: Record<DogId, string> = { senior: 'Svart Senior', puppy: 'Gul Valp' };

export const dogsOf = (p: ProfileId): DogId[] => (p === 'both' ? ['senior', 'puppy'] : [p]);

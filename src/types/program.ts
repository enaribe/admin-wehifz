/**
 * Types pour les programmes de mémorisation pré-générés
 * Copie de src/types/program.ts pour l'admin web
 */

// ============================================
// Types de base
// ============================================

export interface DayProgram {
  day: number;
  verses: string[];               // Format: "surah:verse" (ex: "78:1")
  surahNumber?: number;           // Pour Juz: quelle sourate ce jour
  surahName?: string;             // Pour affichage
  versesCount?: number;           // Nombre de versets ce jour
  estimatedLines?: number;        // Lignes estimées
  isMultiDay?: boolean;           // Verset long sur plusieurs jours
  multiDayPart?: number;          // Partie X
  multiDayTotal?: number;         // sur Y jours
}

export interface LevelProgram {
  totalDays: number;
  linesPerDay: number;            // ~4, ~8, ou ~15
  averageVersesPerDay?: number;
  dailyProgram: DayProgram[];
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProgramType = 'surah' | 'juz';

// ============================================
// Programme de Sourate
// ============================================

export interface SurahProgram {
  id: string;                     // "surah_67"
  type: 'surah';
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  totalVerses: number;
  startPage: number;
  endPage: number;
  juz?: number;                   // Numéro du Juz principal
  revelationType: 'meccan' | 'medinan';
  levels: {
    beginner: LevelProgram;
    intermediate: LevelProgram;
    advanced: LevelProgram;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Programme de Juz
// ============================================

export interface SurahSummary {
  number: number;
  name: string;
  nameArabic: string;
  versesCount: number;
  startVerse?: number;
  endVerse?: number;
}

export interface JuzProgram {
  id: string;                     // "juz_30"
  type: 'juz';
  juzNumber: number;
  juzName: string;                // "Juz Amma"
  juzNameArabic: string;          // "جزء عمّ"
  surahs: SurahSummary[];         // Liste des sourates incluses
  totalSurahs: number;
  totalVerses: number;
  startPage: number;
  endPage: number;
  levels: {
    beginner: LevelProgram;
    intermediate: LevelProgram;
    advanced: LevelProgram;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Union Type
// ============================================

export type Program = SurahProgram | JuzProgram;

// ============================================
// Configuration des niveaux
// ============================================

export const DIFFICULTY_CONFIG = {
  beginner: {
    key: 'beginner',
    label: 'Débutant',
    labelAr: 'مبتدئ',
    linesPerDay: 4,
    pagesPerDay: 0.25,
    description: '~1/4 page par jour',
    color: '#4CAF50',
  },
  intermediate: {
    key: 'intermediate',
    label: 'Intermédiaire',
    labelAr: 'متوسط',
    linesPerDay: 8,
    pagesPerDay: 0.5,
    description: '~1/2 page par jour',
    color: '#FF9800',
  },
  advanced: {
    key: 'advanced',
    label: 'Avancé',
    labelAr: 'متقدم',
    linesPerDay: 15,
    pagesPerDay: 1,
    description: '~1 page par jour',
    color: '#F44336',
  },
} as const;

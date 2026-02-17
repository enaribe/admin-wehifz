'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Layers,
  Check,
  Calendar,
  Clock,
  Users,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

// Types
interface LevelInfo {
  totalDays: number;
  linesPerDay: number;
}

interface SurahProgram {
  id: string;
  type: 'surah';
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  totalVerses: number;
  startPage: number;
  endPage: number;
  levels: {
    beginner: LevelInfo;
    intermediate: LevelInfo;
    advanced: LevelInfo;
  };
}

interface JuzProgram {
  id: string;
  type: 'juz';
  juzNumber: number;
  juzName: string;
  juzNameArabic: string;
  totalVerses: number;
  totalSurahs: number;
  startPage: number;
  endPage: number;
  levels: {
    beginner: LevelInfo;
    intermediate: LevelInfo;
    advanced: LevelInfo;
  };
}

type Program = SurahProgram | JuzProgram;
type ProgramType = 'surah' | 'juz';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const DIFFICULTY_CONFIG = {
  beginner: {
    label: 'Débutant',
    description: '~1/4 page par jour',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-700',
  },
  intermediate: {
    label: 'Intermédiaire',
    description: '~1/2 page par jour',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-700',
  },
  advanced: {
    label: 'Avancé',
    description: '~1 page par jour',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-700',
  },
};

export default function NewChallengePage() {
  const router = useRouter();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Programs data
  const [surahPrograms, setSurahPrograms] = useState<SurahProgram[]>([]);
  const [juzPrograms, setJuzPrograms] = useState<JuzProgram[]>([]);

  // Form state
  const [step, setStep] = useState(1);
  const [programType, setProgramType] = useState<ProgramType | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [startDate, setStartDate] = useState('');
  const [title, setTitle] = useState('');

  // Fetch programs on mount
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch('/api/programs');
        if (!res.ok) throw new Error('Erreur lors du chargement');
        const data = await res.json();
        setSurahPrograms(data.surahs || []);
        setJuzPrograms(data.juz || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrograms();

    // Set default start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Auto-generate title when program is selected
  useEffect(() => {
    if (selectedProgram) {
      if (selectedProgram.type === 'surah') {
        setTitle(`Mémorisation ${(selectedProgram as SurahProgram).surahName}`);
      } else {
        setTitle(`Mémorisation ${(selectedProgram as JuzProgram).juzName}`);
      }
    }
  }, [selectedProgram]);

  // Calculate end date
  const endDate = useMemo(() => {
    if (!startDate || !selectedProgram) return '';
    const days = selectedProgram.levels[difficulty].totalDays;
    const end = new Date(startDate);
    end.setDate(end.getDate() + days - 1);
    return end.toISOString().split('T')[0];
  }, [startDate, selectedProgram, difficulty]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedProgram || !startDate) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Fetch full program with daily schedule
      const programRes = await fetch(
        `/api/programs/${selectedProgram.type}/${selectedProgram.id}`
      );
      if (!programRes.ok) throw new Error('Erreur lors du chargement du programme');
      const fullProgram = await programRes.json();

      const dailyProgram = fullProgram.levels[difficulty].dailyProgram;

      // Create challenge
      const challengeData = {
        title,
        programType: selectedProgram.type,
        difficulty,
        startDate,
        endDate,
        dailyProgram,
        totalVerses: selectedProgram.totalVerses,
        duration: selectedProgram.levels[difficulty].totalDays,
        ...(selectedProgram.type === 'surah'
          ? {
              surahNumber: (selectedProgram as SurahProgram).surahNumber,
              surahName: (selectedProgram as SurahProgram).surahName,
              surahNameArabic: (selectedProgram as SurahProgram).surahNameArabic,
            }
          : {
              juzNumber: (selectedProgram as JuzProgram).juzNumber,
              juzName: (selectedProgram as JuzProgram).juzName,
              juzNameArabic: (selectedProgram as JuzProgram).juzNameArabic,
              totalSurahs: (selectedProgram as JuzProgram).totalSurahs,
            }),
      };

      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challengeData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }

      router.push('/dashboard/challenges');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Current programs list based on type
  const currentPrograms = programType === 'surah' ? surahPrograms : juzPrograms;

  if (isLoading) {
    return (
      <div>
        <Header title="Nouveau Challenge" subtitle="Créez un nouveau défi de mémorisation" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Nouveau Challenge"
        subtitle="Créez un nouveau défi de mémorisation"
      />

      <div className="p-6">
        <Link
          href="/dashboard/challenges"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux challenges
        </Link>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="max-w-3xl">
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded ${
                      step > s ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Choose Type */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Type de challenge
              </h3>
              <p className="text-gray-500 mb-6">
                Choisissez le type de programme de mémorisation
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setProgramType('surah');
                    setSelectedProgram(null);
                    setStep(2);
                  }}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <BookOpen className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">Sourate</h4>
                  <p className="text-sm text-gray-500">
                    {surahPrograms.length} sourates disponibles
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Al-Kahf, Ya-Sin, Al-Mulk...
                  </p>
                </button>

                <button
                  onClick={() => {
                    setProgramType('juz');
                    setSelectedProgram(null);
                    setStep(2);
                  }}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <Layers className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">Juz</h4>
                  <p className="text-sm text-gray-500">
                    {juzPrograms.length} juz disponible{juzPrograms.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Juz&apos; Amma (30)
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Choose Program */}
          {step === 2 && programType && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Choisir le programme
                  </h3>
                  <p className="text-gray-500">
                    {programType === 'surah' ? 'Sélectionnez une sourate' : 'Sélectionnez un juz'}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Changer le type
                </button>
              </div>

              <div className="space-y-3">
                {currentPrograms.map((program) => {
                  const isSurah = program.type === 'surah';
                  const name = isSurah
                    ? (program as SurahProgram).surahName
                    : (program as JuzProgram).juzName;
                  const nameArabic = isSurah
                    ? (program as SurahProgram).surahNameArabic
                    : (program as JuzProgram).juzNameArabic;
                  const number = isSurah
                    ? (program as SurahProgram).surahNumber
                    : (program as JuzProgram).juzNumber;

                  return (
                    <button
                      key={program.id}
                      onClick={() => {
                        setSelectedProgram(program);
                        setStep(3);
                      }}
                      className={`w-full p-4 border-2 rounded-xl text-left transition-all flex items-center gap-4 ${
                        selectedProgram?.id === program.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center font-bold">
                        {number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{name}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-gray-600">{nameArabic}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {program.totalVerses} versets • Pages {program.startPage}-{program.endPage}
                          {!isSurah && ` • ${(program as JuzProgram).totalSurahs} sourates`}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-green-600">{program.levels.beginner.totalDays}j</div>
                        <div className="text-yellow-600">{program.levels.intermediate.totalDays}j</div>
                        <div className="text-red-600">{program.levels.advanced.totalDays}j</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {currentPrograms.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Aucun programme disponible
                </div>
              )}
            </div>
          )}

          {/* Step 3: Choose Difficulty */}
          {step === 3 && selectedProgram && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Niveau de difficulté
                  </h3>
                  <p className="text-gray-500">
                    Choisissez le rythme de mémorisation
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Changer le programme
                </button>
              </div>

              {/* Selected program summary */}
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <div className="font-medium text-gray-900">
                  {selectedProgram.type === 'surah'
                    ? (selectedProgram as SurahProgram).surahName
                    : (selectedProgram as JuzProgram).juzName}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedProgram.totalVerses} versets
                </div>
              </div>

              <div className="space-y-3">
                {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((level) => {
                  const config = DIFFICULTY_CONFIG[level];
                  const days = selectedProgram.levels[level].totalDays;

                  return (
                    <button
                      key={level}
                      onClick={() => {
                        setDifficulty(level);
                        setStep(4);
                      }}
                      className={`w-full p-4 border-2 rounded-xl text-left transition-all flex items-center gap-4 ${
                        difficulty === level
                          ? `${config.borderColor} ${config.bgColor}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          level === 'beginner'
                            ? 'bg-green-500'
                            : level === 'intermediate'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{config.label}</div>
                        <div className="text-sm text-gray-500">{config.description}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${config.textColor}`}>{days} jours</div>
                        <div className="text-xs text-gray-400">
                          ~{Math.round(selectedProgram.totalVerses / days)} versets/jour
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Set Date & Confirm */}
          {step === 4 && selectedProgram && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Finaliser le challenge
                    </h3>
                    <p className="text-gray-500">
                      Définissez la date de début et confirmez
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Changer le niveau
                  </button>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du challenge
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                    placeholder="Ex: Mémorisation Al-Kahf"
                  />
                </div>

                {/* Date */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">Résumé du challenge</h4>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {selectedProgram.type === 'surah'
                          ? (selectedProgram as SurahProgram).surahName
                          : (selectedProgram as JuzProgram).juzName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {selectedProgram.totalVerses} versets
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {selectedProgram.levels[difficulty].totalDays} jours ({DIFFICULTY_CONFIG[difficulty].label})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Fin: {formatDate(endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title || !startDate}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  Créer le challenge
                </button>
                <Link
                  href="/dashboard/challenges"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

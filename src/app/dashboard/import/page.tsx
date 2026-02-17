'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Upload, Play, CheckCircle, AlertCircle, Loader2, BookOpen } from 'lucide-react';

const inputStyle = {
  color: '#111111',
  WebkitTextFillColor: '#111111',
} as React.CSSProperties;

interface ImportProgress {
  status: 'idle' | 'importing' | 'success' | 'error';
  currentSurah: number;
  totalSurahs: number;
  versesImported: number;
  message: string;
}

interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  versesCount: number;
}

// Surah data (114 surahs with verse counts)
const SURAHS: SurahInfo[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', versesCount: 7 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', versesCount: 286 },
  { number: 3, name: 'آل عمران', englishName: "Aal-E-Imran", versesCount: 200 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', versesCount: 176 },
  { number: 5, name: 'المائدة', englishName: "Al-Ma'idah", versesCount: 120 },
  // ... abbreviated for brevity, full list would include all 114
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', versesCount: 30 },
  { number: 78, name: 'النبإ', englishName: 'An-Naba', versesCount: 40 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', versesCount: 4 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', versesCount: 5 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', versesCount: 6 },
];

export default function ImportPage() {
  const [progress, setProgress] = useState<ImportProgress>({
    status: 'idle',
    currentSurah: 0,
    totalSurahs: 114,
    versesImported: 0,
    message: '',
  });

  const [selectedSurahs, setSelectedSurahs] = useState<number[]>([]);
  const [importMode, setImportMode] = useState<'all' | 'selected' | 'range'>('all');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(114);
  const [existingVerses, setExistingVerses] = useState(0);

  // Fetch existing verses count
  useEffect(() => {
    fetch('/api/verses/count')
      .then((res) => res.json())
      .then((data) => setExistingVerses(data.count || 0))
      .catch(console.error);
  }, []);

  const handleImport = async () => {
    let surahsToImport: number[] = [];

    if (importMode === 'all') {
      surahsToImport = Array.from({ length: 114 }, (_, i) => i + 1);
    } else if (importMode === 'selected') {
      surahsToImport = selectedSurahs;
    } else if (importMode === 'range') {
      surahsToImport = Array.from(
        { length: rangeEnd - rangeStart + 1 },
        (_, i) => rangeStart + i
      );
    }

    if (surahsToImport.length === 0) {
      setProgress({
        ...progress,
        status: 'error',
        message: 'Veuillez sélectionner au moins une sourate',
      });
      return;
    }

    setProgress({
      status: 'importing',
      currentSurah: 0,
      totalSurahs: surahsToImport.length,
      versesImported: 0,
      message: 'Démarrage de l\'import...',
    });

    try {
      const response = await fetch('/api/verses/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surahs: surahsToImport }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split('\n').filter(Boolean);

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              setProgress((prev) => ({
                ...prev,
                ...data,
              }));
            } catch {
              // Ignore non-JSON lines
            }
          }
        }
      }
    } catch (error: any) {
      setProgress((prev) => ({
        ...prev,
        status: 'error',
        message: error.message || 'Erreur lors de l\'import',
      }));
    }
  };

  const toggleSurah = (num: number) => {
    setSelectedSurahs((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const popularSurahs = [1, 2, 18, 36, 55, 56, 67, 78, 112, 113, 114];

  return (
    <div>
      <Header
        title="Import des Versets"
        subtitle="Importez les versets du Coran depuis l'API Alquran.cloud"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Versets importés</p>
                <p className="text-xl font-bold text-gray-900">
                  {existingVerses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total versets Coran</p>
                <p className="text-xl font-bold text-gray-900">6,236</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Progression</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round((existingVerses / 6236) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Import Options */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Options d&apos;import
            </h3>

            {/* Mode Selection */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="mode"
                  checked={importMode === 'all'}
                  onChange={() => setImportMode('all')}
                  className="w-4 h-4 text-primary-600"
                />
                <div>
                  <p className="font-medium text-gray-900">Tout le Coran</p>
                  <p className="text-sm text-gray-500">
                    114 sourates, 6236 versets
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="mode"
                  checked={importMode === 'range'}
                  onChange={() => setImportMode('range')}
                  className="w-4 h-4 text-primary-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Plage de sourates</p>
                  {importMode === 'range' && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min="1"
                        max="114"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900"
                        style={inputStyle}
                      />
                      <span className="text-gray-500">à</span>
                      <input
                        type="number"
                        min="1"
                        max="114"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900"
                        style={inputStyle}
                      />
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="mode"
                  checked={importMode === 'selected'}
                  onChange={() => setImportMode('selected')}
                  className="w-4 h-4 text-primary-600"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    Sourates spécifiques
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedSurahs.length} sélectionnée(s)
                  </p>
                </div>
              </label>
            </div>

            {/* Popular Surahs Quick Select */}
            {importMode === 'selected' && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Sourates populaires
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSurahs.map((num) => (
                    <button
                      key={num}
                      onClick={() => toggleSurah(num)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSurahs.includes(num)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Import Button */}
            <button
              onClick={handleImport}
              disabled={progress.status === 'importing'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {progress.status === 'importing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Démarrer l&apos;import
                </>
              )}
            </button>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Progression
            </h3>

            {progress.status === 'idle' && (
              <div className="text-center py-12 text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Prêt à importer</p>
                <p className="text-sm">
                  Sélectionnez les sourates et lancez l&apos;import
                </p>
              </div>
            )}

            {progress.status === 'importing' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{progress.message}</span>
                  <span className="font-medium">
                    {progress.currentSurah}/{progress.totalSurahs}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{
                      width: `${(progress.currentSurah / progress.totalSurahs) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {progress.versesImported.toLocaleString()} versets importés
                </p>
              </div>
            )}

            {progress.status === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-medium text-gray-900">
                  Import terminé !
                </p>
                <p className="text-gray-500">
                  {progress.versesImported.toLocaleString()} versets importés
                </p>
              </div>
            )}

            {progress.status === 'error' && (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <p className="text-lg font-medium text-gray-900">Erreur</p>
                <p className="text-red-600">{progress.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

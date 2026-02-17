import { Header } from '@/components/Header';
import { db, COLLECTIONS } from '@/lib/firebase-admin';
import { BookOpen, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

async function getSurahsWithStats() {
  try {
    // Get surahs
    const surahsSnap = await db
      .collection(COLLECTIONS.SURAHS)
      .orderBy('number', 'asc')
      .get();

    const surahs = surahsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get verse counts per surah
    const versesSnap = await db.collection(COLLECTIONS.VERSES).get();
    const verseCounts: Record<number, number> = {};

    versesSnap.docs.forEach((doc) => {
      const data = doc.data();
      const surahNum = data.surahNumber;
      verseCounts[surahNum] = (verseCounts[surahNum] || 0) + 1;
    });

    return surahs.map((surah: any) => ({
      ...surah,
      importedVerses: verseCounts[surah.number] || 0,
    }));
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

// Expected verse counts for each surah
const EXPECTED_VERSES: Record<number, number> = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
  11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
  21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
  31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
  41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
  51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
  61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
  71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
  81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
  91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
  101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
  111: 5, 112: 4, 113: 5, 114: 6,
};

export default async function VersesPage() {
  const surahs = await getSurahsWithStats();

  // Generate missing surahs for display
  const allSurahs = Array.from({ length: 114 }, (_, i) => {
    const num = i + 1;
    const existing = surahs.find((s: any) => s.number === num);
    return existing || {
      number: num,
      name: `Sourate ${num}`,
      englishName: `Surah ${num}`,
      numberOfAyahs: EXPECTED_VERSES[num],
      importedVerses: 0,
    };
  });

  const totalImported = allSurahs.reduce((sum: number, s: any) => sum + s.importedVerses, 0);
  const totalExpected = 6236;

  return (
    <div>
      <Header
        title="Versets du Coran"
        subtitle={`${totalImported.toLocaleString()} / ${totalExpected.toLocaleString()} versets importés`}
      />

      <div className="p-6">
        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Progression de l&apos;import
            </h3>
            <span className="text-sm text-gray-500">
              {Math.round((totalImported / totalExpected) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(totalImported / totalExpected) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{totalImported.toLocaleString()} importés</span>
            <span>{(totalExpected - totalImported).toLocaleString()} restants</span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une sourate..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSurahs.map((surah: any) => {
            const expected = EXPECTED_VERSES[surah.number] || surah.numberOfAyahs;
            const progress = expected > 0 ? (surah.importedVerses / expected) * 100 : 0;
            const isComplete = surah.importedVerses >= expected;

            return (
              <div
                key={surah.number}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isComplete
                          ? 'bg-green-100 text-green-700'
                          : surah.importedVerses > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {surah.number}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {surah.englishName || `Sourate ${surah.number}`}
                      </h4>
                      <p className="text-sm text-gray-500">{surah.name}</p>
                    </div>
                  </div>
                  {isComplete && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {surah.importedVerses}/{expected} versets
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isComplete ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

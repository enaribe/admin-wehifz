/**
 * Script pour uploader les programmes dans Firestore
 * À exécuter depuis le dossier admin: node scripts/upload-programs.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// ============================================
// Configuration Firebase Admin
// ============================================

const serviceAccountPath = path.join(__dirname, '..', '..', 'wehifz-firebase-adminsdk-fbsvc-bb05bbd26b.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Service account file not found:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'wehifz',
});

const db = getFirestore();

// ============================================
// Transformation Functions
// ============================================

function transformDayProgram(source, surahNumber, surahName) {
  const result = {
    day: source.day,
    verses: source.verses,
    versesCount: source.versesCount,
  };

  // Only add surahNumber/surahName for Juz programs (when specified)
  if (surahNumber !== undefined) {
    result.surahNumber = surahNumber;
    result.surahName = surahName;
  }

  return result;
}

function transformLevelProgram(source, linesPerDay, surahNumber, surahName) {
  return {
    totalDays: source.totalDays,
    linesPerDay,
    averageVersesPerDay: source.averageVersesPerDay,
    dailyProgram: source.dailySchedule.map(day =>
      transformDayProgram(day, surahNumber, surahName)
    ),
  };
}

// For surah programs, we don't pass surahNumber/surahName
function transformSurahLevelProgram(source, linesPerDay) {
  return {
    totalDays: source.totalDays,
    linesPerDay,
    averageVersesPerDay: source.averageVersesPerDay,
    dailyProgram: source.dailySchedule.map(day => ({
      day: day.day,
      verses: day.verses,
      versesCount: day.versesCount,
    })),
  };
}

function transformToSurahProgram(source) {
  const now = Timestamp.now();

  return {
    id: `surah_${source.surahNumber}`,
    type: 'surah',
    surahNumber: source.surahNumber,
    surahName: source.surahName,
    surahNameArabic: source.surahNameArabic,
    totalVerses: source.totalVerses,
    startPage: source.startPage,
    endPage: source.endPage,
    juz: source.juz,
    revelationType: 'meccan',
    levels: {
      beginner: transformSurahLevelProgram(source.programs.beginner, 4),
      intermediate: transformSurahLevelProgram(source.programs.intermediate, 8),
      advanced: transformSurahLevelProgram(source.programs.advanced, 15),
    },
    createdAt: now,
    updatedAt: now,
  };
}

function combineToJuzProgram(surahs) {
  const now = Timestamp.now();

  // Sort by surah number
  const sortedSurahs = [...surahs].sort((a, b) => a.surahNumber - b.surahNumber);

  // Calculate totals
  const totalVerses = sortedSurahs.reduce((sum, s) => sum + s.totalVerses, 0);
  const startPage = Math.min(...sortedSurahs.map(s => s.startPage));
  const endPage = Math.max(...sortedSurahs.map(s => s.endPage));

  // Create surah summaries
  const surahSummaries = sortedSurahs.map(s => ({
    number: s.surahNumber,
    name: s.surahName,
    nameArabic: s.surahNameArabic,
    versesCount: s.totalVerses,
  }));

  // Combine daily programs for each level
  function combineDailyPrograms(level) {
    let dayCounter = 1;
    const combined = [];

    for (const surah of sortedSurahs) {
      const levelProgram = surah.programs[level];

      for (const day of levelProgram.dailySchedule) {
        combined.push({
          day: dayCounter,
          verses: day.verses,
          versesCount: day.versesCount,
          surahNumber: surah.surahNumber,
          surahName: surah.surahName,
        });
        dayCounter++;
      }
    }

    return combined;
  }

  const beginnerProgram = combineDailyPrograms('beginner');
  const intermediateProgram = combineDailyPrograms('intermediate');
  const advancedProgram = combineDailyPrograms('advanced');

  return {
    id: 'juz_30',
    type: 'juz',
    juzNumber: 30,
    juzName: "Juz' Amma",
    juzNameArabic: "جزء عمّ",
    surahs: surahSummaries,
    totalSurahs: sortedSurahs.length,
    totalVerses,
    startPage,
    endPage,
    levels: {
      beginner: {
        totalDays: beginnerProgram.length,
        linesPerDay: 4,
        averageVersesPerDay: Math.round(totalVerses / beginnerProgram.length),
        dailyProgram: beginnerProgram,
      },
      intermediate: {
        totalDays: intermediateProgram.length,
        linesPerDay: 8,
        averageVersesPerDay: Math.round(totalVerses / intermediateProgram.length),
        dailyProgram: intermediateProgram,
      },
      advanced: {
        totalDays: advancedProgram.length,
        linesPerDay: 15,
        averageVersesPerDay: Math.round(totalVerses / advancedProgram.length),
        dailyProgram: advancedProgram,
      },
    },
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================
// Upload Functions
// ============================================

async function uploadSurahProgram(program) {
  const docRef = db.collection('programs').doc('surahs').collection('items').doc(program.id);
  await docRef.set(program);
  console.log(`  ✅ Surah ${program.surahNumber}: ${program.surahName}`);
}

async function uploadJuzProgram(program) {
  const docRef = db.collection('programs').doc('juz').collection('items').doc(program.id);
  await docRef.set(program);
  console.log(`  ✅ Juz ${program.juzNumber}: ${program.juzName}`);
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('\n📚 Upload des programmes de mémorisation\n');
  console.log('═'.repeat(50));

  // 1. Read source file
  const sourceFilePath = path.join(__dirname, '..', '..', 'programs', 'ramadan.md');

  if (!fs.existsSync(sourceFilePath)) {
    console.error('❌ Source file not found:', sourceFilePath);
    process.exit(1);
  }

  console.log('\n📖 Lecture du fichier source...');
  const rawData = fs.readFileSync(sourceFilePath, 'utf-8');
  const sourceData = JSON.parse(rawData);

  console.log(`   Trouvé: ${sourceData.totalSourates} sourates`);

  // 2. Separate popular surahs from Juz 30 surahs
  const popularSurahNumbers = [18, 32, 36, 55, 67];
  const popularSurahs = sourceData.sourates.filter(s => popularSurahNumbers.includes(s.surahNumber));

  // All Juz 30 surahs (78-114) for the Juz program
  const allJuz30Surahs = sourceData.sourates.filter(s => s.surahNumber >= 78 && s.surahNumber <= 114);

  console.log(`   Sourates populaires: ${popularSurahs.length}`);
  console.log(`   Sourates Juz 30: ${allJuz30Surahs.length}`);

  // 3. Upload popular surahs
  console.log('\n📤 Upload des sourates populaires...\n');

  for (const surah of popularSurahs) {
    const program = transformToSurahProgram(surah);
    await uploadSurahProgram(program);
  }

  // 4. Create and upload Juz 30 combined program
  console.log('\n📤 Création et upload du programme Juz 30...\n');

  const juz30Program = combineToJuzProgram(allJuz30Surahs);
  await uploadJuzProgram(juz30Program);

  // 5. Summary
  console.log('\n' + '═'.repeat(50));
  console.log('\n✅ Upload terminé!\n');
  console.log('Résumé:');
  console.log(`  • ${popularSurahs.length} sourates individuelles uploadées`);
  console.log(`  • 1 programme Juz 30 créé (${allJuz30Surahs.length} sourates combinées)`);
  console.log(`  • Juz 30: ${juz30Program.levels.beginner.totalDays} jours (débutant)`);
  console.log(`  • Juz 30: ${juz30Program.levels.intermediate.totalDays} jours (intermédiaire)`);
  console.log(`  • Juz 30: ${juz30Program.levels.advanced.totalDays} jours (avancé)`);
  console.log('\n');
}

main().catch(console.error);

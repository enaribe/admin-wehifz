import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Fetch surah programs
    const surahsSnapshot = await db
      .collection('programs/surahs/items')
      .orderBy('surahNumber', 'asc')
      .get();

    const surahs = surahsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: 'surah',
        surahNumber: data.surahNumber,
        surahName: data.surahName,
        surahNameArabic: data.surahNameArabic,
        totalVerses: data.totalVerses,
        startPage: data.startPage,
        endPage: data.endPage,
        juz: data.juz,
        levels: {
          beginner: {
            totalDays: data.levels.beginner.totalDays,
            linesPerDay: data.levels.beginner.linesPerDay,
          },
          intermediate: {
            totalDays: data.levels.intermediate.totalDays,
            linesPerDay: data.levels.intermediate.linesPerDay,
          },
          advanced: {
            totalDays: data.levels.advanced.totalDays,
            linesPerDay: data.levels.advanced.linesPerDay,
          },
        },
      };
    });

    // Fetch juz programs
    const juzSnapshot = await db
      .collection('programs/juz/items')
      .orderBy('juzNumber', 'asc')
      .get();

    const juz = juzSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: 'juz',
        juzNumber: data.juzNumber,
        juzName: data.juzName,
        juzNameArabic: data.juzNameArabic,
        totalVerses: data.totalVerses,
        totalSurahs: data.totalSurahs,
        startPage: data.startPage,
        endPage: data.endPage,
        surahs: data.surahs,
        levels: {
          beginner: {
            totalDays: data.levels.beginner.totalDays,
            linesPerDay: data.levels.beginner.linesPerDay,
          },
          intermediate: {
            totalDays: data.levels.intermediate.totalDays,
            linesPerDay: data.levels.intermediate.linesPerDay,
          },
          advanced: {
            totalDays: data.levels.advanced.totalDays,
            linesPerDay: data.levels.advanced.linesPerDay,
          },
        },
      };
    });

    return NextResponse.json({
      surahs,
      juz,
      total: surahs.length + juz.length,
    });
  } catch (error: any) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

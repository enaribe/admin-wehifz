import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db
      .collection(COLLECTIONS.CHALLENGES)
      .orderBy('createdAt', 'desc')
      .get();

    const challenges = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate?.()?.toISOString() || data.startDate,
        endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    });

    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des challenges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      difficulty,
      startDate,
      endDate,
      programType,
      // Surah-specific fields
      surahNumber,
      surahName,
      surahNameArabic,
      startVerse,
      endVerse,
      // Juz-specific fields
      juzNumber,
      juzName,
      juzNameArabic,
      surahs,
      totalSurahs,
      // Common fields
      dailyProgram,
      totalVerses,
      duration,
      startPage,
      endPage,
      juz,
    } = body;

    // Validation
    if (!title || !startDate || !endDate || !dailyProgram || !programType) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (title, startDate, endDate, dailyProgram, programType)' },
        { status: 400 }
      );
    }

    // Validate programType-specific fields
    if (programType === 'surah' && !surahNumber) {
      return NextResponse.json(
        { error: 'surahNumber est requis pour un challenge de type surah' },
        { status: 400 }
      );
    }

    if (programType === 'juz' && !juzNumber) {
      return NextResponse.json(
        { error: 'juzNumber est requis pour un challenge de type juz' },
        { status: 400 }
      );
    }

    // Determine status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
    if (now >= start && now <= end) {
      status = 'active';
    } else if (now > end) {
      status = 'completed';
    }

    // Build challenge document based on type
    const challengeData: Record<string, unknown> = {
      title,
      description: description || '',
      difficulty,
      startDate: start,
      endDate: end,
      programType,
      dailyProgram,
      totalVerses,
      duration,
      status,
      participantsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add optional common fields
    if (startPage !== undefined) challengeData.startPage = startPage;
    if (endPage !== undefined) challengeData.endPage = endPage;

    // Add type-specific fields
    if (programType === 'surah') {
      challengeData.surahNumber = surahNumber;
      if (surahName) challengeData.surahName = surahName;
      if (surahNameArabic) challengeData.surahNameArabic = surahNameArabic;
      if (startVerse !== undefined) challengeData.startVerse = startVerse;
      if (endVerse !== undefined) challengeData.endVerse = endVerse;
      if (juz) challengeData.juz = juz;
    } else if (programType === 'juz') {
      challengeData.juzNumber = juzNumber;
      if (juzName) challengeData.juzName = juzName;
      if (juzNameArabic) challengeData.juzNameArabic = juzNameArabic;
      if (surahs) challengeData.surahs = surahs;
      if (totalSurahs !== undefined) challengeData.totalSurahs = totalSurahs;
    }

    const docRef = await db.collection(COLLECTIONS.CHALLENGES).add(challengeData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: 'Challenge créé avec succès',
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du challenge' },
      { status: 500 }
    );
  }
}

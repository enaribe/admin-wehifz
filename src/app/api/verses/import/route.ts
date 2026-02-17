import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase-admin';

const ALQURAN_API_BASE = 'https://api.alquran.cloud/v1';
const BATCH_SIZE = 500;

interface Verse {
  id: string;
  surahNumber: number;
  verseNumber: number;
  textArabic: string;
  textFrench?: string;
  audioUrl?: string;
  juzNumber?: number;
  pageNumber?: number;
}

async function fetchSurah(surahNumber: number): Promise<any> {
  // Fetch Arabic text
  const arabicResponse = await fetch(
    `${ALQURAN_API_BASE}/surah/${surahNumber}/ar.alafasy`
  );
  const arabicData = await arabicResponse.json();

  if (arabicData.code !== 200) {
    throw new Error(`Failed to fetch surah ${surahNumber}`);
  }

  // Fetch French translation
  const frenchResponse = await fetch(
    `${ALQURAN_API_BASE}/surah/${surahNumber}/fr.hamidullah`
  );
  const frenchData = await frenchResponse.json();

  return {
    arabic: arabicData.data,
    french: frenchData.data,
  };
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const body = await request.json();
        const surahs: number[] = body.surahs || [];

        let totalVersesImported = 0;

        for (let i = 0; i < surahs.length; i++) {
          const surahNumber = surahs[i];

          // Send progress update
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                status: 'importing',
                currentSurah: i + 1,
                totalSurahs: surahs.length,
                versesImported: totalVersesImported,
                message: `Import sourate ${surahNumber}...`,
              }) + '\n'
            )
          );

          try {
            // Fetch surah data
            const surahData = await fetchSurah(surahNumber);

            // Prepare verses for batch write
            const verses: Verse[] = surahData.arabic.ayahs.map(
              (ayah: any, index: number) => ({
                id: `${surahNumber}:${ayah.numberInSurah}`,
                surahNumber,
                verseNumber: ayah.numberInSurah,
                textArabic: ayah.text,
                textFrench: surahData.french?.ayahs[index]?.text || '',
                audioUrl: ayah.audio || ayah.audioSecondary?.[0] || '',
                juzNumber: ayah.juz,
                pageNumber: ayah.page,
              })
            );

            // Batch write to Firestore
            const batch = db.batch();
            for (const verse of verses) {
              const verseRef = db.collection(COLLECTIONS.VERSES).doc(verse.id);
              batch.set(verseRef, {
                ...verse,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
            await batch.commit();

            totalVersesImported += verses.length;

            // Also save surah info
            const surahRef = db
              .collection(COLLECTIONS.SURAHS)
              .doc(surahNumber.toString());
            await surahRef.set({
              number: surahNumber,
              name: surahData.arabic.name,
              englishName: surahData.arabic.englishName,
              englishNameTranslation: surahData.arabic.englishNameTranslation,
              revelationType: surahData.arabic.revelationType,
              numberOfAyahs: surahData.arabic.numberOfAyahs,
              updatedAt: new Date(),
            });

            // Small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (error: any) {
            console.error(`Error importing surah ${surahNumber}:`, error);
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  status: 'importing',
                  currentSurah: i + 1,
                  totalSurahs: surahs.length,
                  versesImported: totalVersesImported,
                  message: `Erreur sourate ${surahNumber}: ${error.message}`,
                }) + '\n'
              )
            );
          }
        }

        // Send completion
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              status: 'success',
              currentSurah: surahs.length,
              totalSurahs: surahs.length,
              versesImported: totalVersesImported,
              message: 'Import terminé',
            }) + '\n'
          )
        );
      } catch (error: any) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              status: 'error',
              message: error.message || 'Erreur lors de l\'import',
            }) + '\n'
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}

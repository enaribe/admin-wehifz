/**
 * Service Firebase Admin pour les programmes de mémorisation
 * CRUD complet pour l'interface admin
 */

import { db } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type {
  SurahProgram,
  JuzProgram,
} from '../types/program';

// ============================================
// Collections paths
// ============================================

const SURAHS_COLLECTION = 'programs/surahs/items';
const JUZ_COLLECTION = 'programs/juz/items';

// ============================================
// Surah Programs - CRUD
// ============================================

/**
 * Récupérer le programme d'une sourate
 */
export async function getSurahProgram(surahNumber: number): Promise<SurahProgram | null> {
  try {
    const docRef = db.collection(SURAHS_COLLECTION).doc(`surah_${surahNumber}`);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data()!;
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as SurahProgram;
  } catch (error) {
    console.error('[Programs] Error getting surah program:', error);
    throw error;
  }
}

/**
 * Récupérer tous les programmes de sourates
 */
export async function getAllSurahPrograms(): Promise<SurahProgram[]> {
  try {
    const snapshot = await db.collection(SURAHS_COLLECTION)
      .orderBy('surahNumber', 'asc')
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as SurahProgram;
    });
  } catch (error) {
    console.error('[Programs] Error getting all surah programs:', error);
    throw error;
  }
}

/**
 * Créer ou mettre à jour un programme de sourate
 */
export async function saveSurahProgram(program: Omit<SurahProgram, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const docRef = db.collection(SURAHS_COLLECTION).doc(program.id);
    const existing = await docRef.get();

    const data = {
      ...program,
      updatedAt: Timestamp.now(),
      createdAt: existing.exists ? existing.data()?.createdAt : Timestamp.now(),
    };

    await docRef.set(data);
    console.log(`[Programs] Saved surah program: ${program.id}`);
  } catch (error) {
    console.error('[Programs] Error saving surah program:', error);
    throw error;
  }
}

/**
 * Supprimer un programme de sourate
 */
export async function deleteSurahProgram(surahNumber: number): Promise<void> {
  try {
    await db.collection(SURAHS_COLLECTION).doc(`surah_${surahNumber}`).delete();
    console.log(`[Programs] Deleted surah program: surah_${surahNumber}`);
  } catch (error) {
    console.error('[Programs] Error deleting surah program:', error);
    throw error;
  }
}

// ============================================
// Juz Programs - CRUD
// ============================================

/**
 * Récupérer le programme d'un Juz
 */
export async function getJuzProgram(juzNumber: number): Promise<JuzProgram | null> {
  try {
    const docRef = db.collection(JUZ_COLLECTION).doc(`juz_${juzNumber}`);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data()!;
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as JuzProgram;
  } catch (error) {
    console.error('[Programs] Error getting juz program:', error);
    throw error;
  }
}

/**
 * Récupérer tous les programmes de Juz
 */
export async function getAllJuzPrograms(): Promise<JuzProgram[]> {
  try {
    const snapshot = await db.collection(JUZ_COLLECTION)
      .orderBy('juzNumber', 'asc')
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as JuzProgram;
    });
  } catch (error) {
    console.error('[Programs] Error getting all juz programs:', error);
    throw error;
  }
}

/**
 * Créer ou mettre à jour un programme de Juz
 */
export async function saveJuzProgram(program: Omit<JuzProgram, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const docRef = db.collection(JUZ_COLLECTION).doc(program.id);
    const existing = await docRef.get();

    const data = {
      ...program,
      updatedAt: Timestamp.now(),
      createdAt: existing.exists ? existing.data()?.createdAt : Timestamp.now(),
    };

    await docRef.set(data);
    console.log(`[Programs] Saved juz program: ${program.id}`);
  } catch (error) {
    console.error('[Programs] Error saving juz program:', error);
    throw error;
  }
}

/**
 * Supprimer un programme de Juz
 */
export async function deleteJuzProgram(juzNumber: number): Promise<void> {
  try {
    await db.collection(JUZ_COLLECTION).doc(`juz_${juzNumber}`).delete();
    console.log(`[Programs] Deleted juz program: juz_${juzNumber}`);
  } catch (error) {
    console.error('[Programs] Error deleting juz program:', error);
    throw error;
  }
}

// ============================================
// Generic & Stats Functions
// ============================================

/**
 * Récupérer tous les programmes
 */
export async function getAllPrograms(): Promise<{
  surahs: SurahProgram[];
  juz: JuzProgram[];
}> {
  const [surahs, juz] = await Promise.all([
    getAllSurahPrograms(),
    getAllJuzPrograms(),
  ]);

  return { surahs, juz };
}

/**
 * Compter le nombre de programmes
 */
export async function countPrograms(): Promise<{
  surahs: number;
  juz: number;
  total: number;
}> {
  try {
    const [surahsSnapshot, juzSnapshot] = await Promise.all([
      db.collection(SURAHS_COLLECTION).count().get(),
      db.collection(JUZ_COLLECTION).count().get(),
    ]);

    const surahs = surahsSnapshot.data().count;
    const juz = juzSnapshot.data().count;

    return {
      surahs,
      juz,
      total: surahs + juz,
    };
  } catch (error) {
    console.error('[Programs] Error counting programs:', error);
    throw error;
  }
}

/**
 * Vérifier si un programme existe
 */
export async function programExists(
  type: 'surah' | 'juz',
  number: number
): Promise<boolean> {
  const collectionPath = type === 'surah' ? SURAHS_COLLECTION : JUZ_COLLECTION;
  const docId = type === 'surah' ? `surah_${number}` : `juz_${number}`;

  const docRef = db.collection(collectionPath).doc(docId);
  const docSnap = await docRef.get();

  return docSnap.exists;
}

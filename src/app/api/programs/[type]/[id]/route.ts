import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;

    let collectionPath: string;
    if (type === 'surah') {
      collectionPath = 'programs/surahs/items';
    } else if (type === 'juz') {
      collectionPath = 'programs/juz/items';
    } else {
      return NextResponse.json(
        { error: 'Type invalide. Utilisez "surah" ou "juz"' },
        { status: 400 }
      );
    }

    const docRef = db.collection(collectionPath).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    const data = docSnap.data()!;

    return NextResponse.json({
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    });
  } catch (error: any) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

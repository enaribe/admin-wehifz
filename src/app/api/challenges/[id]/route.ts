import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const docRef = db.collection(COLLECTIONS.CHALLENGES).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Challenge non trouvé' },
        { status: 404 }
      );
    }

    const data = docSnap.data()!;

    return NextResponse.json({
      id: docSnap.id,
      ...data,
      startDate: data.startDate?.toDate?.()?.toISOString() || data.startDate,
      endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    });
  } catch (error: any) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const docRef = db.collection(COLLECTIONS.CHALLENGES).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Challenge non trouvé' },
        { status: 404 }
      );
    }

    // Delete the challenge
    await docRef.delete();

    // Optionally: Delete related participants and progress
    // This could be done in a batch or cloud function for large datasets
    const participantsSnapshot = await db
      .collection(COLLECTIONS.PARTICIPANTS)
      .where('challengeId', '==', id)
      .get();

    if (!participantsSnapshot.empty) {
      const batch = db.batch();
      participantsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: 'Challenge supprimé avec succès',
    });
  } catch (error: any) {
    console.error('Error deleting challenge:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}

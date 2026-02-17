import { NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection(COLLECTIONS.VERSES).count().get();
    return NextResponse.json({ count: snapshot.data().count });
  } catch (error) {
    console.error('Error counting verses:', error);
    return NextResponse.json({ count: 0 });
  }
}

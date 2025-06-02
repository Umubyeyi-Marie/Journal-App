// src/app/api/entries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyUser } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uid = await verifyUser(req);
    const { id } = params;

    // Make sure entry belongs to this user before deleting (optional)
    const docRef = adminDb.collection('entries').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    if (doc.data()?.userId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ message: 'Entry deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

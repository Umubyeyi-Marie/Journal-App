// src/app/api/entries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyUser } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const uid = await verifyUser(req);
    const doc = await adminDb.collection('entries').doc(params.id).get();
    if (!doc.exists || doc.data()?.userId !== uid) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await adminDb.collection('entries').doc(params.id).delete();
    return NextResponse.json({ message: 'Entry deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
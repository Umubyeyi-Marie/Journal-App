import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyUser } from '@/lib/auth';

type Context = {
  params: {
    id: string;
  };
};

export async function DELETE(req: NextRequest, context: Context) {
  try {
    const uid = await verifyUser(req);
    const { id } = context.params;

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
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

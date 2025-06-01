// src/app/api/entries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const uid = await verifyUser(req);
    console.log('Authenticated UID:', uid); // Debug
    const snapshot = await adminDb
      .collection('entries')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toISOString(), // Ensure consistent format
    }));
    console.log('Fetched Entries:', entries); // Debug
    return NextResponse.json(entries);
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Permission Denied Error:', error);
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const uid = await verifyUser(req);
    console.log('Authenticated UID:', uid); // Debug
    const { title, body } = await req.json();
    if (!title || !body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const entry = {
      title,
      body,
      userId: uid,
      createdAt: new Date().toISOString(),
    };
    const docRef = await adminDb.collection('entries').add(entry);
    const newEntry = { id: docRef.id, ...entry };
    console.log('New Entry Added:', newEntry); // Debug
    return NextResponse.json(newEntry);
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
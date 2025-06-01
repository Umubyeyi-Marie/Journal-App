// src/lib/auth.ts
import { adminAuth } from './firebaseAdmin';
import { NextRequest } from 'next/server';

export async function verifyUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    console.log('Decoded Token:', decoded);
    return decoded.uid;
  } catch (error) {
    console.error('Token Verification Error:', error);
    throw new Error('Invalid token');
  }
}
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = await verifyJwt(token);
  const userId = typeof payload?.sub === 'string' ? payload.sub : null;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing Titan email or password' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db('suzali_crm');
  const users = db.collection('users');
  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { titanEmail: email, titanPassword: password } }
  );
  if (result.modifiedCount === 1) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'User not found or not updated' }, { status: 404 });
  }
} 
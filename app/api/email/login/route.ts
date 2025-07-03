import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Get user ID from session (JWT in cookie)
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Decode JWT to get userId
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clientPromise;
    const db = client.db('suzali_crm');
    const users = db.collection('users');
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { titanEmailCredentials: { email, password } } }
    );
    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'User not found or not updated' }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
} 
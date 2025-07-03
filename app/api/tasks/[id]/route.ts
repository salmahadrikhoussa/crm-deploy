import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('test');
  const doc = await db.collection('tasks').findOne({ _id: new ObjectId(id) });

  if (!doc) {
    return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });
  }

  const { _id, ...rest } = doc;
  return NextResponse.json({ id: _id.toString(), ...rest });
}

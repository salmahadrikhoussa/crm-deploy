import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function extractId(req: NextRequest) {
  return req.nextUrl.pathname.split("/").pop() || null;
}

export async function PUT(req: NextRequest) {
  const id = extractId(req);
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
  }

  const updates = await req.json();
  const client = await clientPromise;
  const db = client.db("suzali_crm");

  const result = await db.collection("frais").updateOne({ _id: new ObjectId(id) }, { $set: updates });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Frais not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

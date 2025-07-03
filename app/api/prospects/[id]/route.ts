import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function extractId(req: NextRequest) {
  return req.nextUrl.pathname.split("/").pop() || null;
}

export async function GET(req: NextRequest) {
  const id = extractId(req);
  if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("suzali_crm");
  const prospect = await db.collection("prospects").findOne({ _id: new ObjectId(id) });

  return prospect
    ? NextResponse.json(prospect)
    : NextResponse.json({ error: "Prospect not found" }, { status: 404 });
}

export async function PATCH(req: NextRequest) {
  const id = extractId(req);
  if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });

  const updates = await req.json();
  const client = await clientPromise;
  await client.db("suzali_crm").collection("prospects").updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = extractId(req);
  if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });

  const client = await clientPromise;
  await client.db("suzali_crm").collection("prospects").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ ok: true });
}

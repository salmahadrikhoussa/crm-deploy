import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyJwt } from "@/lib/jwt";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyJwt(token);
  if (!payload || !("id" in payload)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifId = params.id;
  const client = await clientPromise;
  const db = client.db();

  await db.collection("notifications").updateOne(
    { _id: new ObjectId(notifId) },
    { $set: { read: true } }
  );

  return NextResponse.json({ success: true });
}

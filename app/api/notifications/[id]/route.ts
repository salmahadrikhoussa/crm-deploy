import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db("suzali_crm");

    await db.collection("notifications").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

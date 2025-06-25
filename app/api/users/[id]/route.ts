import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Params = { params: { id: string } };

// GET user by ID
export async function GET(req: NextRequest, { params }: Params) {
  const id = params.id;

  try {
    const client = await clientPromise;
    const db = client.db("suzali_crm");
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH user
export async function PATCH(req: NextRequest, { params }: Params) {
  const id = params.id;

  try {
    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db("suzali_crm");

    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: updates });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: NextRequest, { params }: Params) {
  const id = params.id;

  try {
    const client = await clientPromise;
    const db = client.db("suzali_crm");

    await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

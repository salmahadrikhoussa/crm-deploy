import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Fonction pour extraire le paramètre "id"
function getIdFromRequestUrl(req: NextRequest): string | null {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  return segments.pop() || null;
}

// GET user by ID
export async function GET(req: NextRequest) {
  const id = getIdFromRequestUrl(req);
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db("suzali_crm");
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH user
export async function PATCH(req: NextRequest) {
  const id = getIdFromRequestUrl(req);
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db("suzali_crm");

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: NextRequest) {
  const id = getIdFromRequestUrl(req);
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

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

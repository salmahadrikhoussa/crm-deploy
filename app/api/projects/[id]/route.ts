import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function extractIdFromRequest(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split("/");
  return segments.pop() || null;
}

export async function GET(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db("suzali_crm");
    const projectData = await db.collection("projects").findOne({ _id: new ObjectId(id) });

    if (!projectData) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(projectData);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db("suzali_crm");

    await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db("suzali_crm");

    await db.collection("projects").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

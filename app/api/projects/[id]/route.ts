import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const client = await clientPromise;
    const db = client.db("suzali_crm");
    const project = await db.collection("projects").findOne({ _id: new ObjectId(id!) });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db("suzali_crm");

    await db.collection("projects").updateOne({ _id: new ObjectId(id!) }, { $set: updates });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const client = await clientPromise;
    const db = client.db("suzali_crm");

    await db.collection("projects").deleteOne({ _id: new ObjectId(id!) });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ Fichier complet : app/api/projects/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/projects : liste tous les projets (version nettoyée)
export async function GET() {
  try {
    const client = await clientPromise;
    const docs = await client.db().collection("projects").find().toArray();

    const projects = docs.map(doc => ({
      id: (doc._id as ObjectId).toHexString(),
      name: doc.name,
      clientId: doc.clientId, // conserver clientId pour correspondre au frontend
      owner: doc.owner,
      startDate: doc.startDate,
      endDate: doc.endDate,
      status: doc.status,
    }));

    return NextResponse.json(projects);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/projects : ajoute un projet
export async function POST(req: NextRequest) {
  try {
    const input = await req.json();

    const client = await clientPromise;
    const col = client.db().collection("projects");
    const res = await col.insertOne(input);

    const created = {
      id: res.insertedId.toHexString(),
      ...input,
    };

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 422 });
  }
}

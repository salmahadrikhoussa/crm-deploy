// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log("[API] GET /api/tasks/[id] → id =", id);

  // validate the id is a proper Mongo ObjectId
  if (!ObjectId.isValid(id)) {
    console.error("[API] Invalid ObjectId:", id);
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('test');     // ← make sure this is your DB name
    const task = await db
      .collection('tasks')            // ← make sure this matches your collection
      .findOne({ _id: new ObjectId(id) });

    if (!task) {
      console.warn(`[API] Tâche non trouvée pour _id=${id}`);
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });
    }

    // Serialize _id into a flat string "id"
    const { _id, ...rest } = task;
    const payload = { id: _id.toString(), ...rest };
    console.log("[API] Returning task:", payload);
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[API] Error in GET /api/tasks/[id]:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

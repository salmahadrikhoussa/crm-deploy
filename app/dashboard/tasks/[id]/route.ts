// app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  // Extract the ID from the URL manually
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // e.g. "60f6a8d2c1e8b8a1d4e2c123"

  console.log('[API] GET /api/clients/[id] → id =', id);

  if (!id) {
    console.error('[API] No ID provided');
    return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
  }
  if (!ObjectId.isValid(id)) {
    console.error('[API] Invalid ObjectId:', id);
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('suzali_crm'); // ← your database name
    const doc = await db.collection('clients').findOne({ _id: new ObjectId(id) });

    if (!doc) {
      console.warn(`[API] Client not found for _id=${id}`);
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
    }

    // Serialize _id to a flat string "id"
    const { _id, ...rest } = doc;
    const payload = { id: _id.toString(), ...rest };
    console.log('[API] Returning client:', payload);
    return NextResponse.json(payload);
  } catch (err) {
    console.error('[API] Error in GET /api/clients/[id]:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

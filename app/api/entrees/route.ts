// app/api/entrees/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = 'test';

export async function GET(req: NextRequest) {
  try {
    await client.connect();
    const entreesCollection = client.db(dbName).collection('entrees');

    const url = new URL(req.url);
    const last30Days = url.searchParams.get('last30Days') === 'true';

    const query: any = {};
    if (last30Days) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.createdAt = { $gte: thirtyDaysAgo.toISOString() };
    }

    const entreesList = await entreesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(entreesList);
  } catch (err) {
    console.error('Error fetching entrees:', err);
    return NextResponse.json({ error: 'Failed to fetch entrees' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newEntree = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    await client.connect();
    const entreesCollection = client.db(dbName).collection('entrees');
    const result = await entreesCollection.insertOne(newEntree);

    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error('Error creating entree:', err);
    return NextResponse.json({ error: 'Failed to create entree' }, { status: 500 });
  }
}

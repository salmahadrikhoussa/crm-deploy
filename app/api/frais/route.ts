// app/api/frais/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = 'test'; // Make sure this matches your DB

export async function GET(req: NextRequest) {
  try {
    await client.connect();
    const fraisCollection = client.db(dbName).collection('frais');

    const url = new URL(req.url);
    const last30Days = url.searchParams.get('last30Days') === 'true';

    const query: any = {};
    if (last30Days) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.createdAt = { $gte: thirtyDaysAgo.toISOString() };
    }

    const fraisList = await fraisCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(fraisList);
  } catch (err) {
    console.error('Error fetching frais:', err);
    return NextResponse.json({ error: 'Failed to fetch frais' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newFrais = {
      ...body,
      status: 'en_attente',
      createdAt: new Date().toISOString(),
    };

    await client.connect();
    const fraisCollection = client.db(dbName).collection('frais');
    const result = await fraisCollection.insertOne(newFrais);

    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error('Error creating frais:', err);
    return NextResponse.json({ error: 'Failed to create frais' }, { status: 500 });
  }
}

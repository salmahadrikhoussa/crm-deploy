import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = 'test'; // change if your DB name is different

export async function GET() {
  try {
    await client.connect();
    const entreesCollection = client.db(dbName).collection('entrees');
    const entrees = await entreesCollection.find().sort({ date: -1 }).toArray();
    return NextResponse.json(entrees);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch entrees' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newEntry = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    await client.connect();
    const entreesCollection = client.db(dbName).collection('entrees');
    const result = await entreesCollection.insertOne(newEntry);

    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create entree' }, { status: 500 });
  }
}

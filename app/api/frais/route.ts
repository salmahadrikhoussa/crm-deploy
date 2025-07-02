// app/api/frais/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "test"; // change if your DB is different

export async function GET() {
  try {
    await client.connect();
    const fraisCollection = client.db(dbName).collection("frais");
    const fraisList = await fraisCollection.find().sort({ createdAt: -1 }).toArray();

    return NextResponse.json(fraisList);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch frais" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newFrais = {
      ...body,
      status: "en_attente",
      createdAt: new Date().toISOString(),
    };

    await client.connect();
    const fraisCollection = client.db(dbName).collection("frais");
    const result = await fraisCollection.insertOne(newFrais);

    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create frais" }, { status: 500 });
  }
}

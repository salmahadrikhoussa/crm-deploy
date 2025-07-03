import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "test"; // Or your actual DB name

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const updates = await req.json();

    await client.connect();
    const db = client.db(dbName);
    const fraisCollection = db.collection("frais");

    const result = await fraisCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Frais not found or unchanged" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

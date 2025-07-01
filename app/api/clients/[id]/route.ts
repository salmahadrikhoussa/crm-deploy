import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
const dbName = "test"; // Replace if different

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("clients");

    const clientData = await collection.findOne({ name: new ObjectId(params.id) });

    if (!clientData) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ name: clientData.name });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}

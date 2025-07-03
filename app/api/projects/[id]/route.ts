import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function extractId(req: NextRequest) {
  return req.nextUrl.pathname.split("/").pop() || null;
}

export async function GET(req: NextRequest) {
  const id = extractId(req);
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const projectDB = client.db("test");
  const clientDB = client.db("suzali_crm");

  const project = await projectDB.collection("projects").findOne({ _id: new ObjectId(id) });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const clientData = project.clientId && ObjectId.isValid(project.clientId)
    ? await clientDB.collection("clients").findOne({ _id: new ObjectId(project.clientId) })
    : null;

  const ownerData = project.owner && ObjectId.isValid(project.owner)
    ? await clientDB.collection("users").findOne({ _id: new ObjectId(project.owner) })
    : null;

  const enriched = {
    ...project,
    clientName: clientData?.name || "Client inconnu",
    ownerName: ownerData?.name || "Utilisateur inconnu",
  };

  return NextResponse.json(enriched);
}

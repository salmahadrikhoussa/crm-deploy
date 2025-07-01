import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const client = await clientPromise;

  // 🎯 Connexion aux deux bases
  const projectDB = client.db("test");            // pour projects
  const clientDB = client.db("suzali_crm");       // pour clients
  // 🔍 1. Récupérer le projet
  const project = await projectDB
    .collection("projects")
    .findOne({ _id: new ObjectId(id) });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // 🔄 2. Chercher le client depuis l’AUTRE base
  let clientData = null;
  if (project.clientId && ObjectId.isValid(project.clientId)) {
    clientData = await clientDB
      .collection("clients")
      .findOne({ _id: new ObjectId(project.clientId) });
  }

  // 🔄 3. Chercher le user (dans test)
  let ownerData = null;
  if (project.owner && ObjectId.isValid(project.owner)) {
    ownerData = await clientDB
      .collection("users")
      .findOne({ _id: new ObjectId(project.owner) });
  }

  // 🔁 4. Ajouter les noms
  const enrichedProject = {
    ...project,
    clientName: clientData?.name || "Client inconnu",
    ownerName: ownerData?.name || "Utilisateur inconnu",
  };

  return NextResponse.json(enrichedProject);
}

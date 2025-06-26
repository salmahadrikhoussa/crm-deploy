import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyJwt } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyJwt(token) as { id: string; role: string } | null;
  if (!payload?.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();

  const notifications = await db.collection("notifications")
    .find({ userId: payload.id })
    .sort({ createdAt: -1 })
    .toArray();

  // Convertir les ObjectId en string si nécessaire
  const safeNotifications = notifications.map((n) => ({
    ...n,
    _id: n._id?.toString(),
  }));

  return NextResponse.json(safeNotifications);
}

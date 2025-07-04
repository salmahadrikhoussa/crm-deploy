import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyJwt } from '@/lib/jwt';
import nodemailer from 'nodemailer';

// Titan SMTP settings
const SMTP_HOST = "smtp.titan.email";
const SMTP_PORT = 465;
const SMTP_SECURE = true;

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message } = await req.json();
    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyJwt(token);
    const userId = typeof payload?.sub === 'string' ? payload.sub : null;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const client = await clientPromise;
    const db = client.db('suzali_crm');
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user || !user.titanEmail || !user.titanPassword) {
      return NextResponse.json({ error: 'No Titan credentials found' }, { status: 400 });
    }
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: user.titanEmail,
        pass: user.titanPassword,
      },
    });
    await transporter.sendMail({
      from: user.titanEmail,
      to,
      subject,
      text: message,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send email', details: String(err) }, { status: 500 });
  }
} 
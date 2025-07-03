import { NextRequest, NextResponse } from 'next/server';
import { getUserEmailCredentials } from '@/lib/getUserEmailCredentials';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, message } = body;
    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const creds = await getUserEmailCredentials(userId);
    const transporter = nodemailer.createTransport({
      host: 'smtp.titan.email',
      port: 465,
      secure: true,
      auth: {
        user: creds.email,
        pass: creds.password,
      },
    });
    await transporter.sendMail({
      from: creds.email,
      to,
      subject,
      text: message,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send email', details: String(err) }, { status: 500 });
  }
} 
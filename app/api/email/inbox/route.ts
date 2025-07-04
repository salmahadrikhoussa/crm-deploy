import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyJwt } from '@/lib/jwt';
import Imap from 'imap';
import { simpleParser } from 'mailparser';

type EmailSummary = {
  from: string;
  subject: string;
  date: Date;
  bodyPreview: string;
};

// Titan IMAP settings
const IMAP_HOST = "imap.titan.email";
const IMAP_PORT = 993;
const IMAP_SECURE = true;

async function fetchEmails(email: string, password: string): Promise<EmailSummary[]> {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: email,
      password,
      host: IMAP_HOST,
      port: IMAP_PORT,
      tls: IMAP_SECURE,
    });
    function openInbox(cb: any) {
      imap.openBox('INBOX', true, cb);
    }
    imap.once('ready', function () {
      openInbox(function (err: any, box: any) {
        if (err) return reject(err);
        const fetch = imap.seq.fetch(`${Math.max(1, box.messages.total - 9)}:${box.messages.total}`, {
          bodies: '',
          struct: true,
        });
        const emails: EmailSummary[] = [];
        fetch.on('message', function (msg: any) {
          msg.on('body', function (stream: any) {
            let buffer = '';
            stream.on('data', function (chunk: any) {
              buffer += chunk.toString('utf8');
            });
            stream.on('end', async function () {
              const parsed = await simpleParser(buffer);
              emails.push({
                from: parsed.from?.text || '',
                subject: parsed.subject || '',
                date: parsed.date || new Date(),
                bodyPreview: parsed.text?.slice(0, 200) || '',
              });
            });
          });
        });
        fetch.once('end', function () {
          imap.end();
          resolve(emails.reverse());
        });
      });
    });
    imap.once('error', function (err: any) {
      reject(err);
    });
    imap.connect();
  });
}

export async function GET(req: NextRequest) {
  try {
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
    const emails = await fetchEmails(user.titanEmail, user.titanPassword);
    return NextResponse.json({ emails });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch emails', details: String(err) }, { status: 500 });
  }
} 
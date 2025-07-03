import { NextRequest, NextResponse } from 'next/server';
import { getUserEmailCredentials } from '@/lib/getUserEmailCredentials';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import Imap from 'imap';
import { simpleParser } from 'mailparser';

declare module 'imap';

async function fetchEmails(userId: string) {
  const creds = await getUserEmailCredentials(userId);
  return new Promise<any[]>((resolve, reject) => {
    const imap = new Imap({
      user: creds.email,
      password: creds.password,
      host: 'imap.titan.email',
      port: 993,
      tls: true,
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
        const emails: any[] = [];
        fetch.on('message', function (msg: any) {
          let attributes: any;
          let body = '';
          msg.on('body', function (stream: any) {
            let buffer = '';
            stream.on('data', function (chunk: any) {
              buffer += chunk.toString('utf8');
            });
            stream.on('end', async function () {
              const parsed = await simpleParser(buffer);
              emails.push({
                from: parsed.from?.text,
                subject: parsed.subject,
                date: parsed.date,
                bodyPreview: parsed.text?.slice(0, 200) || '',
              });
            });
          });
          msg.once('attributes', function (attrs: any) {
            attributes = attrs;
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
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const emails = await fetchEmails(userId);
    return NextResponse.json({ emails });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch emails', details: String(err) }, { status: 500 });
  }
} 
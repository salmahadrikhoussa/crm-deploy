import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getUserEmailCredentials(userId: string): Promise<{ email: string, password: string }> {
  const client = await clientPromise;
  const db = client.db('suzali_crm');
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user || !user.titanEmailCredentials) {
    throw new Error('Titan email credentials not found');
  }
  return user.titanEmailCredentials;
} 
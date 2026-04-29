import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export type Student = {
    studentId: string;
    name: string;
    email: string;
    createdAt: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
        return res.status(400).json({ message: 'Missing required fields (studentId, name, email).' });
    }

    const client = new MongoClient(process.env.MONGODB_URI!);

    try {
        await client.connect();
        const db = client.db('lizrd_core');
        
        // Inserting a document automatically creates the 'students' collection if it doesn't exist
        const newStudent: Student = { studentId, name, email, createdAt: new Date().toISOString() };
        const result = await db.collection('students').insertOne(newStudent);

        res.status(201).json({ message: 'Student created successfully!', _id: result.insertedId });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}

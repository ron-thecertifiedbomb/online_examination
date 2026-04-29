// File: pages/api/attempts.ts
import { MongoClient } from "mongodb";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).end();

  const client = new MongoClient(process.env.MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db("lizrd_core");

    const { examId, studentId, startTime } = req.body;

    const attempt = await db.collection("live_attempts").insertOne({
      examId,
      studentId,
      startTime: new Date(startTime),
      status: "active",
      responses: {},
      proctoringLogs: [],
      lastHeartbeat: new Date(),
    });

    res.status(200).json({ attemptId: attempt.insertedId });
  } finally {
    await client.close();
  }
}

import { MongoClient, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  const client = new MongoClient(process.env.MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db("lizrd_core");

    const { examId, studentId, startTime } = req.body;

    const attempt = await db.collection("live_attempts").insertOne({
      examId: new ObjectId(examId), // Ensure examId is stored as ObjectId
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

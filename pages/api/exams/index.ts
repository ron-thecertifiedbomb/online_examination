import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = new MongoClient(process.env.MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db("lizrd_core");

    // Fetch exams, excluding the full question set to keep the payload light
    const exams = await db
      .collection("exams")
      .find({ teacherId: "ronan_architect" })
      .project({ questions: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(exams);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch exams" });
  } finally {
    await client.close();
  }
}

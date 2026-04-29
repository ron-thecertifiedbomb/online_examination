import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
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

  const { examId, studentId, startTime } = req.body;

  if (!examId || !studentId || !startTime) {
    return res.status(400).json({ message: "Missing required fields: examId, studentId, startTime" });
  }

  if (!ObjectId.isValid(examId)) {
    return res.status(400).json({ message: "Invalid examId format." });
  }

  try {
    const client = await clientPromise;
    const db = client.db("lizrd_core");

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
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
}

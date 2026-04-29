import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

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

  const { attemptId, examId, studentId, answers, score, passed } = req.body;

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db("lizrd_core");

    let objectId;
    try {
      objectId = new ObjectId(attemptId);
    } catch (e) {
      objectId = new ObjectId(); // fallback if invalid format
    }

    const submittedAt = new Date().toISOString();

    await db.collection("attempts").insertOne({
      _id: objectId,
      examId,
      studentId,
      answers,
      score,
      passed,
      submittedAt,
    });

    // Insert the attempt data directly into the student's document
    await db.collection("students").updateOne(
      { studentId },
      {
        $push: {
          attempts: { attemptId: objectId, examId, score, passed, submittedAt },
        } as any,
      },
    );

    res.status(201).json({ message: "Attempt saved successfully!" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}

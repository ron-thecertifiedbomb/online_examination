import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

// Lizard Architect Tip: Use a global cached connection for 100/100 performance
let cachedClient: any = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  cachedClient = client;
  return client;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // 1. Only allow POST requests for security
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { examId, studentId, responses, startTime } = req.body;
    const db = (await connectToDatabase()).db("lizrd_core");

    // 2. Fetch the actual exam blueprint to grade responses server-side
    const exam = await db.collection("exams").findOne({ _id: examId });
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // 3. Grading Logic (No Ego, Just Logic)
    let score = 0;
    const totalPoints = exam.questions.reduce(
      (acc: number, q: any) => acc + q.points,
      0,
    );

    exam.questions.forEach((question: any) => {
      if (responses[question.id] === question.correctOption) {
        score += question.points;
      }
    });

    const finalPercentage = (score / totalPoints) * 100;

    // 4. Persistence: Save to 'results' collection
    const resultDoc = {
      examId,
      studentId,
      score,
      totalPoints,
      percentage: finalPercentage,
      passed: finalPercentage >= exam.passingScore,
      submittedAt: new Date(),
      durationSeconds: Math.floor(
        (Date.now() - new Date(startTime).getTime()) / 1000,
      ),
    };

    const result = await db.collection("results").insertOne(resultDoc);

    // 5. Response: Return sub-100ms result
    return res.status(200).json({
      success: true,
      resultId: result.insertedId,
      passed: resultDoc.passed,
      percentage: finalPercentage,
    });
  } catch (error) {
    console.error("Lizard API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

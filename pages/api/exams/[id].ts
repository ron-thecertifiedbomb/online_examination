import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  points: number;
};

export type Exam = {
  _id: ObjectId;
  title: string;
  slug: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  teacherId: string;
  status: string;
  createdAt: string;
  questions: Question[];
};

type Data = {
  exam?: Exam;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { id } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid exam ID." });
  }

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid exam ID format." });
    }

    const client = await clientPromise;
    const db = client.db("lizrd_core");
    const objectId = new ObjectId(id);
    const exam = await db.collection<Exam>("exams").findOne({ _id: objectId });

    if (!exam) return res.status(404).json({ message: "Exam not found." });

    res.status(200).json({ exam });
  } catch (error) {
    console.error("API Error:", error); // Log the full error on the server
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    }); // Optionally send a simplified error message to the client
  }
}

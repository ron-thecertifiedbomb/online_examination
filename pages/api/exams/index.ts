import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb"; // Import ObjectId here
import clientPromise from "../../../lib/mongodb"; // Import clientPromise

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const client = await clientPromise; // Use the shared clientPromise
    const db = client.db("lizrd_core"); // Get the database instance

    const exams = await db
      .collection("exams")
      .find({ status: "published" })
      .project({ title: 1, slug: 1, description: 1, category: 1 })
      .toArray();
    res.status(200).json({ exams });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export type Exam = {
  // Define Exam type here for consistency
  _id: ObjectId;
  title: string;
  slug: string;
  description: string;
  category?: string;
};

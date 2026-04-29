import { ObjectId } from "mongodb";

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  points: number;
};

// Define Exam type for client-side usage where _id is a string after serialization
// and for server-side where it can be ObjectId.
export type Exam = {
  _id: string | ObjectId; // Use string for client, ObjectId for server
  title: string;
  slug?: string;
  description?: string;
  durationMinutes?: number;
  passingScore?: number;
  teacherId?: string;
  status?: string;
  createdAt?: string;
  category?: string;
  questions?: Question[];
};

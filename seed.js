import "dotenv/config";
import mongoose from "mongoose";
import { readData } from "./common/helpers/readData.js";
import connectDB from "./config/db.js"; // Import the DB connection
import Exam from "./common/models/exam.schema.js"; // Import the Exam model
import Solution from "./common/models/solution.schema.js"; // Import the Solution model

const seedExams = async () => {
  // Await the connection to prevent Mongoose buffering timeouts
  await connectDB();

  const examJsonPath = "./common/data/exam.json";
  const examData = readData(examJsonPath);

  const solutionsJsonPath = "./common/data/solutions.json";
  const solutionsData = readData(solutionsJsonPath);

  if (!examData) {
    console.error("❌ No exam data found to seed.");
    return;
  }

  try {
    // Clear existing exams to prevent duplicates on re-seeding
    await Exam.deleteMany({});
    console.log("🗑️ Existing exam data cleared.");

    // Insert the exam data
    // Ensure the examData is an array if insertMany expects an array,
    // or wrap it in an array if it's a single object.
    const examsToInsert = Array.isArray(examData) ? examData : [examData];
    await Exam.insertMany(examsToInsert);
    console.log("✅ Exam data seeded successfully!");

    // Seed Solutions
    if (solutionsData && solutionsData.solutions) {
      await Solution.deleteMany({});
      console.log("🗑️ Existing solutions data cleared.");
      await Solution.insertMany(solutionsData.solutions);
      console.log("✅ Solutions data seeded successfully!");
    }
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    // Disconnect from MongoDB after seeding
    // This is important for scripts that run and exit.
    // If your server is meant to stay running, you might remove this.
    // For a seed script, it's generally good practice.
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
    process.exit(0);
  }
};

seedExams();

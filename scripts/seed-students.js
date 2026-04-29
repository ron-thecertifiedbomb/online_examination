// File: seed-students.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const students = [

  {
    studentId: "std_12345",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    createdAt: new Date(),
  },
  {
    studentId: "std_67890",
    name: "John Smith",
    email: "john.smith@example.com",
    createdAt: new Date(),
  },
  {
    studentId: "ronan_dev_01",
    name: "Ronan Sibunga",
    email: "ronan@lizrd.online",
    createdAt: new Date(),
  },
  {
    studentId: "std_beta_test",
    name: "Beta Tester",
    email: "test@lizrd.online",
    createdAt: new Date(),
  }
];


async function runSeed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI not found in .env.local");
    return;
  }

  const client = new MongoClient(uri);

  try {
    console.log("Connecting to LIZRD Core...");
    await client.connect();
    const db = client.db("lizrd_core");

    await db
      .collection("students")
      .createIndex({ studentId: 1 }, { unique: true });

    for (const student of students) {
      await db
        .collection("students")
        .updateOne(
          { studentId: student.studentId },
          { $set: student },
          { upsert: true },
        );
    }

    console.log("✅ Student directory synchronized successfully.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await client.close();
  }
}

runSeed();

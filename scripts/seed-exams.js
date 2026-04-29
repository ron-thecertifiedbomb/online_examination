const { MongoClient } = require("mongodb");
const path = require("path");
const fs = require("fs");

// 1. Manually load .env from the root directory
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
} else {
  console.error("❌ ERROR: .env file not found at " + envPath);
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || !MONGODB_URI.startsWith("mongodb")) {
  console.error("❌ ERROR: MONGODB_URI is missing or invalid in .env");
  process.exit(1);
}

const initialExams = [
  {
    title: "Lizard Engineering: Next.js Fundamentals",
    slug: "nextjs-fundamentals",
    description: "Assessment for high-performance Pages Router architecture.",
    durationMinutes: 45,
    passingScore: 80,
    teacherId: "ronan_architect",
    status: "published",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "What is the primary benefit of 'output: standalone' in next.config.js?",
        options: [
          "Smaller Docker images",
          "Faster dev server",
          "Automatic SEO",
          "Better CSS",
        ],
        correctOption: 0,
        points: 20,
      },
      {
        id: "q2",
        text: "Which Lighthouse score is the Lizard Interactive gold standard?",
        options: ["85/100", "90/100", "95/100", "100/100"],
        correctOption: 3,
        points: 20,
      },
    ],
  },
  {
    title: "General Web Architecture",
    slug: "web-arch-101",
    description: "Testing knowledge on Client-Server models and API protocols.",
    durationMinutes: 60,
    passingScore: 75,
    teacherId: "ronan_architect",
    status: "published",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "Which HTTP method is typically used to update an existing resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctOption: 2,
        points: 25,
      },
      {
        id: "q2",
        text: "What does the 'L' in LCP stand for in Core Web Vitals?",
        options: ["Latency", "Largest", "Layout", "Loading"],
        correctOption: 1,
        points: 25,
      },
    ],
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("🦎 Connected to Lizrd Cluster...");

    const db = client.db("lizrd_core");
    const collection = db.collection("exams");

    // Optional: Clear existing data to avoid duplicates during testing
    await collection.deleteMany({ teacherId: "ronan_architect" });

    const result = await collection.insertMany(initialExams);
    console.log(
      `✅ Successfully seeded ${result.insertedCount} exams into lizrd_core.`,
    );
  } catch (err) {
    console.error("❌ Seed Error:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();

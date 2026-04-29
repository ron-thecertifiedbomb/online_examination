// File: seed-exams.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const exams = [
  {
    title: "Next.js Fundamentals",
    slug: "nextjs-fundamentals",
    category: "Frontend",
    description:
      "Deep dive into SSR, SSG, and the Next.js Pages Router architecture.",
    durationMinutes: 60,
    passingScore: 80,
    status: "published",
  },
  {
    title: "General Web Architecture",
    slug: "web-arch-101",
    category: "Architecture",
    description:
      "Assessing knowledge of HTTP protocols, load balancing, and DNS.",
    durationMinutes: 45,
    passingScore: 75,
    status: "published",
  },
  // --- NEW ADDITIONS ---
  {
    title: "Node.js & MongoDB Core",
    slug: "backend-core",
    category: "Backend",
    description:
      "Testing API optimization, indexing strategies, and middleware security.",
    durationMinutes: 60,
    passingScore: 80,
    status: "published",
  },
  {
    title: "Vercel & CI/CD Pipelines",
    slug: "devops-vercel",
    category: "DevOps",
    description:
      "Deployment strategies, environment variables, and build-time performance.",
    durationMinutes: 30,
    passingScore: 85,
    status: "published",
  },
];

async function runSeed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return console.error("❌ MONGODB_URI missing.");

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("lizrd_core");

    for (const exam of exams) {
      await db
        .collection("exams")
        .updateOne({ slug: exam.slug }, { $set: exam }, { upsert: true });
    }
    console.log("✅ Full Exam Directory synchronized.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await client.close();
  }
}

runSeed();

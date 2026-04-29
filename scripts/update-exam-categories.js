const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function migrateExams() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("lizrd_core");
    const collection = db.collection("exams");

    // Update specific exams with categories
    await collection.updateOne(
      { slug: "nextjs-fundamentals" },
      { $set: { category: "Frontend" } },
    );

    // You can also set a default category for everything else
    await collection.updateMany(
      { category: { $exists: false } },
      { $set: { category: "General Engineering" } },
    );

    console.log("✅ Exam categories synchronized.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await client.close();
  }
}

migrateExams();

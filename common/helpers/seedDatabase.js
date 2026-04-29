import mongoose from "mongoose";
import Services from "../models/services.schema.js";

export const seedDatabase = async (data, database) => {
  const URI = process.env.MONGO_URI;

  try {
    await mongoose.connect(URI, {
      dbName: database,
      serverApi: { version: "1", strict: true, deprecationErrors: true },
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ seedDatabase connected to MongoDB");

    if (!data) return;

    await Services.insertMany(data);
    console.log(`🌱 Seeded data successfully`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

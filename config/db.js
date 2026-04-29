// config/db.js
import mongoose from "mongoose";
import "dotenv/config";

const URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!URI) {
    console.error("❌ No valid MongoDB URI in environment variables");
    process.exit(1);
  }
  try {
    // Simplified connection for better stability with Atlas replica sets
    await mongoose.connect(URI, {
      dbName: "storage",
      serverSelectionTimeoutMS: 5000, // Fail faster if unable to connect
    });
    console.log("✅ Successfully connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error("💡 HINT: Ensure your current IP address is whitelisted in MongoDB Atlas Network Access settings, and that no VPN/Firewall is blocking port 27017.");
    }
    console.error("❌ MongoDB connection error detail:", err);
    process.exit(1); // Stop the server if connection fails
  }
};

export default connectDB;

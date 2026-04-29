import express from "express";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Helper to handle __dirname in ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get("/philippine-history", async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "../common/data/exam.json");
    const data = await readFile(dataPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Error loading exam data:", error);
    res.status(500).json({ error: "Failed to load exam data" });
  }
});

export default router;

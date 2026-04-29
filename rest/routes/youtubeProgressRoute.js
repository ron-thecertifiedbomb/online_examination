import express from "express";
import { youtubeProgressSSE } from "../controller/youtubeProgressController.js";

const router = express.Router();

// SSE endpoint for progress
router.get("/progress", youtubeProgressSSE);

export default router;

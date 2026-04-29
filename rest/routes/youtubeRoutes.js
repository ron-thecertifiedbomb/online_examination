// routes/youtubeRoutes.js
import express from "express";
import { downloadAudioController } from "../controller/youtubeController.js";


const router = express.Router();
router.get("/audio", downloadAudioController);

export default router;
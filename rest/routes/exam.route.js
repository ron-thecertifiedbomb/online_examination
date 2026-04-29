import express from "express";
import {
  getExamByTitle,
  createExam,
  getAllExams,
  updateExam,
  deleteExam,
} from "../controller/examController.js";

const router = express.Router();

  // GET /api/exams/title/:title
router.get("/title/:title", getExamByTitle);

// GET /api/exams
router.get("/", getAllExams);

// POST /api/exams
router.post("/", createExam);

// PUT /api/exams/:id
router.put("/:id", updateExam);

// DELETE /api/exams/:id
router.delete("/:id", deleteExam);

export default router;

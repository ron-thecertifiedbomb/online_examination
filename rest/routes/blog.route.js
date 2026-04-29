import express from "express";
import {
  saveBlogController,
  getBlogsController,
  getBlogByIdController,
} from "../controller/blogController.js";

const router = express.Router();

// POST /api/blogs → save blog
router.post("/", saveBlogController);
// GET /api/blogs → fetch all blogs
router.get("/", getBlogsController);
// GET /api/blogs/:id → fetch a single blog by ID
router.get("/:id", getBlogByIdController);
export default router;

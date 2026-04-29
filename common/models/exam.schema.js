import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["MCQ", "TF", "IDENTIFICATION", "ESSAY_AI"],
    required: true,
  },
  prompt: { type: String, required: true },
  points: { type: Number, default: 0 },
  options: [String],
  correctAnswer: String,
});

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    timestamp: { type: String },
    totalNodes: { type: Number },
    questions: [questionSchema],
  },
  { timestamps: true },
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;

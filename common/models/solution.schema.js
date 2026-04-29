import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [{ type: String }],
});

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;

import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  items: {
    type: [String], // Array of strings
    required: true,
  },
});

const SolutionsDataSchema = new mongoose.Schema(
  {
    solutions: {
      type: [SolutionSchema], // Array of solution categories
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // optional, adds createdAt and updatedAt
  }
);

export const SolutionsData = mongoose.model(
  "SolutionsData",
  SolutionsDataSchema
);

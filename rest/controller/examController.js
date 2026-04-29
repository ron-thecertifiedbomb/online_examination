import Exam from "../../common/models/exam.schema.js";

/**
 * Fetch an exam by its title from MongoDB.
 */
export const getExamByTitle = async (req, res) => {
  try {
    const { title } = req.params;

    // Query MongoDB instead of local JSON
    const exam = await Exam.findOne({ title });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Fetch all exams from MongoDB.
 */
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.json(exams);
  } catch (error) {
    console.error("Error fetching all exams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete an exam by its title.
 */
export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExam = await Exam.findOneAndDelete({ title: id });

    if (!deletedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json({ message: "Exam deleted successfully", id });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new exam entry in MongoDB.
 */
export const createExam = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ error: "Title and a valid questions array are required." });
    }

    const existingExam = await Exam.findOne({ title });
    if (existingExam) {
      return res
        .status(400)
        .json({ error: "An exam with this title already exists." });
    }

    const newExam = await Exam.create(req.body);
    res.status(201).json(newExam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update an existing exam in MongoDB.
 */
export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedExam = await Exam.findOneAndUpdate(
      { title: id },
      req.body,
      { new: true }, // Returns the modified document
    );

    if (!updatedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(updatedExam);
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

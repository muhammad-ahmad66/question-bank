// routes/questions.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().populate("createdBy courseId");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new question
router.post("/", async (req, res) => {
  const question = new Question({
    questionText: req.body.questionText,
    clo: req.body.clo,
    plo: req.body.plo,
    createdBy: req.body.createdBy,
    courseId: req.body.courseId,
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific question by ID
router.get("/:id", getQuestion, (req, res) => {
  res.json(res.question);
});

// Update a question
router.patch("/:id", getQuestion, async (req, res) => {
  if (req.body.questionText != null) {
    res.question.questionText = req.body.questionText;
  }
  if (req.body.clo != null) {
    res.question.clo = req.body.clo;
  }
  if (req.body.plo != null) {
    res.question.plo = req.body.plo;
  }
  if (req.body.difficulty != null) {
    res.question.difficulty = req.body.difficulty;
  }
  if (req.body.courseId != null) {
    res.question.courseId = req.body.courseId;
  }

  try {
    const updatedQuestion = await res.question.save();
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a question
router.delete("/:id", getQuestion, async (req, res) => {
  try {
    await res.question.remove();
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get question by ID
async function getQuestion(req, res, next) {
  let question;
  try {
    question = await Question.findById(req.params.id).populate(
      "createdBy courseId"
    );
    if (question == null) {
      return res.status(404).json({ message: "Cannot find question" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.question = question;
  next();
}

// ! GET all questions related to a specific course
router.get("/course/:courseId/questions", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const questions = await Question.find({ courseId });

    res.status(200).json({
      status: "success",
      data: {
        questions,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

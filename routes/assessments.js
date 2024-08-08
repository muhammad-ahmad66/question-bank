// routes/assessments.js
const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");
const mongoose = require("mongoose");

// Get all assessments
// router.get("/", async (req, res) => {
//   try {
//     const assessments = await Assessment.find().populate("courseId");
//     res.json(assessments);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Create a new assessment
router.post("/", async (req, res) => {
  const assessment = new Assessment({
    assessmentName: req.body.assessmentName,
    type: req.body.type,
    courseId: req.body.courseId,
    // startDate: req.body.startDate,
    // endDate: req.body.endDate,
    description: req.body.description,
  });

  try {
    const newAssessment = await assessment.save();
    res.status(201).json(newAssessment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific assessment by ID
router.get("/", async (req, res) => {
  try {
    const { courseId, type } = req.query;

    if (!courseId || !type) {
      return res
        .status(400)
        .json({ message: "Course ID and type are required" });
    }

    // Ensure courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    // Use find with both courseId and type to filter
    const assessments = await Assessment.find({ courseId, type }).populate(
      "courseId"
    );

    if (assessments.length === 0) {
      return res.status(404).json({
        message: "No assessments found for the given course and type",
      });
    }

    res.status(200).json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an assessment
router.delete("/:id", getAssessment, async (req, res) => {
  try {
    await res.assessment.remove();
    res.json({ message: "Assessment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get assessment by ID
async function getAssessment(req, res, next) {
  let assessment;
  try {
    assessment = await Assessment.findById(req.params.id).populate("courseId");
    if (assessment == null) {
      return res.status(404).json({ message: "Cannot find assessment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.assessment = assessment;
  next();
}
async function getAssessment(req, res, next) {
  let assessment;
  try {
    assessment = await Assessment.findById(req.params.id).populate("courseId");
    if (assessment == null) {
      return res.status(404).json({ message: "Cannot find assessment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.assessment = assessment;
  next();
}

module.exports = router;

// routes/assessments.js
const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");

// Get all assessments
router.get("/", async (req, res) => {
  try {
    const assessments = await Assessment.find().populate("courseId");
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new assessment
router.post("/", async (req, res) => {
  const assessment = new Assessment({
    assessmentName: req.body.assessmentName,
    type: req.body.type,
    courseId: req.body.courseId,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
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
router.get("/:id", getAssessment, (req, res) => {
  res.json(res.assessment);
});

// Update an assessment
router.patch("/:id", getAssessment, async (req, res) => {
  if (req.body.assessmentName != null) {
    res.assessment.assessmentName = req.body.assessmentName;
  }
  if (req.body.type != null) {
    res.assessment.type = req.body.type;
  }
  if (req.body.startDate != null) {
    res.assessment.startDate = req.body.startDate;
  }
  if (req.body.endDate != null) {
    res.assessment.endDate = req.body.endDate;
  }
  if (req.body.description != null) {
    res.assessment.description = req.body.description;
  }

  try {
    const updatedAssessment = await res.assessment.save();
    res.json(updatedAssessment);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

module.exports = router;

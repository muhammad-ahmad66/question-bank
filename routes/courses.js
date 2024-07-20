// routes/courses.js
const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const course = await Course.create({
      courseName: req.body.courseName,
      courseCode: req.body.courseCode,
      description: req.body.description,
      department: req.body.department,
      semester: req.body.semester,
      credits: req.body.credits,
    });

    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific course by ID
router.get("/:id", getCourse, (req, res) => {
  res.json(res.course);
});

// Update a course
router.patch("/:id", getCourse, async (req, res) => {
  if (req.body.courseName != null) {
    res.course.courseName = req.body.courseName;
  }
  if (req.body.description != null) {
    res.course.description = req.body.description;
  }
  if (req.body.department != null) {
    res.course.department = req.body.department;
  }
  if (req.body.semester != null) {
    res.course.semester = req.body.semester;
  }
  if (req.body.credits != null) {
    res.course.credits = req.body.credits;
  }

  try {
    const updatedCourse = await res.course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a course
// Route to delete a course
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get course by ID
async function getCourse(req, res, next) {
  let course;
  try {
    course = await Course.findById(req.params.id);
    if (course == null) {
      return res.status(404).json({ message: "Cannot find course" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.course = course;
  next();
}

module.exports = router;

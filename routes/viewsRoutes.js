const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
// const personController = require('../controllers/personController');
const User = require("../models/userModel");

const router = express.Router();

// router.get("/", viewsController.getHome);
router.get(
  "/create-course-form",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getCreateCourseForm
);

router.get(
  "/all-courses",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getAllCourses
);

router.get("/", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewsController.getSignupForm);
router.get("/logout", authController.logout);
// router.get("/me", authController.protect, viewsController.getAccount);
router.get("/home", authController.protect, viewsController.getHome);

// ! RENDERING ALL USER PAGE
router.get("/all-user", authController.protect, async (req, res) => {
  // getting course id from query
  const courseId = req.query.courseId;

  // getting all users
  // const users = await User.find();
  const users = await User.find().populate({
    path: "associatedCourse",
    select: "courseName courseCode credits", // Select only necessary fields
    // match: { _id: courseId }, // Optionally filter courses if needed
  });

  // console.log("USERS: ", users);
  // console.log("COURSE: ", courseId);

  res.render("all-users", {
    title: "All users",
    page: "All users",
    courseId,
    users,
  });
});

router.post("/assign-course", async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add courseId to associatedCourse array if it doesn't already exist
    if (!user.associatedCourse.includes(courseId)) {
      user.associatedCourse.push(courseId);
      await user.save({ validateBeforeSave: false });
    } else {
      throw new Error("Course already Assigned to this user");
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

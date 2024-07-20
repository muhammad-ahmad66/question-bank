const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
// const personController = require('../controllers/personController');

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
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/home", authController.protect, viewsController.getHome);

module.exports = router;

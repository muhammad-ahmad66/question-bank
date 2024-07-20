import "@babel/polyfill";
import axios from "axios";
import { showAlert } from "./alerts";
import { login, logout } from "./login";
import { signup } from "./signup";

import { updateSettings } from "./updateSettings";

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const logoutBtn = document.getElementById("logout-btn");

const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");

// ! Login
if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// ! SIGNUP FORM
if (signupForm)
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    signup(name, email, password, passwordConfirm);
  });

//  ! USER ACCOUNT DASHBOARD.
const navItems = document.querySelectorAll(".side-nav a");
const contentContainers = document.querySelectorAll(
  ".user-view__form-container"
);

// For update form
const updateFormContainer = document.getElementById("update-form-container");
const foundReports = document.getElementById("my-found-reports");
const updateBtn = document.querySelector(".update-button");

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    // console.log(event.target);

    // Remove active class from all nav items and content containers
    navItems.forEach((nav) =>
      nav.parentElement.classList.remove("side-nav--active")
    );
    contentContainers.forEach((container) =>
      container.classList.remove("active")
    );

    updateFormContainer.classList.remove("active");

    // Add active class to the clicked nav item
    const sectionId = event.target.getAttribute("data-section");
    document.getElementById(sectionId).classList.add("active");
    const target = event.target;
    event.target.parentElement.classList.add("side-nav--active");

    updateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(sectionId).classList.remove("active");
      // target.parentElement.classList.remove('side-nav--active');
      updateFormContainer.classList.add("active");
    });
  });
});

// ! CHANGE USER DATA(NAME, PASSWORD, PHOTO) FROM ACCOUNT PAGE
if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    console.log(form);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    updateSettings(form, "data");
  });

// ! CHANGE PASSWORD FORM FROM USER-ACCOUNT PAGE
if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save Password";

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

// ! CREATE COURSE
const fromCreateCourse = document.getElementById("from-create-course");
if (fromCreateCourse)
  fromCreateCourse.addEventListener("submit", (e) => {
    e.preventDefault();
    const courseName = document.getElementById("courseName").value;
    const courseCode = document.getElementById("courseCode").value;
    const description = document.getElementById("description").value;
    const department = document.getElementById("department").value;
    const semester = document.getElementById("semester").value;
    const credits = document.getElementById("credits").value;

    axios
      .post("/courses", {
        courseName,
        courseCode,
        description,
        department,
        semester,
        credits,
      })
      .then((response) => {
        console.log(response);
        showAlert("success", "Course created successfully!");
        document.getElementById("from-create-course").reset();
        window.location.assign("/all-courses");
      })
      .catch((error) => {
        console.error(error);
        showAlert("error", "Failed to create course!");
      });
  });

// ! DELETE COURSE
const deleteCourseBtn = document.querySelectorAll("#btn-delete-course");
if (deleteCourseBtn)
  deleteCourseBtn.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async (e) => {
      try {
        e.preventDefault();
        const courseId = deleteBtn.getAttribute("data-course-id");
        console.log(courseId);
        // Send a DELETE request to the API to delete the course
        await axios.delete(`/courses/${courseId}`);
        showAlert("success", "Course deleted successfully!");
        // Reload the page to reflect the changes
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });

// ! Sending Course Id to All User Page
const assignButtons = document.querySelectorAll("#btn-assign-to");
assignButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const courseId = event.target.getAttribute("data-course-id");
    window.location.href = `/all-user?courseId=${courseId}`;
  });
});

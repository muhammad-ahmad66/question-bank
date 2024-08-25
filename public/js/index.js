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

// ! Assigning User to Course
const btnAssignCourse = document.querySelectorAll(
  "#btn-course-assign-all-user"
);

btnAssignCourse.forEach(function (btn) {
  btn.addEventListener("click", async function (event) {
    event.preventDefault();
    const courseId = btn.getAttribute("data-course-id");
    const userId = btn.getAttribute("data-user-id");

    console.log("CourseId: ", courseId);
    console.log("UserId: ", userId);

    try {
      const response = await axios.post("/assign-course", {
        userId,
        courseId,
      });

      if (response.status === 200) {
        showAlert("success", "Course assigned successfully");
        window.location.reload(); // Refresh the page to reflect the changes
      } else {
      }
    } catch (error) {
      console.error("Error assigning course:", error);
      showAlert("error", error.response.data.message);
    }
  });
});

// ! ADD QUESTION
const addQuestionForm = document.getElementById("from-add-question");

if (addQuestionForm)
  addQuestionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const questionText = document.getElementById("questionText").value;
    const courseId = document.getElementById("courseIdForQuestion").value;
    const clo = document.getElementById("clo").value;
    const plo = document.getElementById("plo").value;
    // const difficulty = document.getElementById("difficulty").value;
    const marks = document.getElementById("marks").value;
    const userId = document.getElementById("btn-create-question").dataset
      .createdBy;

    try {
      const response = await axios.post("/questions", {
        questionText,
        courseId,
        clo,
        plo,
        // difficulty,
        marks,
        createdBy: userId,
      });

      if (response.status === 201) {
        showAlert("success", "Question added successfully!");
        document.getElementById("from-add-question").reset();
        window.location.reload(); // Refresh the page to reflect the changes
      } else {
        showAlert("error", "Failed to add question!");
      }
    } catch (err) {
      console.error("Error adding question:", err);
      showAlert("error", err.response.data.message);
    }
  });

// ! Fetching questions for a specific course
// Assuming you have a button to trigger the request and a way to get the courseId
const btnViewQuestion = document.querySelectorAll("#btn-view-question");

if (btnViewQuestion)
  btnViewQuestion.forEach(function (btn) {
    btn.addEventListener("click", async function () {
      const courseId = btn.dataset.courseId;

      try {
        const response = await axios.get(
          `/questions/course/${courseId}/questions`
        );

        if (response.status === 200) {
          // const questions = response.data.data.questions;
          // console.log("Questions:", questions);

          window.location.href = `/courses/${courseId}/questions`;

          // Handle the questions data (e.g., render them on the page)
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    });
  });

// ! GET ASSESSMENTS
const courseSelect = document.getElementById("courseId");
const typeSelect = document.getElementById("type");
const assessmentBody = document.getElementById("assessmentBody");
const noAssessmentsMessage = document.querySelector(".no-assessments-message");

function checkSelections() {
  return courseSelect.value !== "" && typeSelect.value !== "";
}

function displayAssessments(assessments) {
  // Clear previous assessments
  assessmentBody.innerHTML = "";

  if (assessments.length > 0) {
    noAssessmentsMessage.style.display = "none";
    assessments.forEach((assessment, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${assessment.assessmentName}</td>
        <td>${assessment.type}</td>
        <td>${assessment.courseId.courseName}</td>
        <td>
          <button data-assessment-id=${
            assessment._id
          } class="view-btn">View</button>
          <button class="download-btn">Download</button>
        </td>
      `;

      assessmentBody.appendChild(row);
    });
  } else {
    noAssessmentsMessage.style.display = "block";
  }
}

async function fetchAssessments(courseId, type) {
  try {
    noAssessmentsMessage.style.display = "none"; // Hide no results message initially

    const response = await axios.get(
      `/assessments?courseId=${courseId}&type=${type}`
    );

    displayAssessments(response.data);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    noAssessmentsMessage.style.display = "block";
    noAssessmentsMessage.textContent =
      "An error occurred while fetching assessments.";
  }
}

async function handleSelectionChange() {
  try {
    if (checkSelections()) {
      const courseId = courseSelect.value;
      const type = typeSelect.value;

      // Fetch assessments and handle the response
      await fetchAssessments(courseId, type);
    } else {
      // Clear previous results and hide no-results message
      assessmentBody.innerHTML = "";
      noAssessmentsMessage.style.display = "none";
    }
  } catch (error) {
    // Handle any errors that occur during the fetching process
    console.error("Error during selection change:", error);
    assessmentBody.innerHTML = ""; // Clear previous results
    noAssessmentsMessage.style.display = "block";
    noAssessmentsMessage.textContent =
      "An error occurred while processing your request. Please try again.";
  }
}

if (courseSelect) {
  courseSelect.addEventListener("change", handleSelectionChange);
}

if (typeSelect) {
  typeSelect.addEventListener("change", handleSelectionChange);
}

// ! ADD NEW ASSESSMENT
document.addEventListener("DOMContentLoaded", function () {
  const courseSelect = document.getElementById("courseId");
  const typeSelect = document.getElementById("type");
  const makeAssessmentBtn = document.getElementById("makeAssessment");

  // Function to update the button href based on selected course and type
  function updateButtonHref() {
    const courseId = courseSelect.value;
    const type = typeSelect.value;

    if (courseId && type) {
      makeAssessmentBtn.href = `/assessments/new?courseId=${courseId}&type=${type}`;
    } else {
      makeAssessmentBtn.href = "#"; // Default href when no courseId or type is selected
    }
  }

  // Update the button href when course or type changes
  courseSelect.addEventListener("change", updateButtonHref);
  typeSelect.addEventListener("change", updateButtonHref);

  // Initial update
  updateButtonHref();
});

document.addEventListener("DOMContentLoaded", function () {
  // Extract URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  console.log("URL Params: ", urlParams);
  const courseId = urlParams.get("courseId");
  const type = urlParams.get("type");

  console.log("Course Id: ", courseId);
  console.log("Type: ", type);

  // Set hidden fields if parameters are available
  if (courseId) {
    document.getElementById("hiddenCourseId").value = courseId;
  }
  if (type) {
    document.getElementById("hiddenType").value = type;
  }

  // Form validation on submit
  const assessmentFrom = document.getElementById("assessmentForm");
  if (assessmentFrom)
    assessmentFrom.addEventListener("submit", function (event) {
      const courseId = document.getElementById("hiddenCourseId").value.trim();
      const type = document.getElementById("hiddenType").value.trim();
      const assessmentName = document
        .getElementById("assessmentName")
        .value.trim();
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      const description = document.getElementById("description").value.trim();
      // const selectedQuestions = document.querySelectorAll(
      //   'input[name="questions"]:checked'
      // );
      const selectedQuestions = document.getElementById("questions").value;

      console.log("SELECTED QUESTIONS: ", selectedQuestions);
      // Validation checks
      if (!courseId || !type) {
        alert("Course ID and Assessment Type must be selected.");
        event.preventDefault();
        return;
      }

      if (!assessmentName) {
        alert("Assessment Name is required.");
        event.preventDefault();
        return;
      }

      if (!startDate) {
        alert("Start Date is required.");
        event.preventDefault();
        return;
      }

      if (!endDate) {
        alert("End Date is required.");
        event.preventDefault();
        return;
      }

      if (!description) {
        alert("Description is required.");
        event.preventDefault();
        return;
      }

      if (selectedQuestions.length === 0) {
        alert("At least one question must be selected.");
        event.preventDefault();
        return;
      }
    });

  // ! DOWNLOAD ASSESSMENT
  const downloadAssessment = document.getElementById("downloadButton");

  if (downloadAssessment)
    downloadAssessment.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;

      const content = document.getElementById("contentToConvert");
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("assessment.pdf");
      });
    });

  courseSelect.addEventListener("change", updateView);
  typeSelect.addEventListener("change", updateView);

  // !view button
  function updateView() {
    const viewButtons = document.querySelectorAll(".view-btn");
    console.log(viewButtons);
    if (viewButtons)
      viewButtons.forEach(function (btn) {
        btn.addEventListener("click", async function () {
          const assessmentId = btn.dataset.assessmentId;
          try {
            const url = `/assessments/${assessmentId}`;
            window.location.href = url;
          } catch (e) {}
        });
      });
  }
});

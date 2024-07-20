import axios from "axios";
import { showAlert } from "./alerts";

// const signupForm = document.getElementById("signup-form");

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const result = await axios({
      method: "POST",
      url: "http://127.0.0.1:900/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    showAlert("success", "Sign up successfully!");
    window.setTimeout(() => {
      location.assign("/home");
    }, 500);
    console.log(result);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

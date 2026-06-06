const loginEmail = document.getElementById("login-email-field");
const loginPassword = document.getElementById("login-password");
const loginSubmitBtn = document.querySelector(".login-page .confirm-btn");
const loginEmailError = document.getElementById("login-email-error");
const loginPasswordError = document.getElementById("login-password-error");

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.trim() === "") {
    return "Email kiriting";
  }
  if (!emailPattern.test(email.trim())) {
    return "Email formati noto'g'ri";
  }
  return "";
}

loginSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  loginEmailError.textContent = "";
  loginPasswordError.textContent = "";

  let isValid = true;

  const emailValidation = validateEmail(loginEmail.value);
  if (emailValidation) {
    loginEmailError.textContent = emailValidation;
    isValid = false;
  }

  if (loginPassword.value.trim() === "") {
    loginPasswordError.textContent = "Parol kiriting";
    isValid = false;
  }

  if (isValid) {
    console.log("Login bo'ladi");
  }
});
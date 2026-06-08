const nameField = document.getElementById("text-field");
const emailField = document.getElementById("reg-email-field");
const passwordField = document.getElementById("register-password");
const confirmField = document.getElementById("confirm-password");
const registerSubmitBtn = document.querySelector(".register-page .confirm-btn");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("reg-email-error");
const passwordError = document.getElementById("reg-password-error");
const confirmError = document.getElementById("confirm-error");

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

registerSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmError.textContent = "";

  let isValid = true;

  if (nameField.value.trim() === "") {
    nameError.textContent = "Full name kiriting";
    isValid = false;
  }

  const emailValidation = validateEmail(emailField.value);
  if (emailValidation) {
    emailError.textContent = emailValidation;
    isValid = false;
  }

  if (passwordField.value.length < 8) {
    passwordError.textContent =
      "Parol kamida 8 ta belgidan iborat bo'lishi kerak";
    isValid = false;
  }

  if (confirmField.value !== passwordField.value) {
    confirmError.textContent = "Parollar mos emas";
    isValid = false;
  }

  if (isValid) {
    console.log("Form yuboriladi");
  }
});



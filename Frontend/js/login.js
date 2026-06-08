const loginEmail = document.getElementById("login-email-field");
const loginPassword = document.getElementById("login-password");
const loginSubmitBtn = document.querySelector(".login-page .confirm-btn");
const loginEmailError = document.getElementById("login-email-error");
const loginPasswordError = document.getElementById("login-password-error");

const API_BASE = "http://127.0.0.1:8000/api";
let loginAttempts = 0;
let lockUntil = 0;

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

loginSubmitBtn.addEventListener("click", async (e) => {
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
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = "Yuklanmoqda..";

    const result = await loginAPI({
      login: loginEmail.value.trim(),
      password: loginPassword.value,
    });

    if (result.ok && result.data && result.data.access && result.data.refresh) {
      saveTokens(result.data.access, result.data.refresh);
      loginSubmitBtn.textContent = "Muvaffaqiyatli";
      setTimeout(() => {
        window.location.href = "/Frontend/dashboard.html";
      }, 1000);
    } else if (result.status === 0) {
      loginPasswordError.textContent = "Internet aloqasi yo'q.";
      loginSubmitBtn.disabled = false;
      loginSubmitBtn.textContent = "Login now";
    } else {
      loginAttempts++;
      if (loginAttempts >= 5) {
        lockUntil = Date.now() + 30000;
        loginPasswordError.textContent = "Juda ko'p urinish. 30 soniya kuting.";
        startCutdown();
      } else {
        loginEmailError.textContent = "Email yoki password noto'g'ri.";
      }
    }
    loginSubmitBtn.disabled = false;
    loginSubmitBtn.textContent = "Login now";
  }
  function startCutdown() {
    loginSubmitBtn.disabled = true;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        loginAttempts = 0;
        loginSubmitBtn.disabled = false;
        loginPasswordError.textContent = "";
        return;
      }
      loginPasswordError.textContent = `${remaining} soniyadan keyin urinib ko'ring...`;
    }, 1000);
  }
});

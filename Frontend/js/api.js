const API_BASE_URL = "http://127.0.0.1:8000/api";

// const API_BASE = "http://localhost:8000/api/register";
// const API_BASE = "http://localhost:8000/api/login";

function saveTokens(access, refresh) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function getAccessToken() {
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

function isLoggedIn() {
  return !!getAccessToken();
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();

  if (!refresh) {
    clearTokens();
    window.location.href = "/index.html";
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      return data.access;
    }

    clearTokens();
    window.location.href = "/index.html";
    return null;
  } catch {
    return null;
  }
}

async function apiRequest(method, url, data = null, auth = false) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    if (response.status === 401 && auth) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        const retry = await fetch(url, { ...config, headers });
        return {
          ok: retry.ok,
          status: retry.status,
          data: await retry.json(),
        };
      }
    }
    let responseData = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    }
    return {
      ok: response.ok,
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    console.error("Tarmoq xatosi:", error);
    return {
      ok: false,
      status: 0,
      data: null,
    };
  }
}

async function registerAPI(userData) {
  return await apiRequest(
    "POST",
    `${API_BASE}/auth/register/`,
    userData,
    false,
  );
}

async function loginAPI(credentials) {
  return await apiRequest(
    "POST",
    `${API_BASE}/auth/login/`,
    credentials,
    false,
  );
}

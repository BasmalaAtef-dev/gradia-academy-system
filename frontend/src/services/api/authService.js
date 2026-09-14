import { apiClient } from "./apiClient";

const SESSION_KEY = "gradia_session";

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function buildSession(loginData) {
  const claims = decodeJwtPayload(loginData.token) ?? {};

  return {
    userId: claims.sub ?? null,
    fullName: loginData.fullName,
    email: claims.email ?? null,
    role: loginData.role,
    token: loginData.token,
  };
}

export const authService = {
  async login({ email, password }) {
    const result = await apiClient.post("/Auth/login", { email, password });
    if (!result.success || !result.data) {
      return result;
    }

    const session = buildSession(result.data);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ...result, data: session };
  },

  async registerStudent({ fullName, email, password, dateOfBirth, phone, address }) {
    return apiClient.post("/Auth/register", {
      fullName,
      email,
      password,
      dateOfBirth,
      phone,
      address,
    });
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY);
    return { success: true, message: "Signed out.", data: null };
  },

  getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      const claims = decodeJwtPayload(session?.token);
      if (claims?.exp && Date.now() >= claims.exp * 1000) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;    } catch {
      return null;
    }
  },
};
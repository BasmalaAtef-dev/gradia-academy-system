import { apiClient } from "./apiClient";

const SESSION_KEY = "gradia_session";

/**
 * Decodes a JWT's payload WITHOUT verifying its signature.
 * Signature verification is the server's job — we only need to
 * read the claims (sub, email) that aren't included in LoginResponse.
 */
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
    // JWT auth is stateless — there's no server-side session to invalidate,
    // so logout is just clearing the locally stored token.
    localStorage.removeItem(SESSION_KEY);
    return { success: true, message: "Signed out.", data: null };
  },

  getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};
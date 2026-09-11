const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getToken() {
  try {
    const raw = localStorage.getItem("gradia_session");
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.token ?? null;
  } catch {
    return null;
  }
}

/**
 * Core request function. Always resolves to { success, message, data }
 * — same shape the mock services already return — so callers never
 * need to change based on whether they're hitting mock or real API.
 */
async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();

  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    // Backend unreachable, CORS failure, DNS issue, etc.
    return {
      success: false,
      message: "Network error — could not reach the server.",
      data: null,
    };
  }

  // Try to parse JSON regardless of status code, since the backend's
  // GlobalExceptionMiddleware and ServiceResponse wrapper return JSON
  // bodies even on 4xx/5xx.
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // No JSON body (e.g. 204 No Content, or an unexpected empty response)
    payload = null;
  }

  if (!response.ok) {
    return {
      success: false,
      message:
        payload?.message ??
        payload?.Message ??
        `Request failed with status ${response.status}.`,
      data: payload?.data ?? payload?.Data ?? null,
    };
  }

  if (payload === null) {
    return {
      success: true,
      message: "",
      data: null,
    };
  }

  // Normalize casing: backend serializes as camelCase by default in
  // ASP.NET Core (System.Text.Json), so this should already match
  // { success, message, data }. The PascalCase fallback below is a
  // safety net in case any endpoint's JSON options differ.
  return {
    success: payload.success ?? payload.Success ?? false,
    message: payload.message ?? payload.Message ?? "",
    data: payload.data ?? payload.Data ?? null,
  };
}

export const apiClient = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
};
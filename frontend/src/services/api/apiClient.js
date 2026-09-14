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

  function clearSessionAndRedirect() {
    localStorage.removeItem("gradia_session");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

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
    return {
      success: false,
      message: "Network error — could not reach the server.",
      data: null,
    };
  }


  if (response.status === 401) {
    clearSessionAndRedirect();
    return {
      success: false,
      message: "Your session has expired. Please sign in again.",
      data: null,
    };
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
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
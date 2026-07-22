"use client";

// =============================================================
//  Cliente HTTP centralizado para consumir el API Gateway
//  - Prefija todas las rutas con /gw (proxy de Next.js -> :3001)
//  - Adjunta el JWT (Authorization: Bearer) automaticamente
//  - Maneja respuestas 401 (token invalido/expirado)
// =============================================================

const TOKEN_KEY = "localeats-token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Realiza una peticion al API Gateway.
 * @param {string} path  Ruta del gateway (ej: "/products", "/auth/login")
 * @param {object} options  Opciones fetch (method, body, headers, auth)
 * @returns {Promise<any>}  JSON parseado
 */
export async function apiFetch(path, options = {}) {
  const { auth = true, headers = {}, body, ...rest } = options;

  const finalHeaders = { ...headers };
  let finalBody = body;

  // Serializar body a JSON si es un objeto plano
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  // Adjuntar token si la ruta lo requiere
  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`/gw${path}`, {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  // Token invalido o expirado -> limpiar sesion y redirigir
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("localeats-user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw new Error("Sesión expirada");
  }

  // Parsear respuesta
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (data && data.message) || `Error ${res.status} en la petición`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return data;
}

// Atajos por metodo HTTP
export const api = {
  get: (path, options) => apiFetch(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiFetch(path, { ...options, method: "POST", body }),
  patch: (path, body, options) =>
    apiFetch(path, { ...options, method: "PATCH", body }),
  put: (path, body, options) =>
    apiFetch(path, { ...options, method: "PUT", body }),
  delete: (path, options) =>
    apiFetch(path, { ...options, method: "DELETE" }),
};

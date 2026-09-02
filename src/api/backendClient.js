import { io } from "socket.io-client";

export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8787" : window.location.origin);
const TOKEN_KEY = "bharatkatha_token";

export function getBackendToken() { return localStorage.getItem(TOKEN_KEY); }
export function setBackendToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function clearBackendToken() { localStorage.removeItem(TOKEN_KEY); }

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const token = getBackendToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Backend request failed");
  return response.status === 204 ? null : response.json();
}

export const ownAuth = {
  async login(email, password) { const result = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }); setBackendToken(result.token); return result.user; },
  async register(email, password, name) { const result = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) }); setBackendToken(result.token); return result.user; },
  async me() { return (await apiFetch("/api/auth/me")).user; },
  logout() { clearBackendToken(); },
};

export function generateWithGemini(prompt, responseJsonSchema) {
  return apiFetch("/api/ai/generate", { method: "POST", body: JSON.stringify({ prompt, responseJsonSchema }) }).then((response) => response.result);
}

export function connectCommunityRealtime(onEvent) {
  const socket = io(API_URL, { auth: { token: getBackendToken() } });
  socket.on("community:post", onEvent);
  socket.emit("community:join");
  return () => socket.disconnect();
}
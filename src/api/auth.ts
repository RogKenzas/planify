export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: string;
};

type AuthResponse = {
  ok: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
};

const SESSION_KEY = "planify_session_token";

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const parseAuthResponse = async (res: Response) => {
  const data = (await res.json()) as AuthResponse;
  if (!res.ok || !data.ok) {
    throw new Error(data.message || "Erreur API");
  }
  return data;
};

export const sessionStorage = {
  getToken: () => localStorage.getItem(SESSION_KEY),
  setToken: (token: string) => localStorage.setItem(SESSION_KEY, token),
  clear: () => localStorage.removeItem(SESSION_KEY),
};

export const registerUser = async (payload: { username: string; email: string; password: string }) => {
  // const res = await fetch("/api/auth/register", {
  const res = await fetch("https://backend-planify-jsk6.onrender.com/api/auth/register", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res);
};

export const loginUser = async (payload: { identifier: string; password: string }) => {
  // const res = await fetch("/api/auth/login", {
  const res = await fetch("https://backend-planify-jsk6.onrender.com/api/auth/login", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return parseAuthResponse(res);
};

export const getCurrentSession = async () => {
  const token = sessionStorage.getToken();
  if (!token) return null;

  // const res = await fetch("/api/auth/session", {
  const res = await fetch("https://backend-planify-jsk6.onrender.com/api/auth/session", {
    headers: getHeaders(token),
  });

  if (res.status === 401) {
    sessionStorage.clear();
    return null;
  }

  const data = await parseAuthResponse(res);
  return data.user ?? null;
};

export const logoutUser = async () => {
  const token = sessionStorage.getToken();
  if (!token) return;
  await fetch("https://backend-planify-jsk6.onrender.com/api/auth/logout", {
    method: "POST",
    headers: getHeaders(token),
  });
  sessionStorage.clear();
};

export const checkAvailability = async (payload: { email?: string; username?: string }) => {
  const query = new URLSearchParams();
  if (payload.email) query.set("email", payload.email);
  if (payload.username) query.set("username", payload.username);
  const res = await fetch(`https://backend-planify-jsk6.onrender.com/api/auth/availability?${query.toString()}`);
  const data = await parseAuthResponse(res);
  return data as {
    ok: boolean;
    email: { checked: boolean; exists: boolean };
    username: { checked: boolean; exists: boolean };
  };
};

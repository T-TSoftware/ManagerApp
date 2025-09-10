const STORAGE_KEY = "auth_token";
const STORAGE_MODE =
  import.meta.env.VITE_AUTH_STORAGE === "session" ? "session" : "local";
const storage = STORAGE_MODE === "session" ? sessionStorage : localStorage;

export function getToken(): string | null {
  try {
    return storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    storage.setItem(STORAGE_KEY, token);
  } catch {}
}

export function clearToken(): void {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {}
}

const decode = (t: string) => {
  try {
    return JSON.parse(atob(t.split(".")[1]));
  } catch {
    return null;
  }
};

export function isExpired(token: string): boolean {
  const p = decode(token);
  const exp = typeof p?.exp === "number" ? p.exp : undefined;
  return exp ? exp * 1000 <= Date.now() : false;
}

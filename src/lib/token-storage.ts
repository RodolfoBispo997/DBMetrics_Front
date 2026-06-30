const TOKEN_KEY = "accessToken";

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveToken(token: string) {
  if (!isBrowser()) return;

  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  if (!isBrowser()) return null;

  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (!isBrowser()) return;

  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

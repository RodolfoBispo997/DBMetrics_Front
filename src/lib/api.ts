import axios from "axios";

import { env } from "./env";
import { getToken, removeToken } from "./token-storage";
import { clearQueryCache } from "./query-cache";

export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

let redirectingToLogin = false;

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginRequest =
      error.config?.method?.toLowerCase() === "post" &&
      error.config?.url === "/auth/login";

    const hasAuthenticatedSession = Boolean(getToken());

    if (status === 401 && hasAuthenticatedSession && !isLoginRequest) {
      removeToken();
      clearQueryCache();

      if (!redirectingToLogin && window.location.pathname !== "/login") {
        redirectingToLogin = true;
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

import axios from "axios";

import { env } from "./env";
import { getToken, removeToken } from "./token-storage";

export const api = axios.create({
  baseURL: env.apiUrl,
});

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

    if (status === 401 && !isLoginRequest) {
      removeToken();

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

import { env } from "./env";
import { getToken, removeToken, saveToken } from "./token-storage";
import { clearQueryCache } from "./query-cache";

export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

let redirectingToLogin = false;
let refreshPromise: Promise<string> | null = null;

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
};

type RefreshResponse = {
  accessToken: string;
};

function getRequestPath(config: InternalAxiosRequestConfig) {
  return config.url?.split("?")[0];
}

function clearSessionAndRedirect() {
  removeToken();
  clearQueryCache();

  if (
    typeof window !== "undefined" &&
    !redirectingToLogin &&
    window.location.pathname !== "/login"
  ) {
    redirectingToLogin = true;
    window.location.replace("/login");
  }
}

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .post<RefreshResponse>("/auth/refresh", undefined, {
        withCredentials: true,
      })
      .then(({ data }) => {
        if (typeof data.accessToken !== "string" || !data.accessToken.trim()) {
          throw new Error("Refresh response did not include an access token");
        }

        saveToken(data.accessToken);
        redirectingToLogin = false;
        return data.accessToken;
      })
      .catch((error: unknown) => {
        clearSessionAndRedirect();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  const isRefreshRequest =
    config.method?.toLowerCase() === "post" &&
    getRequestPath(config) === "/auth/refresh";

  if (token && !isRefreshRequest) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const isSuccessfulLogin =
      response.config.method?.toLowerCase() === "post" &&
      getRequestPath(response.config) === "/auth/login";

    if (isSuccessfulLogin) {
      redirectingToLogin = false;
    }

    return response;
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const config = error.config as RetriableRequestConfig | undefined;
    if (!config) return Promise.reject(error);

    const requestPath = getRequestPath(config);
    const isPost = config.method?.toLowerCase() === "post";

    if (isPost && requestPath === "/auth/login") {
      return Promise.reject(error);
    }

    if (isPost && requestPath === "/auth/refresh") {
      return Promise.reject(error);
    }

    if (!getToken()) return Promise.reject(error);

    if (isPost && requestPath === "/auth/logout") {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    if (config._authRetry) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    const currentToken = getToken();
    const requestToken = AxiosHeaders.from(config.headers).get("Authorization");

    config._authRetry = true;
    if (currentToken && requestToken && requestToken !== `Bearer ${currentToken}`) {
      config.headers = AxiosHeaders.from(config.headers);
      config.headers.set("Authorization", `Bearer ${currentToken}`);
      return api(config);
    }

    try {
      const accessToken = await refreshAccessToken();
      config.headers = AxiosHeaders.from(config.headers);
      config.headers.set("Authorization", `Bearer ${accessToken}`);
      return await api(config);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

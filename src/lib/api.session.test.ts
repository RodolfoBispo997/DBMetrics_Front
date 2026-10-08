import { AxiosError, AxiosHeaders, type AxiosAdapter } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { registerQueryClient } from "@/lib/query-cache";
import { removeToken, saveToken } from "@/lib/token-storage";

const initialAdapter = api.defaults.adapter;
let queryClient: QueryClient;
let redirects: ReturnType<typeof vi.fn>;
let requestConfigs: Array<{ url?: string; headers: AxiosHeaders }>;

function installLocation(pathname = "/dashboard") {
  redirects = vi.fn();
  vi.stubGlobal("window", {
    location: { pathname, replace: redirects },
  });
}

function unauthorizedAdapter(): AxiosAdapter {
  return async (config) => {
    requestConfigs.push({
      url: config.url,
      headers: AxiosHeaders.from(config.headers),
    });
    const response = {
      config,
      data: null,
      headers: new AxiosHeaders(),
      status: 401,
      statusText: "Unauthorized",
    };
    throw new AxiosError(
      "Unauthorized",
      "ERR_BAD_REQUEST",
      config,
      undefined,
      response,
    );
  };
}

describe("Axios auth session behavior", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    installLocation();
    queryClient = new QueryClient();
    queryClient.setQueryData(["retained"], "cached-value");
    registerQueryClient(queryClient);
    requestConfigs = [];
    api.defaults.adapter = async (config) => {
      requestConfigs.push({
        url: config.url,
        headers: AxiosHeaders.from(config.headers),
      });
      return {
        config,
        data: { ok: true },
        headers: new AxiosHeaders(),
        status: 200,
        statusText: "OK",
      };
    };
  });

  afterEach(() => {
    api.defaults.adapter = initialAdapter;
    removeToken();
    queryClient.clear();
    registerQueryClient(new QueryClient());
    vi.unstubAllGlobals();
  });

  it("usa cookies e envia o access token no header Authorization", async () => {
    saveToken("access-token");

    await api.get("/private/resource");

    expect(api.defaults.withCredentials).toBe(true);
    expect(requestConfigs[0]?.headers.get("Authorization")).toBe(
      "Bearer access-token",
    );
  });

  it("não encerra sessão nem limpa cache quando POST /auth/login retorna 401", async () => {
    saveToken("existing-token");
    api.defaults.adapter = unauthorizedAdapter();

    await expect(
      api.post("/auth/login", { email: "x", password: "bad" }),
    ).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(localStorage.getItem("accessToken")).toBe("existing-token");
    expect(queryClient.getQueryData(["retained"])).toBe("cached-value");
    expect(redirects).not.toHaveBeenCalled();
    expect(requestConfigs.every(({ url }) => url !== "/auth/refresh")).toBe(
      true,
    );
  });

  it("em 401 autenticado limpa sessão/cache e redireciona uma vez para login", async () => {
    saveToken("expired-token");
    api.defaults.adapter = unauthorizedAdapter();

    const results = await Promise.allSettled([
      api.get("/dashboard/overview"),
      api.get("/auth/me"),
    ]);

    expect(results.every((result) => result.status === "rejected")).toBe(true);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(queryClient.getQueryData(["retained"])).toBeUndefined();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(redirects).toHaveBeenCalledOnce();
    expect(redirects).toHaveBeenCalledWith("/login");
    expect(requestConfigs.every(({ url }) => url !== "/auth/refresh")).toBe(
      true,
    );
  });
});

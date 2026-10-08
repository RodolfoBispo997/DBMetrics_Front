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

function unauthorizedError(config: Parameters<AxiosAdapter>[0]) {
  const response = {
    config,
    data: null,
    headers: new AxiosHeaders(),
    status: 401,
    statusText: "Unauthorized",
  };
  return new AxiosError(
    "Unauthorized",
    "ERR_BAD_REQUEST",
    config,
    undefined,
    response,
  );
}

function successfulResponse(config: Parameters<AxiosAdapter>[0], data: unknown) {
  return {
    config,
    data,
    headers: new AxiosHeaders(),
    status: 200,
    statusText: "OK",
  };
}

describe("Axios auth session behavior", () => {
  beforeEach(async () => {
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

    await api.post("/auth/login", {});
    requestConfigs = [];
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

  it("renova o token em um 401 e repete a requisição original", async () => {
    saveToken("expired-token");
    let refreshUsesCredentials = false;
    api.defaults.adapter = async (config) => {
      requestConfigs.push({
        url: config.url,
        headers: AxiosHeaders.from(config.headers),
      });

      if (config.url === "/auth/refresh") {
        refreshUsesCredentials = config.withCredentials === true;
        return successfulResponse(config, { accessToken: "renewed-token" });
      }

      if (AxiosHeaders.from(config.headers).get("Authorization") === "Bearer expired-token") {
        throw unauthorizedError(config);
      }

      return successfulResponse(config, { resource: "loaded" });
    };

    await expect(api.get("/private/resource")).resolves.toMatchObject({
      data: { resource: "loaded" },
    });

    expect(localStorage.getItem("accessToken")).toBe("renewed-token");
    expect(requestConfigs.filter(({ url }) => url === "/auth/refresh")).toHaveLength(1);
    expect(requestConfigs.filter(({ url }) => url === "/private/resource")).toHaveLength(2);
    expect(requestConfigs.at(-1)?.headers.get("Authorization")).toBe(
      "Bearer renewed-token",
    );
    expect(
      requestConfigs.find(({ url }) => url === "/auth/refresh")?.headers.get("Authorization"),
    ).toBeUndefined();
    expect(refreshUsesCredentials).toBe(true);
    expect(redirects).not.toHaveBeenCalled();
  });

  it("compartilha uma única renovação entre respostas 401 concorrentes", async () => {
    saveToken("expired-token");
    let releaseRefresh!: () => void;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });

    api.defaults.adapter = async (config) => {
      requestConfigs.push({
        url: config.url,
        headers: AxiosHeaders.from(config.headers),
      });

      if (config.url === "/auth/refresh") {
        await refreshGate;
        return successfulResponse(config, { accessToken: "renewed-token" });
      }

      if (AxiosHeaders.from(config.headers).get("Authorization") === "Bearer expired-token") {
        throw unauthorizedError(config);
      }

      return successfulResponse(config, { resource: config.url });
    };

    const requests = Promise.all([
      api.get("/private/first"),
      api.get("/private/second"),
    ]);

    await vi.waitFor(() => {
      expect(requestConfigs.filter(({ url }) => url === "/private/first" || url === "/private/second")).toHaveLength(2);
      expect(requestConfigs.filter(({ url }) => url === "/auth/refresh")).toHaveLength(1);
    });
    releaseRefresh();

    const responses = await requests;
    expect(responses).toHaveLength(2);
    expect(requestConfigs.filter(({ url }) => url === "/auth/refresh")).toHaveLength(1);
    expect(localStorage.getItem("accessToken")).toBe("renewed-token");
  });

  it("se refresh falha com erro de servidor limpa token/cache e redireciona", async () => {
    saveToken("expired-token");
    api.defaults.adapter = async (config) => {
      requestConfigs.push({
        url: config.url,
        headers: AxiosHeaders.from(config.headers),
      });

      if (config.url === "/auth/refresh") {
        const response = {
          config,
          data: null,
          headers: new AxiosHeaders(),
          status: 503,
          statusText: "Service Unavailable",
        };
        throw new AxiosError(
          "Service Unavailable",
          "ERR_BAD_RESPONSE",
          config,
          undefined,
          response,
        );
      }

      throw unauthorizedError(config);
    };

    await expect(api.get("/private/resource")).rejects.toMatchObject({
      response: { status: 503 },
    });

    expect(requestConfigs.filter(({ url }) => url === "/auth/refresh")).toHaveLength(1);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(queryClient.getQueryData(["retained"])).toBeUndefined();
    expect(redirects).toHaveBeenCalledOnce();
    expect(redirects).toHaveBeenCalledWith("/login");
  });

  it("se refresh retorna 401 não entra em loop e encerra a sessão", async () => {
    saveToken("expired-token");
    api.defaults.adapter = unauthorizedAdapter();

    await expect(api.get("/dashboard/overview")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(requestConfigs.filter(({ url }) => url === "/auth/refresh")).toHaveLength(1);
    expect(requestConfigs).toHaveLength(2);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(queryClient.getQueryData(["retained"])).toBeUndefined();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(redirects).toHaveBeenCalledOnce();
    expect(redirects).toHaveBeenCalledWith("/login");
  });
});

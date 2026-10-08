import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import {
  getCurrentUser,
  login,
  logout,
  register,
  resendVerification,
  verifyEmail,
} from "./auth.service";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

describe("auth services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login envia credenciais para POST /auth/login e retorna accessToken", async () => {
    const request = { email: "user@example.com", password: "password-8" };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { accessToken: "access-token" } });

    await expect(login(request)).resolves.toEqual({ accessToken: "access-token" });
    expect(mockApi.post).toHaveBeenCalledWith("/auth/login", request);
  });

  it("cadastro envia name, email e password e retorna message", async () => {
    const request = {
      name: "Ana Silva",
      email: "ana@example.com",
      password: "password-8",
    };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { message: "Cadastro recebido" } });

    await expect(register(request)).resolves.toEqual({ message: "Cadastro recebido" });
    expect(mockApi.post).toHaveBeenCalledWith("/auth/register", request);
  });

  it("verifica e-mail por POST /auth/verify-email com token", async () => {
    const request = { token: "verification-token" };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { verified: true } });

    await expect(verifyEmail(request)).resolves.toEqual({ verified: true });
    expect(mockApi.post).toHaveBeenCalledWith("/auth/verify-email", request);
  });

  it("reenvia confirmação por POST /auth/resend-verification com e-mail", async () => {
    const request = { email: "ana@example.com" };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { message: "Solicitação recebida" } });

    await expect(resendVerification(request)).resolves.toEqual({ message: "Solicitação recebida" });
    expect(mockApi.post).toHaveBeenCalledWith("/auth/resend-verification", request);
  });

  it("faz logout por POST /auth/logout sem body e aceita 204", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ status: 204, data: undefined });

    await expect(logout()).resolves.toBeUndefined();
    expect(mockApi.post).toHaveBeenCalledOnce();
    expect(mockApi.post).toHaveBeenCalledWith("/auth/logout");
  });

  it("busca GET /auth/me e retorna os dados do usuário", async () => {
    const user = {
      userId: "user-123",
      email: "ana@example.com",
      role: "ADMIN" as const,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: user });

    await expect(getCurrentUser()).resolves.toEqual(user);
    expect(mockApi.get).toHaveBeenCalledWith("/auth/me");
  });
});

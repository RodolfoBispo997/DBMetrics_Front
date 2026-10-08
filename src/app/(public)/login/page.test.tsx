import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  loginMutation: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("sonner", () => ({
  toast: { error: mocks.toastError },
}));

vi.mock("@/features/auth/hooks/use-login", () => ({
  useLogin: () => ({ mutate: mocks.loginMutation, isPending: false }),
}));

import LoginPage from "./page";

function submitCredentials(email = "ana+contato@example.com") {
  fireEvent.change(screen.getByRole("textbox", { name: "E-mail" }), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: "senha-valida-8" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
}

function getMutationCallbacks() {
  return mocks.loginMutation.mock.calls[0]?.[1] as {
    onSuccess: (response: { accessToken: string }) => void;
    onError: (error: unknown) => void;
  };
}

function axiosError(status: number) {
  return Object.assign(new Error("request failed"), {
    isAxiosError: true,
    response: { status },
  });
}

describe("login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("em 401 informa credenciais inválidas sem salvar token ou navegar", async () => {
    render(<LoginPage />);
    submitCredentials();
    await waitFor(() => expect(mocks.loginMutation).toHaveBeenCalledOnce());

    act(() => getMutationCallbacks().onError(axiosError(401)));

    expect(mocks.toastError).toHaveBeenCalledWith("E-mail ou senha inválidos.");
    expect(window.localStorage.getItem("accessToken")).toBeNull();
    expect(mocks.replace).not.toHaveBeenCalledWith("/dashboard");
  });

  it("em 403 mostra confirmação pendente e link com e-mail codificado", async () => {
    render(<LoginPage />);
    submitCredentials();
    await waitFor(() => expect(mocks.loginMutation).toHaveBeenCalledOnce());

    act(() => getMutationCallbacks().onError(axiosError(403)));

    expect(screen.getByRole("alert").textContent).toMatch(
      /confirme seu e-mail/i,
    );
    expect(
      screen
        .getByRole("link", { name: "Reenviar e-mail de confirmação" })
        .getAttribute("href"),
    ).toBe("/verify-email?email=ana%2Bcontato%40example.com");
    expect(window.localStorage.getItem("accessToken")).toBeNull();
    expect(mocks.replace).not.toHaveBeenCalledWith("/dashboard");
  });

  it("em sucesso salva accessToken e redireciona para o dashboard", async () => {
    render(<LoginPage />);
    submitCredentials();
    await waitFor(() => expect(mocks.loginMutation).toHaveBeenCalledOnce());

    act(() => getMutationCallbacks().onSuccess({ accessToken: "access-token-value" }));

    expect(window.localStorage.getItem("accessToken")).toBe(
      "access-token-value",
    );
    expect(mocks.replace).toHaveBeenCalledWith("/dashboard");
  });
});

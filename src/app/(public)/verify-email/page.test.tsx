import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  search: "",
  verifyMutation: vi.fn(),
  resendMutation: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(mocks.search),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/hooks/use-verify-email", () => ({
  useVerifyEmail: () => ({ mutate: mocks.verifyMutation }),
}));

vi.mock("@/features/auth/hooks/use-resend-verification", () => ({
  useResendVerification: () => ({
    mutate: mocks.resendMutation,
    isPending: false,
    error: null,
    reset: vi.fn(),
  }),
}));

import VerifyEmailPage from "./page";

function getVerifyCallbacks() {
  return mocks.verifyMutation.mock.calls[0]?.[1] as {
    onSuccess: (response: { verified: true }) => void;
    onError: (error: unknown) => void;
  };
}

function getResendCallbacks() {
  return mocks.resendMutation.mock.calls[0]?.[1] as {
    onSuccess: (response: { message: string }) => void;
  };
}

function axiosError(status: number) {
  return Object.assign(new Error("request failed"), {
    isAxiosError: true,
    response: { status },
  });
}

describe("verify email page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.search = "";
  });

  it("com token chama verificação uma vez e apresenta sucesso", () => {
    mocks.search = "?token=valid-token&email=ignored%40example.com";
    render(<VerifyEmailPage />);

    expect(mocks.verifyMutation).toHaveBeenCalledOnce();
    expect(mocks.verifyMutation).toHaveBeenCalledWith(
      { token: "valid-token" },
      expect.any(Object),
    );

    act(() => getVerifyCallbacks().onSuccess({ verified: true }));

    expect(
      screen.getByRole("heading", { name: "E-mail confirmado" }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Ir para o login" })
        .getAttribute("href"),
    ).toBe("/login");
  });

  it("sem token e com e-mail não verifica automaticamente, permite editar e reenviar explicitamente", async () => {
    mocks.search = "?email=ana%40example.com";
    render(<VerifyEmailPage />);

    const emailInput = screen.getByRole("textbox", { name: "E-mail" });
    expect(mocks.verifyMutation).not.toHaveBeenCalled();
    expect((emailInput as HTMLInputElement).value).toBe("ana@example.com");

    fireEvent.change(emailInput, { target: { value: "alterado@example.com" } });
    expect(mocks.resendMutation).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "Reenviar confirmação" }),
    );
    await waitFor(() => expect(mocks.resendMutation).toHaveBeenCalledOnce());

    expect(mocks.resendMutation).toHaveBeenCalledWith(
      { email: "alterado@example.com" },
      expect.any(Object),
    );
    act(() =>
      getResendCallbacks().onSuccess({
        message: "Texto potencialmente identificador",
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Solicitação recebida" }),
    ).toBeTruthy();
    expect(
      screen.getByText(/se houver uma conta associada a este e-mail/i),
    ).toBeTruthy();
    expect(screen.queryByText("Texto potencialmente identificador")).toBeNull();
  });

  it("sem token e sem e-mail não chama verificação e deixa reenvio disponível", () => {
    render(<VerifyEmailPage />);

    expect(mocks.verifyMutation).not.toHaveBeenCalled();
    expect(
      (screen.getByRole("textbox", { name: "E-mail" }) as HTMLInputElement)
        .value,
    ).toBe("");
    expect(
      screen.getByRole("button", { name: "Reenviar confirmação" }),
    ).toBeTruthy();
  });

  it("em 400 apresenta link inválido e oferece reenvio", () => {
    mocks.search = "?token=expired-token";
    render(<VerifyEmailPage />);

    act(() => getVerifyCallbacks().onError(axiosError(400)));

    expect(
      screen.getByText("Este link é inválido, expirou ou já foi utilizado."),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Reenviar confirmação" }),
    ).toBeTruthy();
  });

  it("em 404 mostra indisponibilidade sem formulário de reenvio", () => {
    mocks.search = "?token=some-token";
    render(<VerifyEmailPage />);

    act(() => getVerifyCallbacks().onError(axiosError(404)));

    expect(
      screen.getByRole("heading", { name: "Verificação indisponível" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "A funcionalidade pública de verificação está indisponível.",
      ),
    ).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Reenviar confirmação" }),
    ).toBeNull();
    expect(screen.queryByRole("textbox", { name: "E-mail" })).toBeNull();
  });
});

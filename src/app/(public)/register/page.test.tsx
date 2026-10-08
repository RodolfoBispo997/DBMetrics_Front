import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  registerMutation: vi.fn(),
  toastError: vi.fn(),
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

vi.mock("@/features/auth/hooks/use-register", () => ({
  useRegister: () => ({ mutate: mocks.registerMutation, isPending: false }),
}));

import RegisterPage from "./page";

function fillRegistration() {
  fireEvent.change(screen.getByRole("textbox", { name: "Nome" }), {
    target: { value: "Ana Silva" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "E-mail" }), {
    target: { value: "ana@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: "senha-segura-8" },
  });
}

function submitRegistration() {
  fillRegistration();
  fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));
}

function getMutationCallbacks() {
  return mocks.registerMutation.mock.calls[0]?.[1] as {
    onSuccess: (response: { message: string }) => void;
  };
}

describe("register page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envia name, email e password no cadastro", async () => {
    render(<RegisterPage />);

    submitRegistration();
    await waitFor(() => expect(mocks.registerMutation).toHaveBeenCalledOnce());

    expect(mocks.registerMutation).toHaveBeenCalledWith(
      {
        name: "Ana Silva",
        email: "ana@example.com",
        password: "senha-segura-8",
      },
      expect.any(Object),
    );
  });

  it("após sucesso mostra confirmação persistente e remove a possibilidade de novo envio", async () => {
    render(<RegisterPage />);
    submitRegistration();
    await waitFor(() => expect(mocks.registerMutation).toHaveBeenCalledOnce());

    act(() => getMutationCallbacks().onSuccess({ message: "Solicitação recebida." }));

    expect(
      screen.getByRole("heading", { name: "Verifique seu e-mail" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        /sua conta só poderá acessar o sistema após a verificação/i,
      ),
    ).toBeTruthy();
    expect(screen.getByText("Solicitação recebida.")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Voltar para o login" })
        .getAttribute("href"),
    ).toBe("/login");
    expect(screen.queryByRole("button", { name: "Cadastrar" })).toBeNull();
    expect(screen.queryByRole("textbox", { name: "Nome" })).toBeNull();
  });
});

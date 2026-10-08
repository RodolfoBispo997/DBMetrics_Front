import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ replace: vi.fn(), getCurrentUser: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("@/features/auth/services/auth.service", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

import { AuthGuard } from "./auth-guard";

const currentUser = {
  userId: "user-1",
  email: "ana@example.com",
  role: "ADMIN" as const,
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function renderGuard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const view = render(
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <p>Private dashboard content</p>
      </AuthGuard>
    </QueryClientProvider>,
  );
  return { ...view, queryClient };
}

function axiosError(status: number) {
  return Object.assign(new Error("request failed"), {
    isAxiosError: true,
    response: { status },
  });
}

describe("AuthGuard session validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("sem token não renderiza conteúdo privado nem consulta /auth/me", async () => {
    renderGuard();

    expect(screen.queryByText("Private dashboard content")).toBeNull();
    expect(mocks.getCurrentUser).not.toHaveBeenCalled();
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/login"));
  });

  it("bloqueia durante carregamento e revalidação, liberando somente após sucesso", async () => {
    localStorage.setItem("accessToken", "valid-token");
    const firstRequest = deferred<typeof currentUser>();
    const secondRequest = deferred<typeof currentUser>();
    mocks.getCurrentUser
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);
    const { queryClient } = renderGuard();

    expect(screen.getByRole("status").textContent).toMatch(
      /validando sua sessão/i,
    );
    expect(screen.queryByText("Private dashboard content")).toBeNull();
    await waitFor(() => expect(mocks.getCurrentUser).toHaveBeenCalledOnce());

    await act(async () => {
      firstRequest.resolve(currentUser);
      await firstRequest.promise;
    });
    expect(await screen.findByText("Private dashboard content")).toBeTruthy();

    let refetchPromise!: Promise<void>;
    act(() => {
      refetchPromise = queryClient.refetchQueries({
        queryKey: ["auth", "me"],
        exact: true,
      });
    });
    await waitFor(() => expect(mocks.getCurrentUser).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("status").textContent).toMatch(
      /validando sua sessão/i,
    );
    expect(screen.queryByText("Private dashboard content")).toBeNull();

    await act(async () => {
      secondRequest.resolve(currentUser);
      await refetchPromise;
    });
    expect(await screen.findByText("Private dashboard content")).toBeTruthy();
  });

  it("mantém conteúdo privado bloqueado em erro não 401 e botão refaz a consulta", async () => {
    localStorage.setItem("accessToken", "valid-token");
    mocks.getCurrentUser
      .mockRejectedValueOnce(axiosError(403))
      .mockResolvedValueOnce(currentUser);
    renderGuard();

    const retryButton = await screen.findByRole("button", {
      name: "Tentar novamente",
    });
    expect(screen.queryByText("Private dashboard content")).toBeNull();
    fireEvent.click(retryButton);

    expect(await screen.findByText("Private dashboard content")).toBeTruthy();
    expect(mocks.getCurrentUser).toHaveBeenCalledTimes(2);
  });

  it("em 401 não libera o conteúdo e não inicia refresh", async () => {
    localStorage.setItem("accessToken", "expired-token");
    mocks.getCurrentUser.mockRejectedValueOnce(axiosError(401));
    renderGuard();

    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toMatch(
        /encerrando sua sessão/i,
      ),
    );

    expect(screen.queryByText("Private dashboard content")).toBeNull();
    expect(mocks.getCurrentUser).toHaveBeenCalledOnce();
    expect(mocks.replace).not.toHaveBeenCalledWith("/auth/refresh");
  });
});

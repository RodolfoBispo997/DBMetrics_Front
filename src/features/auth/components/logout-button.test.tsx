import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ replace: vi.fn(), mutateAsync: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("@/features/auth/hooks/use-logout", () => ({
  useLogout: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }),
}));

import { LogoutButton } from "./logout-button";

function renderLogoutButton() {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["private-data"], "cached");
  const view = render(
    <QueryClientProvider client={queryClient}>
      <LogoutButton />
    </QueryClientProvider>,
  );

  return { ...view, queryClient };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe("LogoutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.mutateAsync.mockResolvedValue(undefined);
    localStorage.setItem("accessToken", "current-token");
  });

  it("aguarda o logout remoto antes de limpar token/cache e navegar", async () => {
    const request = deferred<void>();
    mocks.mutateAsync.mockReturnValue(request.promise);
    const { queryClient } = renderLogoutButton();

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    expect(mocks.mutateAsync).toHaveBeenCalledOnce();
    expect(localStorage.getItem("accessToken")).toBe("current-token");
    expect(queryClient.getQueryData(["private-data"])).toBe("cached");
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(
      screen
        .getByRole("button", { name: "Saindo..." })
        .hasAttribute("disabled"),
    ).toBe(true);

    await act(async () => {
      request.resolve();
      await request.promise;
    });

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/login"));
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  });

  it("limpa token/cache e navega mesmo quando o logout remoto falha", async () => {
    mocks.mutateAsync.mockRejectedValueOnce(new Error("network details"));
    const { queryClient } = renderLogoutButton();

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/login"));
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  });

  it("não inicia chamadas concorrentes quando há cliques repetidos", async () => {
    const request = deferred<void>();
    mocks.mutateAsync.mockReturnValue(request.promise);
    renderLogoutButton();
    const button = screen.getByRole("button", { name: "Sair" });

    act(() => {
      button.click();
      button.click();
    });

    expect(mocks.mutateAsync).toHaveBeenCalledOnce();

    await act(async () => {
      request.resolve();
      await request.promise;
    });
  });
});

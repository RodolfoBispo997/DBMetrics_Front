import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  collect: vi.fn(),
  history: vi.fn(),
  alertExecutions: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  connection: {
    id: "connection-123",
    name: "Production",
    provider: "POSTGRESQL",
    host: "localhost",
    port: 5432,
    database: "app",
    username: "app",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
}));

vi.mock("../services/dashboard-metrics.service", () => ({
  dashboardMetricsService: { collect: mocks.collect, history: mocks.history },
}));
vi.mock("@/features/alerts/services/alerts.service", () => ({
  alertsService: { listExecutions: mocks.alertExecutions },
}));
vi.mock("sonner", () => ({ toast: { success: mocks.success, error: mocks.error } }));
vi.mock("@/features/database-connections/hooks/use-database-connection", () => ({
  useDatabaseConnection: () => ({ data: mocks.connection, isLoading: false, isError: false }),
}));
vi.mock("@/features/metrics/components/connection-metrics-summary", () => ({
  ConnectionMetricsSummary: () => null,
}));
vi.mock("@/features/metrics/components/connection-metrics-chart", () => ({
  ConnectionMetricsChart: () => null,
}));
vi.mock("@/features/metrics/components/connection-metrics-history", () => ({
  ConnectionMetricsHistory: () => null,
}));

import { ConnectionDetails } from "@/features/database-connections/components/connection-details";
import { metricsKeys } from "../constants/query-keys";
import { alertKeys } from "@/features/alerts/constants/query-keys";
import { useAlertExecutions } from "@/features/alerts/hooks/use-alert-executions";
import { useConnectionMetricsHistory } from "./use-connection-metrics-history";
import { useCollectConnectionMetrics } from "./use-collect-connection-metrics";

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
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

describe("manual metrics collection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading, disables the button and calls the endpoint with the connection ID", async () => {
    const request = deferred<unknown>();
    mocks.collect.mockReturnValueOnce(request.promise);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <ConnectionDetails connectionId="connection-123" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Coletar agora" }));

    await waitFor(() => expect(mocks.collect).toHaveBeenCalledWith("connection-123"));
    const loadingButton = screen.getByRole("button", { name: "Coletando..." });
    expect(loadingButton.hasAttribute("disabled")).toBe(true);

    await act(async () => request.resolve({}));
    await waitFor(() => expect(screen.getByRole("button", { name: "Coletar agora" })).toBeTruthy());
  });

  it("shows success and invalidates summary, chart and history after collection", async () => {
    mocks.collect.mockResolvedValueOnce({});
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    const { result } = renderHook(() => useCollectConnectionMetrics(), {
      wrapper: createWrapper(client),
    });

    await act(async () => result.current.mutateAsync("connection-123"));

    expect(mocks.success).toHaveBeenCalledWith("Métricas coletadas com sucesso.");
    await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(4));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: metricsKeys.summary("connection-123") });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: metricsKeys.chart("connection-123") });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [...metricsKeys.all, "history", "connection-123"],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [...alertKeys.executions(), "connection", "connection-123"],
    });
  });

  it("refetches alert executions and shows a new execution without a reload", async () => {
    const beforeCollection = {
      data: [{ id: "execution-1" }],
      meta: { page: 2, pageSize: 10, total: 1, totalPages: 1 },
    };
    const afterCollection = {
      data: [{ id: "execution-2" }, ...beforeCollection.data],
      meta: { page: 2, pageSize: 10, total: 2, totalPages: 1 },
    };
    mocks.alertExecutions
      .mockResolvedValueOnce(beforeCollection)
      .mockResolvedValueOnce(afterCollection);
    mocks.collect.mockResolvedValueOnce({});
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    const { result: executionsResult } = renderHook(
      () => useAlertExecutions("connection-123", 2, 10),
      { wrapper: createWrapper(client) },
    );
    await waitFor(() => expect(executionsResult.current.data?.data).toHaveLength(1));

    const { result: collectResult } = renderHook(() => useCollectConnectionMetrics(), {
      wrapper: createWrapper(client),
    });
    await act(async () => collectResult.current.mutateAsync("connection-123"));

    await waitFor(() => expect(executionsResult.current.data?.data[0].id).toBe("execution-2"));
    expect(mocks.alertExecutions).toHaveBeenCalledWith("connection-123", 2, 10);
  });

  it("refetches the current history page after collection without a reload", async () => {
    const beforeCollection = {
      connectionId: "connection-123",
      history: [{ id: "snapshot-1", collectedAt: "2026-01-01T00:00:00.000Z" }],
      pagination: { page: 2, limit: 20, total: 2, totalPages: 1 },
    };
    const afterCollection = {
      ...beforeCollection,
      history: [
        { id: "snapshot-2", collectedAt: "2026-01-02T00:00:00.000Z" },
        ...beforeCollection.history,
      ],
      pagination: { page: 2, limit: 20, total: 3, totalPages: 1 },
    };
    mocks.history.mockResolvedValueOnce(beforeCollection).mockResolvedValueOnce(afterCollection);
    mocks.collect.mockResolvedValueOnce({});
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    const { result: historyResult } = renderHook(
      () => useConnectionMetricsHistory("connection-123", { page: 2, limit: 20 }),
      { wrapper: createWrapper(client) },
    );
    await waitFor(() => expect(historyResult.current.data?.history).toHaveLength(1));

    const { result: collectResult } = renderHook(() => useCollectConnectionMetrics(), {
      wrapper: createWrapper(client),
    });
    await act(async () => collectResult.current.mutateAsync("connection-123"));

    await waitFor(() => expect(historyResult.current.data?.history[0].id).toBe("snapshot-2"));
    expect(mocks.history).toHaveBeenCalledWith("connection-123", { page: 2, limit: 20 });
  });

  it("shows an error toast and allows retrying the collection", async () => {
    mocks.collect.mockRejectedValueOnce(new Error("collection failed"));
    mocks.collect.mockResolvedValueOnce({});
    const client = new QueryClient();
    const { result } = renderHook(() => useCollectConnectionMetrics(), {
      wrapper: createWrapper(client),
    });

    await act(async () => {
      await expect(result.current.mutateAsync("connection-123")).rejects.toThrow("collection failed");
    });
    expect(mocks.error).toHaveBeenCalled();

    await act(async () => result.current.mutateAsync("connection-123"));
    expect(mocks.collect).toHaveBeenCalledTimes(2);
    expect(mocks.success).toHaveBeenCalledOnce();
  });
});

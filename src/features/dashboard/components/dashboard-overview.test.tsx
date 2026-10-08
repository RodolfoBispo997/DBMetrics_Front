import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardOverview } from "./dashboard-overview";

import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview";
import { DashboardOverviewResponse } from "@/features/dashboard/types/dashboard";

vi.mock("@/features/dashboard/hooks/use-dashboard-overview", () => ({
  useDashboardOverview: vi.fn(),
}));

const mockUseDashboardOverview = vi.mocked(useDashboardOverview);

const dashboardData: DashboardOverviewResponse = {
  summary: {
    totalConnections: 2,
    totalDatabaseSize: 2048,
    totalActiveConnections: 5,
    totalTables: 12,
    totalViews: 3,
    totalSchemas: 2,
    totalIndexes: 4,
    totalFunctions: 1,
  },
  connections: [
    {
      connectionId: "connection-1",
      name: "Analytics database",
      provider: "PostgreSQL",
      database: "analytics",
      lastMetric: null,
      health: null,
    },
  ],
};

function makeAxiosError(status: number) {
  return Object.assign(new Error("internal technical detail"), {
    isAxiosError: true,
    response: { status },
  });
}

describe("DashboardOverview", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDashboardOverview.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as unknown as ReturnType<typeof useDashboardOverview>);
  });

  it("shows loading feedback without rendering metrics", () => {
    mockUseDashboardOverview.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch,
    } as unknown as ReturnType<typeof useDashboardOverview>);

    render(<DashboardOverview />);

    expect(screen.getByRole("status").textContent).toContain(
      "Carregando os dados do dashboard...",
    );
    expect(screen.queryByText("Total Connections")).toBeNull();
  });

  it("renders the summary and connection data after success", () => {
    mockUseDashboardOverview.mockReturnValue({
      data: dashboardData,
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as unknown as ReturnType<typeof useDashboardOverview>);

    render(<DashboardOverview />);

    expect(screen.getByText("Total Connections")).toBeTruthy();
    expect(screen.getAllByText("Active Connections")).toHaveLength(2);
    expect(screen.getByText("Analytics database")).toBeTruthy();
    expect(screen.getByText("PostgreSQL")).toBeTruthy();
  });

  it("shows the existing empty state for a successful empty connections list", () => {
    mockUseDashboardOverview.mockReturnValue({
      data: {
        ...dashboardData,
        summary: { ...dashboardData.summary, totalConnections: 0 },
        connections: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch,
    } as unknown as ReturnType<typeof useDashboardOverview>);

    render(<DashboardOverview />);

    expect(screen.getByText("No database connections found.")).toBeTruthy();
    expect(screen.getByText("Total Connections")).toBeTruthy();
  });

  it("shows a generic recoverable error and retries the query", () => {
    mockUseDashboardOverview.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("internal technical detail"),
      refetch,
    } as unknown as ReturnType<typeof useDashboardOverview>);

    render(<DashboardOverview />);

    expect(screen.getByRole("alert").textContent).toContain(
      "Não foi possível carregar os dados do dashboard. Tente novamente.",
    );
    expect(screen.queryByText("internal technical detail")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(refetch).toHaveBeenCalledOnce();
  });

  it("shows unauthorized access without offering retry for 403", () => {
    mockUseDashboardOverview.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: makeAxiosError(403),
      refetch,
    } as unknown as ReturnType<typeof useDashboardOverview>);

    render(<DashboardOverview />);

    expect(screen.getByRole("alert").textContent).toContain(
      "Você não tem autorização para acessar os dados do dashboard.",
    );
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).toBeNull();
  });

  it("shows the transient expired-session state without local retry for 401", () => {
    mockUseDashboardOverview.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: makeAxiosError(401),
      refetch,
    } as unknown as ReturnType<typeof useDashboardOverview>);

    render(<DashboardOverview />);

    expect(screen.getByRole("status").textContent).toContain(
      "Sua sessão expirou. Redirecionando para o login...",
    );
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).toBeNull();
  });
});

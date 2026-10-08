"use client";

import axios from "axios";

import { DashboardOverviewCard } from "./dashboard-overview-card";
import { DashboardConnectionsList } from "./dashboard-connections-list";

import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview";
import { formatBytes } from "@/features/dashboard/utils/format-bytes";

export function DashboardOverview() {
  const { data, isLoading, isError, error, refetch } = useDashboardOverview();

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-dashed border-white/10 p-8 text-sm text-slate-400"
      >
        Carregando os dados do dashboard...
      </div>
    );
  }

  if (isError) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;

    if (status === 401) {
      return (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-dashed border-white/10 p-8 text-sm text-slate-400"
        >
          Sua sessão expirou. Redirecionando para o login...
        </div>
      );
    }

    const message =
      status === 403
        ? "Você não tem autorização para acessar os dados do dashboard."
        : "Não foi possível carregar os dados do dashboard. Tente novamente.";

    return (
      <div
        role="alert"
        className="rounded-lg border border-dashed border-red-500/30 p-8 text-sm text-red-300"
      >
        <p>{message}</p>
        {status !== 403 && (
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-md bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-dashed border-red-500/30 p-8 text-sm text-red-300"
      >
        Não foi possível carregar os dados do dashboard. Tente novamente.
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 block rounded-md bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { summary, connections } = data;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardOverviewCard
          title="Total Connections"
          value={summary.totalConnections}
        />

        <DashboardOverviewCard
          title="Database Size"
          value={formatBytes(summary.totalDatabaseSize)}
        />

        <DashboardOverviewCard
          title="Active Connections"
          value={summary.totalActiveConnections}
        />

        <DashboardOverviewCard title="Tables" value={summary.totalTables} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Connections</h3>

        <DashboardConnectionsList connections={connections} />
      </div>
    </div>
  );
}

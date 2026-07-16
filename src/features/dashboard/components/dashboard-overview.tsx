"use client";

import { DashboardOverviewCard } from "./dashboard-overview-card";
import { DashboardConnectionsList } from "./dashboard-connections-list";

import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview";
import { formatBytes } from "@/features/dashboard/utils/format-bytes";

export function DashboardOverview() {
  const { data, isLoading, error } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-white/10 p-8 text-sm text-slate-400">
        Loading overview...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-dashed border-red-500/30 p-8 text-sm text-red-400">
        Failed to load overview.
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

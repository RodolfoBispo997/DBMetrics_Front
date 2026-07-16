import { DashboardConnectionCard } from "./dashboard-connection-card";

import { DashboardConnection } from "@/features/dashboard/types/dashboard";

type DashboardConnectionsListProps = Readonly<{
  connections: DashboardConnection[];
}>;

export function DashboardConnectionsList({
  connections,
}: DashboardConnectionsListProps) {
  if (connections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/10 p-8 text-sm text-slate-400">
        No database connections found.
      </div>
    );
  }

  return (
    <div className="space-y-4" role="list">
      {connections.map((connection) => (
        <DashboardConnectionCard
          key={connection.connectionId}
          connection={connection}
        />
      ))}
    </div>
  );
}

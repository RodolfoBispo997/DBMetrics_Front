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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3" role="list">
      {connections.map((connection) => (
        <DashboardConnectionCard
          key={connection.connectionId}
          connection={connection}
        />
      ))}
    </div>
  );
}

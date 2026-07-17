import { formatBytes } from "@/features/dashboard/utils/format-bytes";
import { formatDate } from "@/features/dashboard/utils/format-date";

import { DashboardConnection } from "@/features/dashboard/types/dashboard";

type DashboardConnectionCardProps = Readonly<{
  connection: DashboardConnection;
}>;

export function DashboardConnectionCard({
  connection,
}: DashboardConnectionCardProps) {
  return (
    <div
      role="listitem"
      className="rounded-lg border border-white/10 bg-[#0b1020] p-6"
    >
      <div className="space-y-1">
        <p className="text-lg font-semibold text-white">{connection.name}</p>

        <p className="text-sm text-slate-400">{connection.provider}</p>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Database
          </dt>

          <dd className="mt-1 text-sm text-white">{connection.database}</dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Version
          </dt>

          <dd className="mt-1 text-sm text-white">
            {connection.lastMetric?.databaseVersion ?? "N/A"}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Database Size
          </dt>

          <dd className="mt-1 text-sm text-white">
            {connection.lastMetric
              ? formatBytes(connection.lastMetric.databaseSize)
              : "N/A"}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Active Connections
          </dt>

          <dd className="mt-1 text-sm text-white">
            {connection.lastMetric?.activeConnections ?? "N/A"}
          </dd>
        </div>

        <div className="md:col-span-2">
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Collected At
          </dt>

          <dd className="mt-1 text-sm text-white">
            {connection.lastMetric
              ? formatDate(connection.lastMetric.collectedAt)
              : "N/A"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

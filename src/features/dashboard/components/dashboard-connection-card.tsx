import Link from "next/link";
import { formatBytes } from "@/features/dashboard/utils/format-bytes";
import { formatDate } from "@/utils/format-date";

import { DashboardConnection } from "@/features/dashboard/types/dashboard";

type DashboardConnectionCardProps = Readonly<{
  connection: DashboardConnection;
}>;

export function DashboardConnectionCard({
  connection,
}: DashboardConnectionCardProps) {
  const healthStatus = connection.health?.status ?? null;
  const healthLabel =
    healthStatus === "ONLINE"
      ? "Healthy"
      : healthStatus === "WARNING"
      ? "Warning"
      : healthStatus === "CRITICAL"
      ? "Critical"
      : "No data";
  const healthClasses =
    healthStatus === "ONLINE"
      ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
      : healthStatus === "WARNING"
      ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
      : healthStatus === "CRITICAL"
      ? "text-red-300 bg-red-500/10 border-red-500/20"
      : "text-slate-400 bg-slate-500/10 border-white/10";

  return (
    <div
      role="listitem"
      className="rounded-lg border border-white/10 bg-[#0b1020] p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-white">{connection.name}</p>
          <p className="text-sm text-slate-400">{connection.provider}</p>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${healthClasses}`}
        >
          {healthLabel}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Last Collection
          </dt>

          <dd className="mt-1 text-sm text-white">
            {connection.lastMetric
              ? formatDate(connection.lastMetric.collectedAt)
              : "N/A"}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Link
          href={`/database-connections/${connection.connectionId}`}
          className="inline-flex rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          View details
        </Link>
      </div>
    </div>
  );
}

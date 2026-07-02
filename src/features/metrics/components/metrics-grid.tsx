import { DatabaseMetrics } from "../types/database-metrics";
import { formatBytes } from "../utils/format-bytes";
import { formatVersion } from "../utils/format-version";
import { MetricCard } from "./metric-card";

type Props = {
  metrics: DatabaseMetrics;
};

export function MetricsGrid({ metrics }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Database Version"
        value={formatVersion(metrics.databaseVersion)}
      />

      <MetricCard title="Tables" value={metrics.tablesCount} />

      <MetricCard title="Views" value={metrics.viewsCount} />

      <MetricCard title="Schemas" value={metrics.schemasCount} />

      <MetricCard title="Indexes" value={metrics.indexesCount} />

      <MetricCard title="Functions" value={metrics.functionsCount} />

      <MetricCard
        title="Database Size"
        value={formatBytes(metrics.databaseSize)}
      />

      <MetricCard
        title="Active Connections"
        value={metrics.activeConnections}
      />
    </div>
  );
}

import { DatabaseMetrics } from "../types/database-metrics";
import { formatBytes } from "../utils/format-bytes";
import { formatVersion } from "../utils/format-version";
import { HealthCard } from "./health-card";
import { MetricCard } from "./metric-card";

type Props = {
  metrics: DatabaseMetrics;
};

export function MetricsGrid({ metrics }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <div className="md:col-span-2">
        <HealthCard health={metrics.health} />
      </div>

      <MetricCard
        title="Database"
        value={formatVersion(metrics.databaseVersion)}
        description="Current version"
      />

      <MetricCard
        title="Tables"
        value={metrics.tablesCount}
        description="Database tables"
      />

      <MetricCard
        title="Indexes"
        value={metrics.indexesCount}
        description="Performance indexes"
      />

      <MetricCard
        title="Connections"
        value={metrics.activeConnections}
        description="Current sessions"
      />

      <MetricCard
        title="Database Size"
        value={formatBytes(metrics.databaseSize)}
        description="Used storage"
      />

      <MetricCard
        title="Schemas"
        value={metrics.schemasCount}
        description="Available schemas"
      />

      <MetricCard
        title="Functions"
        value={metrics.functionsCount}
        description="Stored functions"
      />

      <MetricCard
        title="Views"
        value={metrics.viewsCount}
        description="Database views"
      />
    </div>
  );
}

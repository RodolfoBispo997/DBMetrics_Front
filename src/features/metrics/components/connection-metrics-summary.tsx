"use client";

import { useConnectionMetricsSummary } from "../hooks/use-connection-metrics-summary";
import { MetricsSkeleton } from "./metrics-skeleton";
import { MetricsError } from "./metrics-error";
import { MetricCard } from "./metric-card";
import { formatBytes } from "../utils/format-bytes";
import { formatCollectedAt } from "../utils/format-collected-at";

type ConnectionMetricsSummaryProps = Readonly<{
  connectionId: string;
}>;

function renderGrowthLabel(value: number): string {
  const formattedValue = formatBytes(value);
  return `24h: ${value >= 0 ? "+" : ""}${formattedValue}`;
}

export function ConnectionMetricsSummary({ connectionId }: ConnectionMetricsSummaryProps) {
  const { data, isLoading, isError } = useConnectionMetricsSummary(connectionId);

  if (isLoading) {
    return <MetricsSkeleton />;
  }

  if (isError) {
    return <MetricsError />;
  }

  if (!data?.current) {
    return (
      <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">
          Metrics Summary
        </h2>
        <p className="mt-3 text-base text-foreground">No metrics collected yet.</p>
      </div>
    );
  }

  const { current, growth } = data;

  return (
    <section className="rounded-lg border border-border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Metrics Summary
        </h2>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Database Version: {current.databaseVersion}</p>
          <p>Collected At: {formatCollectedAt(current.collectedAt)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Database Size"
          value={formatBytes(current.databaseSize)}
          description={
            growth?.databaseSize != null
              ? renderGrowthLabel(growth.databaseSize)
              : undefined
          }
        />
        <MetricCard
          title="Active Connections"
          value={current.activeConnections}
          description={
            growth?.activeConnections != null
              ? `${growth.activeConnections >= 0 ? "+" : ""}${growth.activeConnections}`
              : undefined
          }
        />
        <MetricCard
          title="Tables"
          value={current.tablesCount}
          description={
            growth?.tablesCount != null
              ? `${growth.tablesCount >= 0 ? "+" : ""}${growth.tablesCount}`
              : undefined
          }
        />
        <MetricCard
          title="Views"
          value={current.viewsCount}
          description={
            growth?.viewsCount != null
              ? `${growth.viewsCount >= 0 ? "+" : ""}${growth.viewsCount}`
              : undefined
          }
        />
        <MetricCard
          title="Schemas"
          value={current.schemasCount}
          description={
            growth?.schemasCount != null
              ? `${growth.schemasCount >= 0 ? "+" : ""}${growth.schemasCount}`
              : undefined
          }
        />
        <MetricCard
          title="Indexes"
          value={current.indexesCount}
          description={
            growth?.indexesCount != null
              ? `${growth.indexesCount >= 0 ? "+" : ""}${growth.indexesCount}`
              : undefined
          }
        />
        <MetricCard
          title="Functions"
          value={current.functionsCount}
          description={
            growth?.functionsCount != null
              ? `${growth.functionsCount >= 0 ? "+" : ""}${growth.functionsCount}`
              : undefined
          }
        />
      </div>
    </section>
  );
}

"use client";

import type { ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useConnectionMetricsChart } from "../hooks/use-connection-metrics-chart";
import { MetricsSkeleton } from "./metrics-skeleton";
import { MetricsError } from "./metrics-error";
import { formatBytes } from "../utils/format-bytes";
import { formatChartDateShort, formatChartDateLong } from "../utils/format-chart-date";

type ConnectionMetricsChartProps = Readonly<{
  connectionId: string;
}>;

function renderTooltipLabel(label: ReactNode): ReactNode {
  if (typeof label === "string") {
    return formatChartDateLong(label);
  }

  return label;
}

function renderBytesTooltipValue(
  value: number | string | readonly (string | number)[] | null | undefined,
): ReactNode {
  if (typeof value === "number") {
    return formatBytes(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).join(", ");
  }

  return value ?? "";
}

export function ConnectionMetricsChart({ connectionId }: ConnectionMetricsChartProps) {
  const { data, isLoading, isError } = useConnectionMetricsChart(connectionId);

  const chartData = data?.series;
  const databaseSizeData = Array.isArray(chartData?.databaseSize)
    ? chartData.databaseSize
    : [];
  const activeConnectionsData = Array.isArray(chartData?.activeConnections)
    ? chartData.activeConnections
    : [];
  const hasDatabaseSize = databaseSizeData.length > 0;
  const hasActiveConnections = activeConnectionsData.length > 0;
  const isEmpty = !hasDatabaseSize && !hasActiveConnections;

  return (
    <section
      aria-labelledby="metrics-charts-heading"
      className="space-y-6"
    >
      <h2
        id="metrics-charts-heading"
        className="text-sm font-medium uppercase tracking-wider text-muted-foreground"
      >
        Metric Trends
      </h2>

      {isLoading ? (
        <MetricsSkeleton />
      ) : isError ? (
        <MetricsError />
      ) : isEmpty ? (
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <p className="text-base text-foreground">No chart data available.</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {hasDatabaseSize && (
            <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Database Size
              </h3>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={databaseSizeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="collectedAt" tickFormatter={formatChartDateShort} />
                    <YAxis tickFormatter={formatBytes} />
                    <Tooltip labelFormatter={renderTooltipLabel} formatter={renderBytesTooltipValue} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                      name="Database Size"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {hasActiveConnections && (
            <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Active Connections
              </h3>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeConnectionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="collectedAt" tickFormatter={formatChartDateShort} />
                    <YAxis allowDecimals={false} />
                    <Tooltip labelFormatter={renderTooltipLabel} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                      name="Active Connections"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

"use client";

import { useConnectionMetricsHistory } from "../hooks/use-connection-metrics-history";
import { MetricsSkeleton } from "./metrics-skeleton";
import { MetricsError } from "./metrics-error";
import { formatBytes } from "../utils/format-bytes";
import { formatCollectedAt } from "../utils/format-collected-at";

type ConnectionMetricsHistoryProps = Readonly<{
  connectionId: string;
}>;

export function ConnectionMetricsHistory({ connectionId }: ConnectionMetricsHistoryProps) {
  const HISTORY_LIMIT = 100;
  const { data, isLoading, isError } = useConnectionMetricsHistory(connectionId, {
    limit: HISTORY_LIMIT,
  });

  const historyItems = data?.history ?? [];
  const isEmpty = !isLoading && !isError && historyItems.length === 0;

  return (
    <section aria-labelledby="metrics-history-heading" className="space-y-4">
      <h2
        id="metrics-history-heading"
        className="text-sm font-medium uppercase tracking-wider text-muted-foreground"
      >
        History
      </h2>

      {isLoading ? (
        <MetricsSkeleton />
      ) : isError ? (
        <MetricsError />
      ) : isEmpty ? (
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <p className="text-base text-foreground">No history available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-background p-6 shadow-sm">
          <table className="min-w-full text-left text-sm text-foreground">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Collected At</th>
                <th scope="col" className="px-4 py-3">Database Size</th>
                <th scope="col" className="px-4 py-3">Active Connections</th>
                <th scope="col" className="px-4 py-3">Tables</th>
                <th scope="col" className="px-4 py-3">Views</th>
                <th scope="col" className="px-4 py-3">Schemas</th>
                <th scope="col" className="px-4 py-3">Indexes</th>
                <th scope="col" className="px-4 py-3">Functions</th>
                <th scope="col" className="px-4 py-3">Database Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historyItems.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatCollectedAt(item.collectedAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatBytes(item.databaseSize)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.activeConnections}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{item.tablesCount}</td>
                  <td className="whitespace-nowrap px-4 py-3">{item.viewsCount}</td>
                  <td className="whitespace-nowrap px-4 py-3">{item.schemasCount}</td>
                  <td className="whitespace-nowrap px-4 py-3">{item.indexesCount}</td>
                  <td className="whitespace-nowrap px-4 py-3">{item.functionsCount}</td>
                  <td className="whitespace-nowrap px-4 py-3">{item.databaseVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

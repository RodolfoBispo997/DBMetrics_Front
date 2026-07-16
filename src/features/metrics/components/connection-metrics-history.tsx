"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useConnectionMetricsHistory } from "../hooks/use-connection-metrics-history";
import { MetricsSkeleton } from "./metrics-skeleton";
import { MetricsError } from "./metrics-error";
import { formatBytes } from "../utils/format-bytes";
import { formatCollectedAt } from "../utils/format-collected-at";

type ConnectionMetricsHistoryProps = Readonly<{
  connectionId: string;
}>;

const HISTORY_LIMIT = 20;
const MAX_PAGE_BUTTONS = 5;

function getPageNumbers(page: number, totalPages: number) {
  if (totalPages <= MAX_PAGE_BUTTONS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(MAX_PAGE_BUTTONS / 2);
  let start = Math.max(1, page - half);
  let end = start + MAX_PAGE_BUTTONS - 1;

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - MAX_PAGE_BUTTONS + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function ConnectionMetricsHistory({ connectionId }: ConnectionMetricsHistoryProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useConnectionMetricsHistory(
    connectionId,
    {
      page,
      limit: HISTORY_LIMIT,
    },
  );

  const historyItems = data?.history ?? [];
  const totalPages = data?.pagination?.totalPages ?? 0;
  const pageNumbers = getPageNumbers(page, totalPages);
  const isEmpty = !isLoading && !isError && historyItems.length === 0;
  const isPageTransition = isFetching && !isLoading;

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

          {totalPages > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-foreground"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1 || isPageTransition}
                aria-label="Previous page"
              >
                Previous
              </Button>

              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === page ? "secondary" : "outline"}
                  size="sm"
                  className="text-foreground"
                  onClick={() => setPage(pageNumber)}
                  disabled={pageNumber === page || isPageTransition}
                  aria-current={pageNumber === page ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="text-foreground"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages || isPageTransition}
                aria-label="Next page"
              >
                Next
              </Button>

              {isPageTransition ? (
                <p className="text-sm text-muted-foreground">Loading page...</p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

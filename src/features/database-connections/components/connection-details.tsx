"use client";

import axios from "axios";
import { useDatabaseConnection } from "../hooks/use-database-connection";
import { PageHeader } from "@/components/page/page-header";
import { ConnectionMetricsSummary } from "@/features/metrics/components/connection-metrics-summary";
import { ConnectionMetricsChart } from "@/features/metrics/components/connection-metrics-chart";
import { ConnectionMetricsHistory } from "@/features/metrics/components/connection-metrics-history";

type ConnectionDetailsProps = Readonly<{
  connectionId: string;
}>;

export function ConnectionDetails({ connectionId }: ConnectionDetailsProps) {
  const { data, isLoading, isError, error } =
    useDatabaseConnection(connectionId);

  const isNotFound =
    axios.isAxiosError(error) && error.response?.status === 404;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connection Details"
        description="View database connection information."
      />

      {isLoading ? (
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <p className="text-base text-foreground">Loading connection details...</p>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <p className="text-base text-foreground">
            {isNotFound
              ? "Connection not found."
              : "Unable to load connection details."}
          </p>
        </div>
      ) : !data ? (
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <p className="text-base text-foreground">No connection data found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Name
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {data.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Provider
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {data.provider}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Host
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {data.host}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Port
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {data.port}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Database
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {data.database}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Username
                </dt>
                <dd className="text-base font-semibold text-foreground">
                  {data.username}
                </dd>
              </div>
            </dl>
          </div>

          <ConnectionMetricsSummary connectionId={connectionId} />
          <ConnectionMetricsChart connectionId={connectionId} />
          <ConnectionMetricsHistory connectionId={connectionId} />
        </div>
      )}
    </div>
  );
}

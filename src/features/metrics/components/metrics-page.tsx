"use client";

import { useDatabaseMetrics } from "../hooks/use-database-metrics";

import { MetricsGrid } from "./metrics-grid";
import { MetricsSkeleton } from "./metrics-skeleton";
import { MetricsError } from "./metrics-error";

type Props = {
  connectionId: string;
};

export function MetricsPage({ connectionId }: Props) {
  const { data, isLoading, isError } = useDatabaseMetrics(connectionId);

  if (isLoading) {
    return <MetricsSkeleton />;
  }

  if (isError || !data) {
    return <MetricsError />;
  }

  return <MetricsGrid metrics={data} />;
}

import { useQuery } from "@tanstack/react-query";

import { dashboardMetricsService } from "../services/dashboard-metrics.service";
import { ConnectionMetricsSummaryResponse } from "../types/connection-metrics";
import { metricsKeys } from "../constants/query-keys";

export function useConnectionMetricsSummary(connectionId: string) {
  return useQuery<ConnectionMetricsSummaryResponse>({
    queryKey: metricsKeys.summary(connectionId),
    queryFn: () => dashboardMetricsService.summary(connectionId),
    enabled: !!connectionId,
  });
}

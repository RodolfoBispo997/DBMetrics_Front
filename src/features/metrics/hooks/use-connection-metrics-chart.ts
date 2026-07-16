import { useQuery } from "@tanstack/react-query";

import { dashboardMetricsService } from "../services/dashboard-metrics.service";
import {
  ConnectionMetricsChartResponse,
  ConnectionMetricsChartParams,
} from "../types/connection-metrics";
import { metricsKeys } from "../constants/query-keys";

export function useConnectionMetricsChart(
  connectionId: string,
  params?: ConnectionMetricsChartParams,
) {
  return useQuery<ConnectionMetricsChartResponse>({
    queryKey: metricsKeys.chart(connectionId, params),
    queryFn: () => dashboardMetricsService.chart(connectionId, params),
    enabled: !!connectionId,
  });
}

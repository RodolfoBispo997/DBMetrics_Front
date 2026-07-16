import { useQuery, keepPreviousData, type UseQueryResult } from "@tanstack/react-query";

import { dashboardMetricsService } from "../services/dashboard-metrics.service";
import {
  ConnectionMetricsHistoryResponse,
  ConnectionMetricsHistoryParams,
} from "../types/connection-metrics";
import { metricsKeys } from "../constants/query-keys";

export function useConnectionMetricsHistory(
  connectionId: string,
  params?: ConnectionMetricsHistoryParams,
): UseQueryResult<ConnectionMetricsHistoryResponse, Error> {
  return useQuery<ConnectionMetricsHistoryResponse, Error>({
    queryKey: metricsKeys.history(connectionId, params),
    queryFn: () => dashboardMetricsService.history(connectionId, params),
    enabled: !!connectionId,
    placeholderData: keepPreviousData,
  });
}

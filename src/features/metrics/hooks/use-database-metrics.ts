import { useQuery } from "@tanstack/react-query";

import { metricsService } from "../services/metrics.service";
import { metricsKeys } from "../constants/query-keys";

export function useDatabaseMetrics(connectionId: string) {
  return useQuery({
    queryKey: metricsKeys.detail(connectionId),

    queryFn: () => metricsService.get(connectionId),

    enabled: !!connectionId,
  });
}

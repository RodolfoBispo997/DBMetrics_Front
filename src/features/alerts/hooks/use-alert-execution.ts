import { useQuery } from "@tanstack/react-query";

import { alertKeys } from "../constants/query-keys";
import { alertsService } from "../services/alerts.service";
import { AlertExecution } from "../types/alert";

export function useAlertExecution(executionId: string) {
  return useQuery<AlertExecution>({
    queryKey: alertKeys.executionDetail(executionId),
    queryFn: () => alertsService.getExecution(executionId),
    enabled: !!executionId,
  });
}

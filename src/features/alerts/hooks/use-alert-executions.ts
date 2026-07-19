import { useQuery } from "@tanstack/react-query";

import { alertKeys } from "../constants/query-keys";
import { alertsService } from "../services/alerts.service";
import { AlertExecution } from "../types/alert";

export function useAlertExecutions(connectionId: string) {
  return useQuery<AlertExecution[]>({
    queryKey: alertKeys.executionsByConnection(connectionId),
    queryFn: () => alertsService.listExecutions(connectionId),
    enabled: !!connectionId,
  });
}

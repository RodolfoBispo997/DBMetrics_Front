import { useQuery } from "@tanstack/react-query";

import { alertKeys } from "../constants/query-keys";
import { alertsService } from "../services/alerts.service";
import { AlertRule } from "../types/alert";

export function useAlertRules(connectionId: string) {
  return useQuery<AlertRule[]>({
    queryKey: alertKeys.rulesByConnection(connectionId),
    queryFn: () => alertsService.listRules(connectionId),
    enabled: !!connectionId,
  });
}

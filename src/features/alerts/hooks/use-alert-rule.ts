import { useQuery } from "@tanstack/react-query";

import { alertKeys } from "../constants/query-keys";
import { alertsService } from "../services/alerts.service";
import { AlertRule } from "../types/alert";

export function useAlertRule(alertRuleId: string) {
  return useQuery<AlertRule>({
    queryKey: alertKeys.ruleDetail(alertRuleId),
    queryFn: () => alertsService.getRule(alertRuleId),
    enabled: !!alertRuleId,
  });
}

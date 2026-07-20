import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/utils/get-error-message";

import { alertKeys } from "../constants/query-keys";
import { alertsService } from "../services/alerts.service";
import { AlertRuleStatusInput } from "../types/alert";

export function useDisableAlertRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AlertRuleStatusInput) =>
      alertsService.disableRule(input.alertRuleId),

    onSuccess(data, variables) {
      queryClient.invalidateQueries({
        queryKey: alertKeys.rulesByConnection(variables.databaseConnectionId),
      });
      queryClient.setQueryData(
        alertKeys.ruleDetail(variables.alertRuleId),
        data,
      );

      toast.success("Alert rule disabled successfully.");
    },

    onError(error) {
      toast.error(getErrorMessage(error));
    },
  });
}

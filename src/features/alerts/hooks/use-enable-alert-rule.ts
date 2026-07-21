import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/utils/get-error-message";

import { alertKeys } from "../constants/query-keys";
import { alertsService } from "../services/alerts.service";
import { AlertRuleStatusInput } from "../types/alert";

export function useEnableAlertRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AlertRuleStatusInput) =>
      alertsService.enableRule(input.alertRuleId),

    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: alertKeys.rulesByConnection(variables.databaseConnectionId),
      });
      toast.success("Alert rule enabled successfully.");
    },

    onError(error) {
      toast.error(getErrorMessage(error));
    },
  });
}

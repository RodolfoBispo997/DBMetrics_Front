import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/utils/get-error-message";

import { alertKeys } from "../constants/query-keys";
import { alertsService } from "../services/alerts.service";
import { CreateAlertRuleInput } from "../types/alert";

export function useCreateAlertRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAlertRuleInput) =>
      alertsService.createRule(input),

    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: alertKeys.rulesByConnection(variables.connectionId),
      });

      toast.success("Alert rule created successfully.");
    },

    onError(error) {
      toast.error(getErrorMessage(error));
    },
  });
}

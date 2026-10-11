import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/get-error-message";
import { metricsKeys } from "../constants/query-keys";
import { alertKeys } from "@/features/alerts/constants/query-keys";
import { dashboardMetricsService } from "../services/dashboard-metrics.service";
export function useCollectConnectionMetrics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: string) => dashboardMetricsService.collect(connectionId),
    async onSuccess(_data, connectionId) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: metricsKeys.summary(connectionId) }),
        queryClient.invalidateQueries({ queryKey: metricsKeys.chart(connectionId) }),
        queryClient.invalidateQueries({
          queryKey: [...metricsKeys.all, "history", connectionId],
        }),
        queryClient.invalidateQueries({
          queryKey: [...alertKeys.executions(), "connection", connectionId],
        }),
      ]);
      toast.success("Métricas coletadas com sucesso.");
    },
    onError(error) { toast.error(getErrorMessage(error)); },
  });
}

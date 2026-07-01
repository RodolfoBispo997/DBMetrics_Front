import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { databaseConnectionsService } from "../services/database-connections.service";
import { getErrorMessage } from "@/utils/get-error-message";

export function useTestDatabaseConnection() {
  return useMutation({
    mutationFn: (id: string) => databaseConnectionsService.test(id),

    onSuccess(data) {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },

    onError(error) {
      toast.error(getErrorMessage(error));
    },
  });
}

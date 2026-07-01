import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { databaseConnectionsService } from "../services/database-connections.service";
import { getErrorMessage } from "@/utils/get-error-message";

export function useCreateDatabaseConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: databaseConnectionsService.create,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["database-connections"],
      });

      toast.success("Connection created successfully.");
    },

    onError(error) {
      toast.error(getErrorMessage(error));
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { databaseConnectionsService } from "../services/database-connections.service";
import { databaseConnectionKeys } from "../constants/query-keys";
import { getErrorMessage } from "@/utils/get-error-message";

import { UpdateDatabaseConnectionDTO } from "../types/update-database-connection";

type UpdateDatabaseConnectionParams = {
  id: string;
  data: UpdateDatabaseConnectionDTO;
};

export function useUpdateDatabaseConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateDatabaseConnectionParams) =>
      databaseConnectionsService.update(id, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: databaseConnectionKeys.lists(),
      });

      toast.success("Connection updated successfully.");
    },

    onError(error) {
      toast.error(getErrorMessage(error));
    },
  });
}

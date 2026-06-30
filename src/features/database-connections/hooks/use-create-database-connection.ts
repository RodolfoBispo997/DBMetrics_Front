import { useMutation, useQueryClient } from "@tanstack/react-query";

import { databaseConnectionsService } from "../services/database-connections.service";
import { databaseConnectionKeys } from "../constants/query-keys";

export function useCreateDatabaseConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: databaseConnectionsService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: databaseConnectionKeys.lists(),
      });
    },
  });
}

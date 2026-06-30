import { useMutation, useQueryClient } from "@tanstack/react-query";

import { databaseConnectionsService } from "../services/database-connections.service";
import { databaseConnectionKeys } from "../constants/query-keys";

export function useDeleteDatabaseConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: databaseConnectionsService.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: databaseConnectionKeys.lists(),
      });
    },
  });
}

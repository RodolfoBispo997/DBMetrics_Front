import { useMutation } from "@tanstack/react-query";

import { databaseConnectionsService } from "../services/database-connections.service";

export function useTestDatabaseConnection() {
  return useMutation({
    mutationFn: databaseConnectionsService.test,
  });
}

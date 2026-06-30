import { useQuery } from "@tanstack/react-query";

import { databaseConnectionsService } from "../services/database-connections.service";
import { databaseConnectionKeys } from "../constants/query-keys";

export function useDatabaseConnections() {
  return useQuery({
    queryKey: databaseConnectionKeys.lists(),
    queryFn: () => databaseConnectionsService.list(),
  });
}

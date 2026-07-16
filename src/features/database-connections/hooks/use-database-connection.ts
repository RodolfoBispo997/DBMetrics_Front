import { useQuery } from "@tanstack/react-query";

import { databaseConnectionsService } from "../services/database-connections.service";
import { databaseConnectionKeys } from "../constants/query-keys";

export function useDatabaseConnection(connectionId: string) {
  return useQuery({
    queryKey: databaseConnectionKeys.detail(connectionId),
    queryFn: () => databaseConnectionsService.findById(connectionId),
    enabled: !!connectionId,
  });
}

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { alertKeys } from "../constants/query-keys";
import { alertsService } from "../services/alerts.service";
import { PaginatedAlertExecutions } from "../types/alert";

export function useAlertExecutions(
  connectionId: string,
  page: number,
  pageSize: number,
) {
  return useQuery<PaginatedAlertExecutions>({
    queryKey: alertKeys.executionsByConnection(connectionId, page, pageSize),
    queryFn: async () => {
      const response = await alertsService.listExecutions(
        connectionId,
        page,
        pageSize,
      );

      if (response.meta.totalPages > 0 && page > response.meta.totalPages) {
        return alertsService.listExecutions(
          connectionId,
          response.meta.totalPages,
          pageSize,
        );
      }

      return response;
    },
    enabled: !!connectionId,
    placeholderData: keepPreviousData,
  });
}

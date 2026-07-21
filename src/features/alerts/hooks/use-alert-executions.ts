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
    queryFn: () => alertsService.listExecutions(connectionId, page, pageSize),
    enabled: !!connectionId,
    placeholderData: keepPreviousData,
  });
}

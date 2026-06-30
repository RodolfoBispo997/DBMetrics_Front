import { useQuery } from "@tanstack/react-query";

import { getDashboardOverview } from "@/features/dashboard/services/dashboard.service";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: getDashboardOverview,
  });
}

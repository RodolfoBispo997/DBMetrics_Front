import { api } from "@/lib/api";
import { DashboardOverviewResponse } from "@/features/dashboard/types/dashboard";

export async function getDashboardOverview() {
  const response = await api.get<DashboardOverviewResponse>(
    "/dashboard/overview",
  );

  return response.data;
}

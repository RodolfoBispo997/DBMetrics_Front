import { api } from "@/lib/api";

import {
  ConnectionMetricsSummaryResponse,
  ConnectionMetricsChartResponse,
  ConnectionMetricsHistoryResponse,
  ConnectionMetricsChartParams,
  ConnectionMetricsHistoryParams,
} from "../types/connection-metrics";

export const dashboardMetricsService = {
  async summary(
    connectionId: string,
  ): Promise<ConnectionMetricsSummaryResponse> {
    const response = await api.get<ConnectionMetricsSummaryResponse>(
      `/dashboard/connections/${connectionId}/metrics-summary`,
    );

    return response.data;
  },

  async chart(
    connectionId: string,
    params?: ConnectionMetricsChartParams,
  ): Promise<ConnectionMetricsChartResponse> {
    const response = await api.get<ConnectionMetricsChartResponse>(
      `/dashboard/connections/${connectionId}/metrics-chart`,
      { params },
    );

    return response.data;
  },

  async history(
    connectionId: string,
    params?: ConnectionMetricsHistoryParams,
  ): Promise<ConnectionMetricsHistoryResponse> {
    const response = await api.get<ConnectionMetricsHistoryResponse>(
      `/dashboard/connections/${connectionId}/metrics-history`,
      { params },
    );

    return response.data;
  },
};

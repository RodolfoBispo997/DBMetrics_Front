import { api } from "@/lib/api";

import { DatabaseMetrics } from "../types/database-metrics";

export const metricsService = {
  async get(connectionId: string) {
    const response = await api.get<DatabaseMetrics>(
      `/database-connections/${connectionId}/metrics`,
    );
    return response.data;
  },
};

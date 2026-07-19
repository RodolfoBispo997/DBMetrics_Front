import { api } from "@/lib/api";

import { AlertExecution, AlertRule } from "../types/alert";

export const alertsService = {
  async getRule(alertRuleId: string): Promise<AlertRule> {
    const response = await api.get<AlertRule>(`/alerts/${alertRuleId}`);

    return response.data;
  },

  async listRules(connectionId: string): Promise<AlertRule[]> {
    const response = await api.get<AlertRule[]>(
      `/alerts/connection/${connectionId}`,
    );

    return response.data;
  },

  async getExecution(executionId: string): Promise<AlertExecution> {
    const response = await api.get<AlertExecution>(
      `/alerts/executions/${executionId}`,
    );

    return response.data;
  },

  async listExecutions(connectionId: string): Promise<AlertExecution[]> {
    const response = await api.get<AlertExecution[]>(
      `/alerts/connection/${connectionId}/executions`,
    );

    return response.data;
  },
};

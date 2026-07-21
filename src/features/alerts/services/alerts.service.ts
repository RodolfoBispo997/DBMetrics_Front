import { api } from "@/lib/api";

import {
  PaginatedAlertExecutions,
  AlertRule,
  CreateAlertRuleInput,
  UpdateAlertRuleInput,
} from "../types/alert";

export const alertsService = {
  async listRules(connectionId: string): Promise<AlertRule[]> {
    const response = await api.get<AlertRule[]>(
      `/alerts/connection/${connectionId}`,
    );

    return response.data;
  },

  async createRule(input: CreateAlertRuleInput): Promise<AlertRule> {
    const response = await api.post<AlertRule>("/alerts", input);

    return response.data;
  },

  async updateRule(
    alertRuleId: string,
    input: UpdateAlertRuleInput,
  ): Promise<AlertRule> {
    const response = await api.patch<AlertRule>(`/alerts/${alertRuleId}`, {
      metric: input.metric,
      operator: input.operator,
      threshold: input.threshold,
      channel: input.channel,
      destination: input.destination,
    });

    return response.data;
  },

  async enableRule(alertRuleId: string): Promise<AlertRule> {
    const response = await api.patch<AlertRule>(`/alerts/${alertRuleId}/enable`);

    return response.data;
  },

  async disableRule(alertRuleId: string): Promise<AlertRule> {
    const response = await api.patch<AlertRule>(`/alerts/${alertRuleId}/disable`);

    return response.data;
  },

  async deleteRule(alertRuleId: string): Promise<void> {
    await api.delete(`/alerts/${alertRuleId}`);
  },

  async listExecutions(
    connectionId: string,
    page: number,
    pageSize: number,
  ): Promise<PaginatedAlertExecutions> {
    const response = await api.get<PaginatedAlertExecutions>(
      `/alerts/connection/${connectionId}/executions`,
      { params: { page, pageSize } },
    );

    return response.data;
  },
};

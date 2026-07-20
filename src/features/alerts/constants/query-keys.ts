export const alertKeys = {
  all: ["alerts"] as const,

  rules: () => [...alertKeys.all, "rules"] as const,

  rulesByConnection: (connectionId: string) =>
    [...alertKeys.rules(), "connection", connectionId] as const,

  ruleDetails: () => [...alertKeys.rules(), "detail"] as const,

  ruleDetail: (alertRuleId: string) =>
    [...alertKeys.ruleDetails(), alertRuleId] as const,

  executions: () => [...alertKeys.all, "executions"] as const,

  executionsByConnection: (
    connectionId: string,
    page: number,
    pageSize: number,
  ) => [...alertKeys.executions(), "connection", connectionId, page, pageSize] as const,

  executionDetails: () => [...alertKeys.executions(), "detail"] as const,

  executionDetail: (executionId: string) =>
    [...alertKeys.executionDetails(), executionId] as const,
};

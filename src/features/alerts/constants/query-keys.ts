export const alertKeys = {
  all: ["alerts"] as const,

  rules: () => [...alertKeys.all, "rules"] as const,

  rulesByConnection: (connectionId: string) =>
    [...alertKeys.rules(), "connection", connectionId] as const,

  executions: () => [...alertKeys.all, "executions"] as const,

  executionsByConnection: (
    connectionId: string,
    page: number,
    pageSize: number,
  ) => [...alertKeys.executions(), "connection", connectionId, page, pageSize] as const,

};

export const metricsKeys = {
  all: ["metrics"] as const,
  summary: (connectionId: string) => [...metricsKeys.all, "summary", connectionId] as const,

  chart: (connectionId: string, params?: unknown) =>
    [...metricsKeys.all, "chart", connectionId, params] as const,

  history: (connectionId: string, params?: unknown) =>
    [...metricsKeys.all, "history", connectionId, params] as const,
};

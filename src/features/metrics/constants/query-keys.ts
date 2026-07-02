export const metricsKeys = {
  all: ["metrics"] as const,

  detail: (connectionId: string) => [...metricsKeys.all, connectionId] as const,
};

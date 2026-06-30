export const databaseConnectionKeys = {
  all: ["database-connections"] as const,

  lists: () => [...databaseConnectionKeys.all, "list"] as const,

  list: (filters?: unknown) =>
    [...databaseConnectionKeys.lists(), filters] as const,

  details: () => [...databaseConnectionKeys.all, "detail"] as const,

  detail: (id: string) => [...databaseConnectionKeys.details(), id] as const,
};

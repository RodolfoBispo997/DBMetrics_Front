export type DatabaseHealth = {
  status: "ONLINE" | "OFFLINE" | "WARNING" | "CRITICAL";
  message: string;
  checkedAt: string;
};

export type DatabaseMetrics = {
  databaseVersion: string;
  tablesCount: number;
  viewsCount: number;
  schemasCount: number;
  indexesCount: number;
  functionsCount: number;
  databaseSize: number;
  activeConnections: number;
  health: DatabaseHealth;
};

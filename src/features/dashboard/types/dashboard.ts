export interface DashboardSummary {
  totalConnections: number;
  totalDatabaseSize: number;
  totalActiveConnections: number;
  totalTables: number;
  totalViews: number;
  totalSchemas: number;
  totalIndexes: number;
  totalFunctions: number;
}

export interface DashboardConnectionMetric {
  databaseVersion: string;
  tablesCount: number;
  viewsCount: number;
  schemasCount: number;
  indexesCount: number;
  functionsCount: number;
  databaseSize: number;
  activeConnections: number;
  collectedAt: string;
}

export interface DashboardConnection {
  connectionId: string;
  name: string;
  provider: string;
  database: string;
  lastMetric: DashboardConnectionMetric;
}

export interface DashboardOverviewResponse {
  summary: DashboardSummary;
  connections: DashboardConnection[];
}

export interface DashboardSummary {
  totalConnections: number;
  totalDatabaseSize: number;
  totalActiveConnections: number;
}

export interface DashboardConnection {
  connectionId: string;
  name: string;
  provider: string;
  database: string;
  lastMetric: {
    databaseSize: number;
    activeConnections: number;
    collectedAt: string;
  } | null;
}

export interface DashboardOverviewResponse {
  summary: DashboardSummary;
  connections: DashboardConnection[];
}

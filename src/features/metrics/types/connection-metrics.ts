export type ConnectionMetricSnapshot = {
  databaseVersion: string;
  tablesCount: number;
  viewsCount: number;
  schemasCount: number;
  indexesCount: number;
  functionsCount: number;
  databaseSize: number;
  activeConnections: number;
  collectedAt: string;
};

export type ConnectionMetricGrowth = {
  databaseSize: number;
  tablesCount: number;
  viewsCount: number;
  schemasCount: number;
  indexesCount: number;
  functionsCount: number;
  activeConnections: number;
};

export type ConnectionMetricsSummaryResponse = {
  connectionId: string;
  current: ConnectionMetricSnapshot | null;
  growth: ConnectionMetricGrowth | null;
};

export type ConnectionMetricsChartPoint = {
  collectedAt: string;
  value: number;
};

export type ConnectionMetricsChartResponse = {
  connectionId: string;
  series: {
    databaseSize: ConnectionMetricsChartPoint[];
    activeConnections: ConnectionMetricsChartPoint[];
    tablesCount: ConnectionMetricsChartPoint[];
    viewsCount: ConnectionMetricsChartPoint[];
    schemasCount: ConnectionMetricsChartPoint[];
    indexesCount: ConnectionMetricsChartPoint[];
    functionsCount: ConnectionMetricsChartPoint[];
  };
};

export type ConnectionMetricsHistoryItem = {
  id: string;
  databaseVersion: string;
  tablesCount: number;
  viewsCount: number;
  schemasCount: number;
  indexesCount: number;
  functionsCount: number;
  databaseSize: number;
  activeConnections: number;
  collectedAt: string;
};

export type ConnectionMetricsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ConnectionMetricsHistoryResponse = {
  connectionId: string;
  history: ConnectionMetricsHistoryItem[];
  pagination: ConnectionMetricsPagination;
};

export type ConnectionMetricsChartParams = {
  startDate?: string;
  endDate?: string;
};

export type ConnectionMetricsHistoryParams = {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

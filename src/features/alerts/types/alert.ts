export type AlertMetric =
  | "DATABASE_SIZE"
  | "ACTIVE_CONNECTIONS"
  | "TABLES_COUNT"
  | "VIEWS_COUNT"
  | "SCHEMAS_COUNT"
  | "INDEXES_COUNT"
  | "FUNCTIONS_COUNT";

export type AlertOperator =
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "EQUAL"
  | "NOT_EQUAL";

export type AlertExecutionStatus = "PENDING" | "SENT" | "FAILED";

export type NotificationChannel = "WHATSAPP";

export type AlertRule = {
  id: string;
  databaseConnectionId: string;
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: number;
  channel: NotificationChannel;
  destination: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AlertExecution = {
  id: string;
  alertRuleId: string;
  databaseMetricId: string;
  databaseConnectionId: string;
  connectionName: string;
  databaseProvider: "MYSQL" | "POSTGRESQL";
  host: string;
  databaseName: string;
  port: number;
  metric: AlertMetric;
  operator: AlertOperator;
  metricValue: number;
  threshold: number;
  channel: NotificationChannel;
  destination: string;
  status: AlertExecutionStatus;
  errorMessage: string | null;
  triggeredAt: string;
  sentAt: string | null;
};

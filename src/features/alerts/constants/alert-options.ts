import {
  AlertExecutionStatus,
  AlertMetric,
  AlertOperator,
} from "../types/alert";

export const alertMetricLabels: Record<AlertMetric, string> = {
  DATABASE_SIZE: "Database Size",
  ACTIVE_CONNECTIONS: "Active Connections",
  TABLES_COUNT: "Tables Count",
  VIEWS_COUNT: "Views Count",
  SCHEMAS_COUNT: "Schemas Count",
  INDEXES_COUNT: "Indexes Count",
  FUNCTIONS_COUNT: "Functions Count",
};

export const alertOperatorLabels: Record<AlertOperator, string> = {
  GREATER_THAN: ">",
  GREATER_THAN_OR_EQUAL: ">=",
  LESS_THAN: "<",
  LESS_THAN_OR_EQUAL: "<=",
  EQUAL: "=",
  NOT_EQUAL: "!=",
};

export const alertExecutionStatusLabels: Record<AlertExecutionStatus, string> = {
  PENDING: "Pending",
  SENT: "Sent",
  FAILED: "Failed",
};

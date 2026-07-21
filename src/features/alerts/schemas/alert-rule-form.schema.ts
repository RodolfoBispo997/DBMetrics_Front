import { z } from "zod";

import { AlertMetric, AlertOperator } from "../types/alert";

const metrics = [
  "DATABASE_SIZE",
  "ACTIVE_CONNECTIONS",
  "TABLES_COUNT",
  "VIEWS_COUNT",
  "SCHEMAS_COUNT",
  "INDEXES_COUNT",
  "FUNCTIONS_COUNT",
] as const satisfies readonly AlertMetric[];

const operators = [
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
  "EQUAL",
  "NOT_EQUAL",
] as const satisfies readonly AlertOperator[];

export const alertRuleFormSchema = z.object({
  metric: z.enum(metrics, "Metric is required"),
  operator: z.enum(operators, "Operator is required"),
  threshold: z
    .number("Threshold must be a number")
    .finite("Threshold must be finite")
    .min(0, "Threshold must be greater than or equal to zero"),
  destination: z
    .string()
    .min(1, "WhatsApp destination is required")
    .regex(/^55\d{10,11}$/, "Use a 12 or 13 digit WhatsApp number starting with 55"),
});

export type AlertRuleFormData = z.infer<typeof alertRuleFormSchema>;

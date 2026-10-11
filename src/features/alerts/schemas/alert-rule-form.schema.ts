import { z } from "zod";

import { AlertMetric, AlertOperator, NotificationChannel } from "../types/alert";

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
  cooldownMinutes: z.number("Cooldown must be a number").int("Cooldown must be an integer").min(1, "Cooldown must be at least 1 minute").max(10080, "Cooldown must be at most 10080 minutes"),
  channel: z.enum(["EMAIL", "WHATSAPP"] satisfies readonly NotificationChannel[], "Channel is required"),
  destination: z.string().min(1, "Destination is required").max(254, "Destination must be at most 254 characters"),
}).superRefine((data, context) => {
  if (data.channel === "EMAIL" && !z.email().safeParse(data.destination).success) {
    context.addIssue({ code: "custom", path: ["destination"], message: "Enter a valid email address" });
  }
  if (data.channel === "WHATSAPP" && !/^55\d{10,11}$/.test(data.destination)) {
    context.addIssue({ code: "custom", path: ["destination"], message: "Use a 12 or 13 digit WhatsApp number starting with 55" });
  }
});

export type AlertRuleFormData = z.infer<typeof alertRuleFormSchema>;

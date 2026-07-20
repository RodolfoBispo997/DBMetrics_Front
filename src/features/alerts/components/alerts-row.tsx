"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertRule } from "@/features/alerts/types/alert";

const operatorLabel: Record<string, string> = {
  GREATER_THAN: ">",
  GREATER_THAN_OR_EQUAL: ">=",
  LESS_THAN: "<",
  LESS_THAN_OR_EQUAL: "<=",
  EQUAL: "=",
  NOT_EQUAL: "!=",
};

const metricLabel: Record<string, string> = {
  DATABASE_SIZE: "Database Size",
  ACTIVE_CONNECTIONS: "Active Connections",
  TABLES_COUNT: "Tables Count",
  VIEWS_COUNT: "Views Count",
  SCHEMAS_COUNT: "Schemas Count",
  INDEXES_COUNT: "Indexes Count",
  FUNCTIONS_COUNT: "Functions Count",
};

export function AlertsRow({ rule }: { rule: AlertRule }) {
  const op = operatorLabel[rule.operator] || rule.operator;
  const metric = metricLabel[rule.metric] || rule.metric;
  const channel = rule.channel === "WHATSAPP" ? "WhatsApp" : rule.channel;

  return (
    <TableRow>
      <TableCell>{metric}</TableCell>
      <TableCell>{op}</TableCell>
      <TableCell>{rule.threshold}</TableCell>
      <TableCell>{channel}</TableCell>
      <TableCell className="max-w-[28rem] truncate">{rule.destination}</TableCell>
      <TableCell>
        <Badge variant={rule.enabled ? "default" : "secondary"}>
          {rule.enabled ? "Yes" : "No"}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

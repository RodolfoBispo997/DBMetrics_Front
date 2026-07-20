"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertRule } from "@/features/alerts/types/alert";
import { alertMetricLabels, alertOperatorLabels } from "../constants/alert-options";

export function AlertsRow({ rule }: { rule: AlertRule }) {
  const op = alertOperatorLabels[rule.operator];
  const metric = alertMetricLabels[rule.metric];
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

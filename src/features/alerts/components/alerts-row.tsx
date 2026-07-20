"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertRule } from "@/features/alerts/types/alert";
import { alertMetricLabels, alertOperatorLabels } from "../constants/alert-options";
import { AlertStatusToggle } from "./alert-status-toggle";
import { DeleteAlertRuleDialog } from "./delete-alert-rule-dialog";
import { UpdateAlertRuleDialog } from "./update-alert-rule-dialog";

export function AlertsRow({ rule }: { rule: AlertRule }) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
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
      <TableCell>
        <Button variant="ghost" size="sm" onClick={() => setOpenEditDialog(true)}>
          Edit
        </Button>
        <AlertStatusToggle rule={rule} />
        <DeleteAlertRuleDialog rule={rule} />
        <UpdateAlertRuleDialog open={openEditDialog} onOpenChange={setOpenEditDialog} rule={rule} />
      </TableCell>
    </TableRow>
  );
}

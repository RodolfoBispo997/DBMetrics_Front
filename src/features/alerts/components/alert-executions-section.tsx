"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/format-date";

import {
  alertExecutionStatusLabels,
  alertMetricLabels,
  alertOperatorLabels,
} from "../constants/alert-options";
import { useAlertExecutions } from "../hooks/use-alert-executions";
import { AlertExecution, AlertExecutionStatus } from "../types/alert";
import { AlertExecutionsEmpty } from "./alert-executions-empty";
import { AlertExecutionsError } from "./alert-executions-error";
import { AlertExecutionsSkeleton } from "./alert-executions-skeleton";

type Props = {
  connectionId: string;
};

const statusVariants: Record<AlertExecutionStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  SENT: "default",
  FAILED: "destructive",
};

export function AlertExecutionsSection({ connectionId }: Props) {
  const { data, isLoading, isError } = useAlertExecutions(connectionId);

  if (isLoading) return <AlertExecutionsSkeleton />;
  if (isError) return <AlertExecutionsError />;
  if (!data || data.length === 0) return <AlertExecutionsEmpty />;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Metric Value</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Triggered At</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((execution) => (
              <AlertExecutionRow key={execution.id} execution={execution} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function AlertExecutionRow({ execution }: { execution: AlertExecution }) {
  return (
    <TableRow>
      <TableCell>
        <Badge variant={statusVariants[execution.status]}>
          {alertExecutionStatusLabels[execution.status]}
        </Badge>
      </TableCell>
      <TableCell>{alertMetricLabels[execution.metric]}</TableCell>
      <TableCell>{alertOperatorLabels[execution.operator]}</TableCell>
      <TableCell>{execution.metricValue}</TableCell>
      <TableCell>{execution.threshold}</TableCell>
      <TableCell className="max-w-56 truncate">{execution.destination}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(execution.triggeredAt)}</TableCell>
      <TableCell className="whitespace-nowrap">
        {execution.sentAt ? formatDate(execution.sentAt) : "—"}
      </TableCell>
      <TableCell className="max-w-72 truncate">{execution.errorMessage || "—"}</TableCell>
    </TableRow>
  );
}

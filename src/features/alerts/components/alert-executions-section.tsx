"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const PAGE_SIZE = 10;

export function AlertExecutionsSection({ connectionId }: Props) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useAlertExecutions(
    connectionId,
    page,
    PAGE_SIZE,
  );
  const executions = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 0;
  const currentPage = data?.meta.page ?? page;
  const isPageTransition = isFetching && !isLoading;

  if (data && totalPages > 0 && page > totalPages) {
    setPage(totalPages);
    return <AlertExecutionsSkeleton />;
  }

  if (isLoading) return <AlertExecutionsSkeleton />;
  if (isError) return <AlertExecutionsError />;
  if (!data || executions.length === 0) return <AlertExecutionsEmpty />;

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
            {executions.map((execution) => (
              <AlertExecutionRow key={execution.id} execution={execution} />
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <div className="flex items-center justify-between gap-4 border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1 || isPageTransition}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Page {currentPage} of {totalPages}{isPageTransition ? " · Loading..." : ""}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages || isPageTransition}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      )}
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

"use client";

import { DatabaseConnection } from "@/features/database-connections/types/database-connection";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useAlertRules } from "@/features/alerts";
import { AlertRule } from "@/features/alerts/types/alert";
import { AlertsSkeleton } from "./alerts-skeleton";
import { AlertsError } from "./alerts-error";
import { AlertsEmpty } from "./alerts-empty";
import { AlertsRow } from "./alerts-row";

type Props = {
  connections: DatabaseConnection[];
  selectedConnectionId: string;
  onSelectedConnectionIdChange: (connectionId: string) => void;
};

export function AlertsTable({
  connections,
  selectedConnectionId,
  onSelectedConnectionIdChange,
}: Props) {
  const effectiveConnectionId =
    selectedConnectionId || connections[0]?.id || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label
            htmlFor="alerts-connection-select"
            className="text-sm text-muted-foreground"
          >
            Connection
          </label>
          <Select
            value={effectiveConnectionId}
            onValueChange={onSelectedConnectionIdChange}
          >
            <SelectTrigger
              id="alerts-connection-select"
              className="min-w-[160px] sm:min-w-[220px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {connections.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <RulesList connectionId={effectiveConnectionId} />
    </div>
  );
}

function RulesList({ connectionId }: { connectionId: string }) {
  const { data, isLoading, isError } = useAlertRules(connectionId);

  if (isLoading) return <AlertsSkeleton />;
  if (isError) return <AlertsError />;
  if (!data || data.length === 0) return <AlertsEmpty />;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Enabled</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((rule: AlertRule) => (
              <AlertsRow key={rule.id} rule={rule} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

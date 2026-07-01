"use client";

import { Card } from "@/components/ui/card";
import { useDatabaseConnections } from "../hooks/use-database-connections";
import { DatabaseConnectionsHeader } from "./database-connections-header";
import { DatabaseConnectionsRow } from "./database-connections-row";
import { Table, TableBody } from "@/components/ui/table";
import { DatabaseConnectionsSkeleton } from "./database-connections-skeleton";
import { DatabaseConnectionsEmpty } from "./database-connections-empty";
import { DatabaseConnectionsError } from "./database-connections-error";

export function DatabaseConnectionsTable() {
  const { data, isLoading, isError } = useDatabaseConnections();

  if (isLoading) {
    return <DatabaseConnectionsSkeleton />;
  }

  if (isError) {
    return <DatabaseConnectionsError />;
  }

  if (!data?.length) {
    return <DatabaseConnectionsEmpty />;
  }

  return (
    <Card className="overflow-hidden">
      <Table className="w-full">
        <DatabaseConnectionsHeader />

        <TableBody>
          {data.map((connection) => (
            <DatabaseConnectionsRow
              key={connection.id}
              connection={connection}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

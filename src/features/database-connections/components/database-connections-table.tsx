"use client";

import { Card } from "@/components/ui/card";
import { useDatabaseConnections } from "../hooks/use-database-connections";
import { DatabaseConnectionsHeader } from "./database-connections-header";
import { DatabaseConnectionsRow } from "./database-connections-row";
import { Table, TableBody } from "@/components/ui/table";

export function DatabaseConnectionsTable() {
  const { data, isLoading, isError } = useDatabaseConnections();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load database connections.</p>;
  }

  if (!data?.length) {
    return <p>No database connections found.</p>;
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

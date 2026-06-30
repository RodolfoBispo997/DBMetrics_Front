import { TableCell, TableRow } from "@/components/ui/table";
import { DatabaseConnection } from "../types/database-connection";
import { DatabaseConnectionsActions } from "./database-connections-actions";

type DatabaseConnectionsRowProps = {
  connection: DatabaseConnection;
};

export function DatabaseConnectionsRow({
  connection,
}: DatabaseConnectionsRowProps) {
  return (
    <TableRow>
      <TableCell>{connection.name}</TableCell>
      <TableCell>{connection.provider}</TableCell>
      <TableCell>{connection.host}</TableCell>
      <TableCell>{connection.database}</TableCell>
      <TableCell>{connection.port}</TableCell>

      <TableCell>
        <DatabaseConnectionsActions connection={connection} />
      </TableCell>
    </TableRow>
  );
}

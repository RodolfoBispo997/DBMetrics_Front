import { CreateDatabaseConnectionDialog } from "./create-database-connection-dialog";

export function DatabaseConnectionsPageHeader() {
  return (
    <div className="flex items-end justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Database Connections</h1>

        <p className="text-muted-foreground">
          Manage your database connections.
        </p>
      </div>

      <CreateDatabaseConnectionDialog />
    </div>
  );
}

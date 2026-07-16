import { PageHeader } from "@/components/page/page-header";

import { CreateDatabaseConnectionDialog } from "./create-database-connection-dialog";

export function DatabaseConnectionsPageHeader() {
  return (
    <PageHeader
      title="Database Connections"
      description="Manage your database connections."
      actions={<CreateDatabaseConnectionDialog />}
    />
  );
}

import { DatabaseConnectionsPageHeader } from "@/features/database-connections/components/database-connections-page-header";
import { DatabaseConnectionsTable } from "@/features/database-connections/components/database-connections-table";

export default function DatabaseConnectionsPage() {
  return (
    <div className="space-y-6">
      <DatabaseConnectionsPageHeader />
      <DatabaseConnectionsTable />
    </div>
  );
}

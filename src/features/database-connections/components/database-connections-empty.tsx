import { DatabaseZap } from "lucide-react";

export function DatabaseConnectionsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <DatabaseZap className="mb-4 h-12 w-12 text-muted-foreground" />

      <h2 className="text-lg font-semibold">No database connections</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Create your first database connection to start monitoring your
        databases.
      </p>
    </div>
  );
}

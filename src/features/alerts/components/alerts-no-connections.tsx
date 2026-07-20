import { DatabaseZap } from "lucide-react";

export function AlertsNoConnections() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <DatabaseZap className="mb-4 h-12 w-12 text-muted-foreground" />

      <h2 className="text-lg font-semibold">No database connections</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Create a database connection to start using Alerts.
      </p>
    </div>
  );
}

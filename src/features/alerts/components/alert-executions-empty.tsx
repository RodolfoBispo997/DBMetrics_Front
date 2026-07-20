import { History } from "lucide-react";

export function AlertExecutionsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <History className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No alert executions</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Executions will appear when an alert rule is triggered.
      </p>
    </div>
  );
}

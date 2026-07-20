import { TriangleAlert } from "lucide-react";

export function AlertExecutionsError() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <TriangleAlert className="mb-4 h-12 w-12 text-red-500" />
      <h3 className="text-lg font-semibold">Failed to load alert executions.</h3>
      <p className="mt-2 text-sm text-muted-foreground">Please try again later.</p>
    </div>
  );
}

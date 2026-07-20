import { TriangleAlert } from "lucide-react";

export function AlertsError() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <TriangleAlert className="mb-4 h-12 w-12 text-red-500" />

      <h2 className="text-lg font-semibold">Failed to load alert rules</h2>

      <p className="mt-2 text-sm text-muted-foreground">Please try again later.</p>
    </div>
  );
}

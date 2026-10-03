import { Suspense } from "react";
import { ConnectionDetailsPageContent } from "./connection-details-page-content";

export default function ConnectionDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <p className="text-base text-foreground">Loading connection details...</p>
        </div>
      }
    >
      <ConnectionDetailsPageContent />
    </Suspense>
  );
}

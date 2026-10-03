"use client";

import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page/page-header";
import { ConnectionDetails } from "@/features/database-connections/components/connection-details";

export function ConnectionDetailsPageContent() {
  const connectionId = useSearchParams().get("connectionId");

  if (!connectionId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Connection Details"
          description="View database connection information."
        />
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <p className="text-base text-foreground">
            Connection ID is missing.
          </p>
        </div>
      </div>
    );
  }

  return <ConnectionDetails connectionId={connectionId} />;
}

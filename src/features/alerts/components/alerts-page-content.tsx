"use client";

import { useState } from "react";

import { AlertsPageHeader } from "./alerts-page-header";
import { AlertsTable } from "./alerts-table";
import { CreateAlertRuleDialog } from "./create-alert-rule-dialog";
import { useDatabaseConnections } from "@/features/database-connections/hooks/use-database-connections";
import { AlertsConnectionsLoading } from "./alerts-connections-loading";
import { AlertsConnectionsError } from "./alerts-connections-error";
import { AlertsNoConnections } from "./alerts-no-connections";
import { AlertExecutionsSection } from "./alert-executions-section";

export function AlertsPageContent() {
  const {
    data: connections,
    isLoading: isLoadingConnections,
    isError: isErrorConnections,
  } = useDatabaseConnections();

  const [selectedConnectionId, setSelectedConnectionId] = useState<string>("");

  if (isLoadingConnections) return <AlertsConnectionsLoading />;
  if (isErrorConnections) return <AlertsConnectionsError />;
  if (!connections || connections.length === 0) return <AlertsNoConnections />;

  const effectiveConnectionId =
    selectedConnectionId || connections[0]?.id || "";

  return (
    <div className="space-y-8">
      <AlertsPageHeader
        actions={
          <CreateAlertRuleDialog connectionId={effectiveConnectionId} />
        }
      />

      <section aria-labelledby="alerts-list" className="space-y-4">
        <header>
          <h2 id="alerts-list" className="text-lg font-semibold text-white">
            Alert Rules
          </h2>
        </header>

        <AlertsTable
          connections={connections}
          selectedConnectionId={selectedConnectionId}
          onSelectedConnectionIdChange={setSelectedConnectionId}
        />
      </section>

      <section aria-labelledby="alert-executions" className="space-y-4">
        <header>
          <h2 id="alert-executions" className="text-lg font-semibold text-white">
            Execution History
          </h2>
        </header>

        <AlertExecutionsSection connectionId={effectiveConnectionId} />
      </section>
    </div>
  );
}

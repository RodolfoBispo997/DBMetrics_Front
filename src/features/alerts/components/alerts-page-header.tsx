import { ReactNode } from "react";
import { PageHeader } from "@/components/page/page-header";

type AlertsPageHeaderProps = {
  actions?: ReactNode;
};

export function AlertsPageHeader({ actions }: AlertsPageHeaderProps) {
  return (
    <PageHeader
      title="Alerts"
      description="View alert rules for your database connections."
      actions={actions}
    />
  );
}

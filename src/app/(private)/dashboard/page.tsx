"use client";

import { PageHeader } from "@/components/page/page-header";

import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Monitor your database connections and metrics."
      />

      <section aria-labelledby="overview-section" className="space-y-4">
        <header>
          <h2
            id="overview-section"
            className="text-lg font-semibold text-white"
          >
            Overview
          </h2>
        </header>

        <DashboardOverview />
      </section>

    </div>
  );
}

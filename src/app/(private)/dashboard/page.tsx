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

      <section aria-labelledby="metrics-section" className="space-y-4">
        <header>
          <h2 id="metrics-section" className="text-lg font-semibold text-white">
            Metrics
          </h2>
        </header>

        <div className="rounded-lg border border-dashed border-white/10 p-8 text-sm text-slate-400">
          Área reservada para métricas e gráficos.
        </div>
      </section>

      <section aria-labelledby="alerts-section" className="space-y-4">
        <header>
          <h2 id="alerts-section" className="text-lg font-semibold text-white">
            Alerts
          </h2>
        </header>

        <div className="rounded-lg border border-dashed border-white/10 p-8 text-sm text-slate-400">
          Área reservada para alertas recentes.
        </div>
      </section>
    </div>
  );
}

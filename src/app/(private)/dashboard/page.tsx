"use client";

import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardOverview();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro.</p>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

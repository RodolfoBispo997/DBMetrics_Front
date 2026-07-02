import { MetricsPage } from "@/features/metrics/components/metrics-page";

type Props = {
  params: Promise<{
    connectionId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { connectionId } = await params;

  return <MetricsPage connectionId={connectionId} />;
}

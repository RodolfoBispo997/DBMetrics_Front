import { ConnectionDetails } from "@/features/database-connections/components/connection-details";

type Props = Readonly<{
  params: Promise<{
    connectionId: string;
  }>;
}>;

export default async function ConnectionDetailsPage({ params }: Props) {
  const resolvedParams = await params;

  return <ConnectionDetails connectionId={resolvedParams.connectionId} />;
}

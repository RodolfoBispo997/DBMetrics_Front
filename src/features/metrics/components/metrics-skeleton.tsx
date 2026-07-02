import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="p-6 space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-20" />
        </Card>
      ))}
    </div>
  );
}

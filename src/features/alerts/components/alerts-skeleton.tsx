import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AlertsSkeleton() {
  return (
    <Card className="overflow-hidden p-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

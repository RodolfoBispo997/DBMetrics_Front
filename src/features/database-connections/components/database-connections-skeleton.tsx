import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DatabaseConnectionsSkeleton() {
  return (
    <Card className="overflow-hidden p-4">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-6 items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

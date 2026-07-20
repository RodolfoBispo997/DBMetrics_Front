import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AlertExecutionsSkeleton() {
  return (
    <Card className="overflow-hidden p-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-8 items-center gap-4">
            {Array.from({ length: 8 }).map((__, columnIndex) => (
              <Skeleton key={columnIndex} className="h-5 w-24" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

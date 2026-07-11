import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseHealth } from "../types/database-metrics";
import { getHealthStatus } from "../utils/health";

type Props = {
  health: DatabaseHealth;
};

export function HealthCard({ health }: Props) {
  const status = getHealthStatus(health.status);

  const Icon = status.icon;
  const date = new Date(health.checkedAt);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
          Database Health
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <Icon className={`h-6 w-6 shrink-0 ${status.color}`} />

          <div>
            <p className="text-2xl font-semibold tracking-tight">
              {status.title}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {status.description}
            </p>
          </div>
        </div>

        <div className="border-t pt-5">
          <p className="text-xs font-medium text-muted-foreground">
            Last check
          </p>

          <p className="mt-1 text-sm font-medium">
            {formattedDate} • {formattedTime}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

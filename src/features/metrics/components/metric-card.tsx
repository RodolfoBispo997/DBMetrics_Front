import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

export function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Card className="h-full border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex h-full flex-col justify-between space-y-4">
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsError() {
  return (
    <div className="rounded-lg border border-destructive p-8 text-center">
      <h3 className="font-semibold">Failed to load metrics</h3>

      <p className="text-muted-foreground text-sm mt-2">
        Please try again later.
      </p>
    </div>
  );
}

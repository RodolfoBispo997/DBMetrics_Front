type DashboardOverviewCardProps = Readonly<{
  title: string;
  value: string | number;
}>;

export function DashboardOverviewCard({
  title,
  value,
}: DashboardOverviewCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1020] p-6">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

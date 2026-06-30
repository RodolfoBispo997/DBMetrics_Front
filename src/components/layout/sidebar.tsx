export function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 bg-[#0b1020] p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white">DBMetrics</h2>
        <p className="text-sm text-slate-400">Database monitoring</p>
      </div>

      <nav className="space-y-2">
        <div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white">
          Dashboard
        </div>
      </nav>
    </aside>
  );
}

import { LogoutButton } from "@/features/auth/components/logout-button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>

        <p className="text-sm text-slate-400">
          Monitor your database connections and metrics
        </p>
      </div>

      <LogoutButton />
    </header>
  );
}

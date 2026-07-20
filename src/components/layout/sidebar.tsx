"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Database, LayoutDashboard, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type NavigationItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Database Connections",
    href: "/database-connections",
    icon: Database,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: Bell,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0b1020] p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white">DBMetrics</h2>
        <p className="text-sm text-slate-400">Database monitoring</p>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-white/10 font-medium text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              {Icon && <Icon className="mr-2 inline-block size-4" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

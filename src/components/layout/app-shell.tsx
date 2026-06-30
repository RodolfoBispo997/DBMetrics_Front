import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header />

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

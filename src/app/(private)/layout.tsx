import { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { AppShell } from "@/components/layout/app-shell";

type PrivateLayoutProps = {
  children: ReactNode;
};

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}

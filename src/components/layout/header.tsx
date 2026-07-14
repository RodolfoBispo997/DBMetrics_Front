import { LogoutButton } from "@/features/auth/components/logout-button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-end border-b border-white/10 px-6">
      <LogoutButton />
    </header>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useLogout } from "@/features/auth/hooks/use-logout";
import { removeToken } from "@/lib/token-storage";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useLogout();
  const logoutInProgress = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (logoutInProgress.current || isPending || isLoggingOut) return;

    logoutInProgress.current = true;
    setIsLoggingOut(true);

    try {
      await mutateAsync();
    } catch {
      // A falha remota não impede o encerramento local da sessão.
    } finally {
      removeToken();
      queryClient.clear();
      router.replace("/login");
    }
  }

  const isBusy = isPending || isLoggingOut;

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isBusy}
      aria-busy={isBusy}
      className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-700"
    >
      {isBusy ? "Saindo..." : "Sair"}
    </button>
  );
}

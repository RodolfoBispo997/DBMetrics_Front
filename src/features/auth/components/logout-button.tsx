"use client";

import { useRouter } from "next/navigation";

import { removeToken } from "@/lib/token-storage";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    removeToken();

    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-700"
    >
      Sair
    </button>
  );
}

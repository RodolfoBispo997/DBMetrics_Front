"use client";

import { ReactNode, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { getToken } from "@/lib/token-storage";

type AuthGuardProps = {
  children: ReactNode;
};

function subscribe() {
  return () => {};
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const hasToken = isClient && Boolean(getToken());

  useEffect(() => {
    // A existência da sessão é verificada após a hidratação.
    // A invalidação por expiração do JWT ou resposta 401
    // permanece sob responsabilidade da infraestrutura HTTP.
    if (isClient && !hasToken) {
      router.replace("/login");
    }
  }, [hasToken, isClient, router]);

  // TODO: substituir por <PageLoader />.
  if (!isClient || !hasToken) {
    return null;
  }

  return <>{children}</>;
}

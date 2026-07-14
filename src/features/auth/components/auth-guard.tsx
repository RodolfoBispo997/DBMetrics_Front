"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getToken } from "@/lib/token-storage";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // A existência da sessão é verificada apenas na montagem do componente.
    // A invalidação da sessão (expiração do JWT ou 401 Unauthorized)
    // é responsabilidade da infraestrutura HTTP.
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsReady(true);
  }, [router]);

  // TODO (Sprint 3): substituir por <PageLoader />.
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

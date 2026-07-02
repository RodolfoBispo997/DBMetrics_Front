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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      setIsReady(true);
      return;
    }

    setIsAuthenticated(true);
    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

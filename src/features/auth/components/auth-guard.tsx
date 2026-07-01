"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getToken } from "@/lib/token-storage";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  if (!token) {
    return null;
  }

  return children;
}

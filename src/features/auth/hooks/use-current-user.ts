"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/features/auth/services/auth.service";

export const currentUserQueryKey = ["auth", "me"] as const;

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
}

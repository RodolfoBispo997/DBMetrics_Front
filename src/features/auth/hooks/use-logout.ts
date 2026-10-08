"use client";

import { useMutation } from "@tanstack/react-query";

import { logout } from "@/features/auth/services/auth.service";

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}

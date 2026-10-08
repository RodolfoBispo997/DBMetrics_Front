"use client";

import { useMutation } from "@tanstack/react-query";

import { verifyEmail } from "@/features/auth/services/auth.service";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
  });
}

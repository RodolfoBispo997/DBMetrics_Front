"use client";

import { useMutation } from "@tanstack/react-query";

import { resendVerification } from "@/features/auth/services/auth.service";

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
  });
}

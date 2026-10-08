"use client";

import { useMutation } from "@tanstack/react-query";

import { register } from "@/features/auth/services/auth.service";

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}

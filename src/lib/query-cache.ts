"use client";

import { QueryClient } from "@tanstack/react-query";

let registeredQueryClient: QueryClient | null = null;

export function registerQueryClient(queryClient: QueryClient) {
  registeredQueryClient = queryClient;
}

export function clearQueryCache() {
  registeredQueryClient?.clear();
}

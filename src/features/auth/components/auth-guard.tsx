"use client";

import axios from "axios";
import { ReactNode, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
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
  const currentUserQuery = useCurrentUser(hasToken);

  useEffect(() => {
    if (isClient && !hasToken) {
      router.replace("/login");
    }
  }, [hasToken, isClient, router]);

  if (
    !isClient ||
    !hasToken ||
    currentUserQuery.isLoading ||
    currentUserQuery.isFetching
  ) {
    return <GuardStatus message="Validando sua sessão..." />;
  }

  if (currentUserQuery.isError) {
    const isUnauthorized =
      axios.isAxiosError(currentUserQuery.error) &&
      currentUserQuery.error.response?.status === 401;

    if (isUnauthorized) {
      return <GuardStatus message="Encerrando sua sessão..." />;
    }

    return (
      <GuardError onRetry={() => currentUserQuery.refetch()} />
    );
  }

  return <>{children}</>;
}

function GuardStatus({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] p-4 text-white">
      <p role="status" className="text-slate-300">
        {message}
      </p>
    </main>
  );
}

function GuardError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] p-4 text-white">
      <section
        aria-labelledby="auth-error-title"
        className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8 text-center"
      >
        <h1 id="auth-error-title" className="mb-3 text-xl font-semibold">
          Não foi possível validar sua sessão
        </h1>
        <p className="mb-6 text-slate-300">
          Verifique sua conexão e tente novamente.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="w-full rounded-md bg-blue-600 p-3 transition-colors hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useResendVerification } from "@/features/auth/hooks/use-resend-verification";
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email";
import {
  ResendVerificationFormData,
  resendVerificationSchema,
} from "@/features/auth/schemas/verification.schema";

type VerificationState =
  | "checking"
  | "success"
  | "unavailable"
  | "public-unavailable";

function getErrorMessage(error: unknown, action: "verify" | "resend") {
  if (!axios.isAxiosError(error)) {
    return "Não foi possível concluir a operação.";
  }

  switch (error.response?.status) {
    case 400:
      return action === "verify"
        ? "Este link é inválido, expirou ou já foi utilizado."
        : "Não foi possível processar o reenvio. Tente novamente mais tarde.";
    case 404:
      return "A funcionalidade pública de verificação está indisponível.";
    case 429:
      return "Limite de tentativas atingido. Tente novamente mais tarde.";
    default:
      if (error.response && error.response.status >= 500 && error.response.status <= 599) {
        return "O servidor está temporariamente indisponível. Tente novamente mais tarde.";
      }

      return error.response
        ? "Não foi possível concluir a operação."
        : "Não foi possível conectar ao servidor.";
  }
}

function ResendVerificationForm({ defaultEmail }: { defaultEmail: string }) {
  const [resendSuccess, setResendSuccess] = useState(false);
  const { mutate, isPending, error, reset } = useResendVerification();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: defaultEmail },
  });

  function onSubmit(data: ResendVerificationFormData) {
    setResendSuccess(false);
    reset();
    mutate(data, {
      onSuccess() {
        setResendSuccess(true);
      },
    });
  }

  return resendSuccess ? (
    <section aria-live="polite" className="mt-6 border-t border-white/10 pt-6">
      <h2 className="mb-2 text-lg font-semibold">Solicitação recebida</h2>
      <p className="text-slate-300">
        Se houver uma conta associada a este e-mail, enviaremos novas instruções de confirmação.
      </p>
    </section>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 border-t border-white/10 pt-6">
      <h2 className="mb-2 text-lg font-semibold">Reenviar confirmação</h2>
      <p className="mb-4 text-slate-300">Informe seu e-mail para solicitar um novo link.</p>
      <label htmlFor="verification-email" className="sr-only">E-mail</label>
      <input
        id="verification-email"
        type="email"
        placeholder="E-mail"
        autoComplete="email"
        aria-invalid={errors.email ? "true" : "false"}
        {...register("email")}
        className="w-full rounded-md bg-slate-800 p-3"
      />
      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{getErrorMessage(error, "resend")}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 w-full rounded-md bg-blue-600 p-3 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Reenviar confirmação"}
      </button>
    </form>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const email = searchParams.get("email")?.trim() ?? "";
  const attemptedToken = useRef<string | null>(null);
  const [verificationState, setVerificationState] = useState<VerificationState>(
    token ? "checking" : "unavailable",
  );
  const [verificationMessage, setVerificationMessage] = useState(
    token ? "" : "O link de confirmação não foi informado.",
  );
  const { mutate } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      attemptedToken.current = null;
      return;
    }

    if (attemptedToken.current === token) {
      return;
    }

    attemptedToken.current = token;
    setVerificationState("checking");
    setVerificationMessage("");
    mutate(
      { token },
      {
        onSuccess() {
          if (attemptedToken.current !== token) return;
          setVerificationState("success");
        },
        onError(error) {
          if (attemptedToken.current !== token) return;
          setVerificationMessage(getErrorMessage(error, "verify"));
          setVerificationState(
            axios.isAxiosError(error) && error.response?.status === 404
              ? "public-unavailable"
              : "unavailable",
          );
        },
      },
    );
  }, [mutate, token]);

  const visibleState = token ? verificationState : "unavailable";
  const visibleMessage = token
    ? verificationMessage
    : "O link de confirmação não foi informado.";

  if (visibleState === "checking") {
    return <p className="text-slate-300">Validando seu link de confirmação...</p>;
  }

  if (visibleState === "success") {
    return (
      <section aria-labelledby="verification-success-title">
        <h1 id="verification-success-title" className="mb-4 text-2xl font-bold">
          E-mail confirmado
        </h1>
        <p className="mb-6 text-slate-300">
          Seu e-mail foi confirmado. Agora você pode acessar sua conta.
        </p>
        <Link href="/login" className="block w-full rounded-md bg-blue-600 p-3 text-center hover:bg-blue-700">
          Ir para o login
        </Link>
      </section>
    );
  }

  if (visibleState === "public-unavailable") {
    return (
      <section aria-labelledby="verification-unavailable-title">
        <h1 id="verification-unavailable-title" className="mb-4 text-2xl font-bold">
          Verificação indisponível
        </h1>
        <p className="mb-6 text-slate-300">{visibleMessage}</p>
        <Link href="/login" className="block w-full rounded-md bg-blue-600 p-3 text-center hover:bg-blue-700">
          Voltar para o login
        </Link>
      </section>
    );
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Link indisponível</h1>
      <p className="text-slate-300">{visibleMessage}</p>
      <ResendVerificationForm defaultEmail={token ? "" : email} />
      <p className="mt-6 text-center text-sm text-slate-300">
        <Link href="/login" className="text-blue-400 hover:underline">Voltar para o login</Link>
      </p>
    </>
  );
}

function VerificationPageFallback() {
  return <p className="text-slate-300">Carregando confirmação...</p>;
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] p-4 text-white">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8">
        <Suspense fallback={<VerificationPageFallback />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </main>
  );
}

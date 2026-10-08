"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "@/features/auth/hooks/use-login";
import {
  LoginFormData,
  loginSchema,
} from "@/features/auth/schemas/login.schema";
import { isAuthenticated, saveToken } from "@/lib/token-storage";

export default function LoginPage() {
  const router = useRouter();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  // A rota pública verifica a existência da sessão apenas durante a montagem.
  // Alterações posteriores na sessão são tratadas pela infraestrutura HTTP.
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      router.replace("/dashboard");
    }
  }, [authenticated, router]);

  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    setUnverifiedEmail(null);

    mutate(data, {
      onSuccess(response) {
        saveToken(response.accessToken);

        router.replace("/dashboard");
      },

      onError(error) {
        if (!axios.isAxiosError(error)) {
          toast.error("Não foi possível realizar o login.");
          return;
        }

        switch (error.response?.status) {
          case 401:
            toast.error("E-mail ou senha inválidos.");
            break;

          case 403:
            setUnverifiedEmail(data.email);
            break;

          case 404:
            toast.error("O serviço de login está indisponível no momento.");
            break;

          case 429:
            toast.error("Muitas tentativas de login. Tente novamente mais tarde.");
            break;

          default:
            if (!error.response) {
              toast.error("Não foi possível conectar ao servidor.");
            } else if (
              error.response.status >= 500 &&
              error.response.status <= 599
            ) {
              toast.error("Erro interno do servidor. Tente novamente mais tarde.");
            } else {
              toast.error("Não foi possível realizar o login.");
            }
        }
      },
    });
  }

  if (authenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8"
      >
        <h1 className="mb-6 text-2xl font-bold">DBMetrics</h1>

        {unverifiedEmail && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 rounded-md border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-100"
          >
            <p className="mb-2">
              Seu e-mail ainda não foi confirmado. Confirme seu e-mail antes de acessar o sistema.
            </p>
            <Link
              href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
              className="font-medium text-amber-300 underline hover:text-amber-200"
            >
              Reenviar e-mail de confirmação
            </Link>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="login-email" className="sr-only">E-mail</label>
          <input
            id="login-email"
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            {...register("email")}
            className="w-full rounded-md bg-slate-800 p-3"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="login-password" className="sr-only">Senha</label>
          <input
            id="login-password"
            type="password"
            placeholder="Senha"
            autoComplete="current-password"
            {...register("password")}
            className="w-full rounded-md bg-slate-800 p-3"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 p-3 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-300">
          Ainda não tem uma conta? <Link href="/register" className="text-blue-400 hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </main>
  );
}

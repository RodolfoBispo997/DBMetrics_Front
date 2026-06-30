"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "@/features/auth/hooks/use-login";
import {
  LoginFormData,
  loginSchema,
} from "@/features/auth/schemas/login.schema";
import { isAuthenticated, saveToken } from "@/lib/token-storage";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    mutate(data, {
      onSuccess(response) {
        saveToken(response.accessToken);
        router.push("/dashboard");
      },

      onError(error) {
        console.error(error);
      },
    });
  }

  if (isAuthenticated()) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8"
      >
        <h1 className="mb-6 text-2xl font-bold">DBMetrics</h1>

        <div className="mb-4">
          <input
            type="email"
            placeholder="E-mail"
            {...register("email")}
            className="w-full rounded-md bg-slate-800 p-3"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Senha"
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
      </form>
    </main>
  );
}

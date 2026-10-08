"use client";

import Link from "next/link";
import { useState } from "react";

import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegister } from "@/features/auth/hooks/use-register";
import {
  RegisterFormData,
  registerSchema,
} from "@/features/auth/schemas/register.schema";

export default function RegisterPage() {
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(data: RegisterFormData) {
    mutate(data, {
      onSuccess(response) {
        setRegistrationMessage(response.message?.trim() || null);
      },
      onError(error) {
        if (!axios.isAxiosError(error)) {
          toast.error("Não foi possível realizar o cadastro.");
          return;
        }

        switch (error.response?.status) {
          case 404:
            toast.error("O cadastro público está indisponível.");
            break;
          case 429:
            toast.error("Limite de tentativas atingido. Tente novamente mais tarde.");
            break;
          default:
            if (!error.response) {
              toast.error("Não foi possível conectar ao servidor.");
            } else if (
              error.response.status >= 500 &&
              error.response.status <= 599
            ) {
              toast.error("Erro interno do servidor.");
            } else {
              toast.error("Não foi possível realizar o cadastro.");
            }
        }
      },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] text-white">
      {registrationMessage !== null ? (
        <section
          aria-labelledby="registration-success-title"
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8"
        >
          <h1 id="registration-success-title" className="mb-4 text-2xl font-bold">
            Verifique seu e-mail
          </h1>
          <p className="mb-4 text-slate-300">
            Enviamos um link de confirmação para o seu e-mail. Sua conta só poderá acessar o sistema após a verificação.
          </p>
          {registrationMessage && (
            <p className="mb-6 text-slate-300">{registrationMessage}</p>
          )}
          <Link
            href="/login"
            className="block w-full rounded-md bg-blue-600 p-3 text-center transition-colors hover:bg-blue-700"
          >
            Voltar para o login
          </Link>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8"
        >
          <h1 className="mb-6 text-2xl font-bold">Criar conta</h1>

        <div className="mb-4">
          <label htmlFor="register-name" className="sr-only">Nome</label>
          <input
            id="register-name"
            type="text"
            placeholder="Nome"
            autoComplete="name"
            {...register("name")}
            className="w-full rounded-md bg-slate-800 p-3"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="register-email" className="sr-only">E-mail</label>
          <input
            id="register-email"
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            {...register("email")}
            className="w-full rounded-md bg-slate-800 p-3"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="register-password" className="sr-only">Senha</label>
          <input
            id="register-password"
            type="password"
            placeholder="Senha"
            autoComplete="new-password"
            {...register("password")}
            className="w-full rounded-md bg-slate-800 p-3"
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 p-3 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-300">
          Já tem uma conta? <Link href="/login" className="text-blue-400 hover:underline">Entrar</Link>
        </p>
        </form>
      )}
    </main>
  );
}

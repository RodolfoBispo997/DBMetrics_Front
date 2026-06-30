import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "Informe seu e-mail"),

  password: z.string().min(6, "A senha deve possuir pelo menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

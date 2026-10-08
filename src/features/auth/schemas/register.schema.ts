import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Informe seu nome"),

  email: z.email("E-mail inválido").min(1, "Informe seu e-mail"),

  password: z.string().min(8, "A senha deve possuir pelo menos 8 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

import { z } from "zod";

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Link de confirmação inválido"),
});

export const resendVerificationSchema = z.object({
  email: z.email("E-mail inválido").min(1, "Informe seu e-mail"),
});

export type ResendVerificationFormData = z.infer<
  typeof resendVerificationSchema
>;

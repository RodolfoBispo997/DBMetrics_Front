import { describe, expect, it } from "vitest";

import { loginSchema } from "./login.schema";
import { registerSchema } from "./register.schema";

describe("loginSchema", () => {
  it("aceita e-mail válido e senha com 8 caracteres", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "12345678" })
        .success,
    ).toBe(true);
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "1234567" })
        .success,
    ).toBe(false);
  });
});

describe("registerSchema", () => {
  const registration = {
    name: "Ana Silva",
    email: "ana@example.com",
    password: "senha-segura-8",
  };

  it("exige name, email e password", () => {
    expect(registerSchema.safeParse({ email: registration.email, password: registration.password }).success).toBe(false);
    expect(registerSchema.safeParse({ name: registration.name, password: registration.password }).success).toBe(false);
    expect(registerSchema.safeParse({ name: registration.name, email: registration.email }).success).toBe(false);
  });

  it("preserva name, email e password no resultado validado", () => {
    expect(registerSchema.parse(registration)).toEqual(registration);
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    expect(
      registerSchema.safeParse({ ...registration, password: "1234567" }).success,
    ).toBe(false);
  });
});

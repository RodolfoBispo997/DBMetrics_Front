import { describe, expect, it } from "vitest";
import { alertRuleFormSchema } from "./alert-rule-form.schema";

const base = { metric: "DATABASE_SIZE" as const, operator: "GREATER_THAN" as const, threshold: 1, cooldownMinutes: 30 };

describe("alertRuleFormSchema channels", () => {
  it("accepts email and rejects invalid email", () => {
    expect(alertRuleFormSchema.safeParse({ ...base, channel: "EMAIL", destination: "alerts@example.com" }).success).toBe(true);
    expect(alertRuleFormSchema.safeParse({ ...base, channel: "EMAIL", destination: "invalid" }).success).toBe(false);
  });
  it("preserves WhatsApp validation", () => {
    expect(alertRuleFormSchema.safeParse({ ...base, channel: "WHATSAPP", destination: "5511999999999" }).success).toBe(true);
    expect(alertRuleFormSchema.safeParse({ ...base, channel: "WHATSAPP", destination: "+5511999999999" }).success).toBe(false);
  });
});

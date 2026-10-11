// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { alertsService } from "./alerts.service";
vi.mock("@/lib/api", () => ({ api: { post: vi.fn(), patch: vi.fn(), get: vi.fn(), delete: vi.fn() } }));

describe("alert service channels", () => {
  beforeEach(() => vi.clearAllMocks());
  it.each([
    ["EMAIL", "alerts@example.com"],
    ["WHATSAPP", "5511999999999"],
  ] as const)("sends %s create payload", async (channel, destination) => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    const input = { connectionId: "connection-1", metric: "DATABASE_SIZE" as const, operator: "GREATER_THAN" as const, threshold: 1, cooldownMinutes: 30, channel, destination };
    await alertsService.createRule(input);
    expect(api.post).toHaveBeenCalledWith("/alerts", input);
  });
  it("sends selected channel and destination when editing", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ data: {} });
    await alertsService.updateRule("rule-1", { alertRuleId: "rule-1", databaseConnectionId: "connection-1", metric: "DATABASE_SIZE", operator: "GREATER_THAN", threshold: 1, cooldownMinutes: 30, channel: "EMAIL", destination: "alerts@example.com" });
    expect(api.patch).toHaveBeenCalledWith("/alerts/rule-1", expect.objectContaining({ channel: "EMAIL", destination: "alerts@example.com", cooldownMinutes: 30 }));
  });
});

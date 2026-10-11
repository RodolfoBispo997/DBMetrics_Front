import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("@/lib/api", () => ({ api: { post: mocks.post } }));

import { dashboardMetricsService } from "./dashboard-metrics.service";

describe("dashboardMetricsService.collect", () => {
  beforeEach(() => vi.clearAllMocks());

  it("envia POST para a rota da conexão", async () => {
    mocks.post.mockResolvedValueOnce({ data: { collected: true } });

    await expect(
      dashboardMetricsService.collect("connection-123"),
    ).resolves.toEqual({ collected: true });

    expect(mocks.post).toHaveBeenCalledWith(
      "/database-metrics/connection-123/collect",
    );
  });
});

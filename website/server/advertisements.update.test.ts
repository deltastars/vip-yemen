import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, updateAdvertisement: vi.fn().mockResolvedValue(undefined) };
});

import { appRouter } from "./routers";
import { decorateAdvertisement, updateAdvertisement } from "./db";

const adminContext = {
  req: { headers: {}, protocol: "https", get: () => "test" },
  res: { clearCookie: () => undefined },
  user: { id: 7, role: "admin", openId: "admin-test", name: "Admin", email: "admin@test.invalid" },
} as never;

describe("advertisement update workflow", () => {
  beforeEach(() => vi.clearAllMocks());
  it("persists a complete edit for an existing advertisement", async () => {
    const caller = appRouter.createCaller(adminContext);
    await caller.advertisements.update({
      id: 42,
      title: "تطبيق ViP الجديد",
      message: "حمّل النسخة المحدثة الآن",
      linkUrl: "https://vipyemen.example/app",
      startsAt: new Date("2026-09-01T10:00:00Z"),
      endsAt: new Date("2026-09-15T10:00:00Z"),
      priority: 8,
      status: "published",
    });
    expect(updateAdvertisement).toHaveBeenCalledWith(42, expect.objectContaining({
      title: "تطبيق ViP الجديد",
      message: "حمّل النسخة المحدثة الآن",
      linkUrl: "https://vipyemen.example/app",
      priority: 8,
      status: "published",
    }));
  });

  it("returns updated values with the computed current status for admin reads", () => {
    const updated = decorateAdvertisement({ id: 42, title: "تطبيق ViP الجديد", message: "رسالة محدثة", linkUrl: null, priority: 9, status: "scheduled" as const, startsAt: new Date("2026-09-01T10:00:00Z"), endsAt: new Date("2026-09-15T10:00:00Z") }, new Date("2026-09-05T10:00:00Z"));
    expect(updated).toMatchObject({ id: 42, title: "تطبيق ViP الجديد", message: "رسالة محدثة", priority: 9, currentStatus: "published" });
  });

  it("supports pause then resume through the same protected route", async () => {
    const caller = appRouter.createCaller(adminContext);
    await caller.advertisements.update({ id: 42, status: "paused" });
    await caller.advertisements.update({ id: 42, status: "published" });
    expect(updateAdvertisement).toHaveBeenNthCalledWith(1, 42, { status: "paused", linkUrl: undefined });
    expect(updateAdvertisement).toHaveBeenNthCalledWith(2, 42, { status: "published", linkUrl: undefined });
  });
});

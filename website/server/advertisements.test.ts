import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { computeAdvertisementStatus } from "./db";

const context = {
  req: { headers: {}, protocol: "https", get: () => "test" },
  res: { clearCookie: () => undefined },
  user: { id: 7, role: "admin", openId: "admin-test", name: "Admin", email: "admin@test.invalid" },
} as never;

const userContext = {
  req: { headers: {}, protocol: "https", get: () => "test" },
  res: { clearCookie: () => undefined },
  user: { id: 8, role: "user", openId: "user-test", name: "User", email: "user@test.invalid" },
} as never;

describe("advertisements and submissions", () => {
  it("computes scheduled, published, expired, paused, and draft states from one source", () => {
    const now = new Date("2026-09-01T12:00:00Z");
    expect(computeAdvertisementStatus({ status: "scheduled", startsAt: new Date("2026-09-01T13:00:00Z"), endsAt: new Date("2026-09-02T12:00:00Z") }, now)).toBe("scheduled");
    expect(computeAdvertisementStatus({ status: "scheduled", startsAt: new Date("2026-09-01T11:00:00Z"), endsAt: new Date("2026-09-02T12:00:00Z") }, now)).toBe("published");
    expect(computeAdvertisementStatus({ status: "published", startsAt: new Date("2026-08-30T11:00:00Z"), endsAt: new Date("2026-09-01T11:00:00Z") }, now)).toBe("expired");
    expect(computeAdvertisementStatus({ status: "paused", startsAt: new Date("2026-08-30T11:00:00Z"), endsAt: new Date("2026-09-03T11:00:00Z") }, now)).toBe("paused");
    expect(computeAdvertisementStatus({ status: "draft", startsAt: new Date("2026-08-30T11:00:00Z"), endsAt: new Date("2026-09-03T11:00:00Z") }, now)).toBe("draft");
  });

  it("rejects an advertisement update whose end is before its start", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.advertisements.update({ id: 1, startsAt: new Date("2026-09-02T12:00:00Z"), endsAt: new Date("2026-09-01T12:00:00Z") })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects an advertisement whose end is before its start", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.advertisements.create({
      title: "إعلان اختبار",
      message: "رسالة اختبار",
      status: "published",
      startsAt: new Date("2026-09-02T10:00:00Z"),
      endsAt: new Date("2026-09-01T10:00:00Z"),
      priority: 0,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("blocks non-admin users from reading private submissions", async () => {
    const caller = appRouter.createCaller(userContext);
    await expect(caller.submissions.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects malformed public submission phone numbers before persistence", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.submissions.create({
      category: "employment",
      title: "مطلوب موظف",
      description: "وصف كافٍ للطلب التجريبي",
      fullName: "مستخدم اختبار",
      phone: "not-a-phone",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

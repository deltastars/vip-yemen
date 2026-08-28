import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { ENV } from "./_core/env";

const nonOwnerAdmin = {
  req: { headers: {}, protocol: "https", get: () => "test" },
  res: { clearCookie: () => undefined },
  user: { id: 7, role: "admin", openId: "admin-test", name: "Admin", email: "admin@test.invalid" },
} as never;

const regularUser = {
  req: { headers: {}, protocol: "https", get: () => "test" },
  res: { clearCookie: () => undefined },
  user: { id: 8, role: "user", openId: "user-test", name: "User", email: "user@test.invalid" },
} as never;

const ownerContext = {
  req: { headers: {}, protocol: "https", get: () => "test" },
  res: { clearCookie: () => undefined },
  user: { id: 1, role: "admin", openId: ENV.ownerOpenId, name: "Owner", email: "owner@test.invalid" },
} as never;

describe("developer content permissions", () => {
  it("allows the configured project owner to pass the management check", async () => {
    const caller = appRouter.createCaller(ownerContext);
    await expect(caller.siteContent.canManage()).resolves.toBe(true);
  });

  it("blocks an admin who is not the project owner", async () => {
    const caller = appRouter.createCaller(nonOwnerAdmin);
    await expect(caller.siteContent.adminAssets()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks regular users from developer content controls", async () => {
    const caller = appRouter.createCaller(regularUser);
    await expect(caller.siteContent.adminSections()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const app = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("UI safety guardrails", () => {
  it("keeps developer controls owner-gated in the admin UI", () => {
    expect(app).toContain("siteContent.canManage.useQuery");
    expect(app).toContain("developer-forbidden");
    expect(app).toContain("siteContent.restoreRevision");
  });

  it("defines separated hero image/card guardrails for narrow and phone layouts", () => {
    expect(css).toContain("@media (max-width:850px)");
    expect(css).toContain(".hero-image-wrap { left:170px; }");
    expect(css).toContain("@media (max-width:420px)");
    expect(css).toContain(".hero-image-wrap { left:178px; }");
    expect(css).toContain(".hero-stat { inset-inline-end:0; bottom:-30px;");
  });
});

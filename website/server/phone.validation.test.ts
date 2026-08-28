import { describe, expect, it } from "vitest";
import { isValidYemenPhone, normalizeYemenPhone } from "./routers";

describe("Yemen phone validation", () => {
  it("accepts local and international mobile formats", () => {
    expect(isValidYemenPhone("711780999")).toBe(true);
    expect(isValidYemenPhone("00967 711 780 999")).toBe(true);
    expect(isValidYemenPhone("+967-711-780-999")).toBe(true);
  });

  it("normalizes separators before persistence", () => {
    expect(normalizeYemenPhone("00967 (711) 780-999")).toBe("00967711780999");
  });

  it("rejects non-Yemeni, landline, short, and malformed values", () => {
    expect(isValidYemenPhone("+966501234567")).toBe(false);
    expect(isValidYemenPhone("012345678")).toBe(false);
    expect(isValidYemenPhone("71178099")).toBe(false);
    expect(isValidYemenPhone("hello711780999")).toBe(false);
  });
});

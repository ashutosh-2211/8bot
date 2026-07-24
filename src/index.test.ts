import { describe, expect, it } from "vitest";
import { createHuman, compose, walkCycle, getBounds, intersects } from "./index";

describe("root package export", () => {
  it("re-exports core and catalog together", () => {
    expect(typeof createHuman).toBe("function");
    expect(typeof compose).toBe("function");
  });

  it("re-exports movement and interaction helpers", () => {
    expect(typeof walkCycle).toBe("function");
    expect(typeof getBounds).toBe("function");
    expect(typeof intersects).toBe("function");
  });
});

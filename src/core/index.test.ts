import { describe, expect, it } from "vitest";
import * as core from "./index";

describe("core barrel export", () => {
  it("exposes the full public API", () => {
    expect(typeof core.compose).toBe("function");
    expect(typeof core.composeShape).toBe("function");
    expect(typeof core.registerObject).toBe("function");
    expect(typeof core.getObject).toBe("function");
    expect(typeof core.registerShape).toBe("function");
    expect(typeof core.getShape).toBe("function");
    expect(typeof core.randomize).toBe("function");
    expect(typeof core.mulberry32).toBe("function");
    expect(typeof core.resolvePalette).toBe("function");
    expect(typeof core.colorForRegion).toBe("function");
    expect(typeof core.walkCycle).toBe("function");
    expect(typeof core.getBounds).toBe("function");
    expect(typeof core.intersects).toBe("function");
  });
});

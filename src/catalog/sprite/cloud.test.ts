import { describe, expect, it } from "vitest";
import { mulberry32 } from "../../core/randomizer";
import { buildCloudGrid } from "./cloud";

describe("buildCloudGrid", () => {
  it("is deterministic for a given seed", () => {
    const a = buildCloudGrid(mulberry32(11), 24, 12, 0.5);
    const b = buildCloudGrid(mulberry32(11), 24, 12, 0.5);
    expect(a).toEqual(b);
  });

  it("only ever tags cells as cloud or cloudEdge", () => {
    const grid = buildCloudGrid(mulberry32(11), 24, 12, 0.5);
    const tags = new Set(grid.flat());
    tags.delete(null);
    expect([...tags].every((t) => t === "cloud" || t === "cloudEdge")).toBe(true);
  });

  it("produces at least some filled cells", () => {
    const grid = buildCloudGrid(mulberry32(11), 24, 12, 0.5);
    expect(grid.flat().some((c) => c !== null)).toBe(true);
  });
});

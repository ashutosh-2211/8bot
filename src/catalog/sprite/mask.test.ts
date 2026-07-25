import { describe, expect, it } from "vitest";
import { mulberry32 } from "../../core/randomizer";
import { buildMaskGrid } from "./mask";

describe("buildMaskGrid", () => {
  it("is deterministic for a given seed", () => {
    const a = buildMaskGrid(mulberry32(7), 12, 12, 0.5);
    const b = buildMaskGrid(mulberry32(7), 12, 12, 0.5);
    expect(a).toEqual(b);
  });

  it("is bilaterally symmetric — column x mirrors column (width - 1 - x)", () => {
    const grid = buildMaskGrid(mulberry32(7), 12, 10, 0.5);
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 12; x++) {
        expect(grid[y][x]).toBe(grid[y][11 - x]);
      }
    }
  });

  it("only ever tags cells as body or edge", () => {
    const grid = buildMaskGrid(mulberry32(7), 12, 12, 0.5);
    const tags = new Set(grid.flat());
    tags.delete(null);
    expect([...tags].every((t) => t === "body" || t === "edge")).toBe(true);
  });

  it("produces more filled cells at higher density", () => {
    const count = (g: ReturnType<typeof buildMaskGrid>) =>
      g.flat().filter((c) => c !== null).length;
    const sparse = buildMaskGrid(mulberry32(3), 12, 12, 0);
    const dense = buildMaskGrid(mulberry32(3), 12, 12, 1);
    expect(count(dense)).toBeGreaterThan(count(sparse));
  });
});

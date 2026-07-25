import { describe, expect, it } from "vitest";
import { mulberry32 } from "../../core/randomizer";
import { buildHillsGrid } from "./hills";

describe("buildHillsGrid", () => {
  it("is deterministic for a given seed", () => {
    const a = buildHillsGrid(mulberry32(9), 24, 14, 0.5);
    const b = buildHillsGrid(mulberry32(9), 24, 14, 0.5);
    expect(a).toEqual(b);
  });

  it("only ever tags cells as hillFar, hillMid, or hillNear", () => {
    const grid = buildHillsGrid(mulberry32(9), 24, 14, 0.5);
    const tags = new Set(grid.flat());
    tags.delete(null);
    expect([...tags].every((t) => t === "hillFar" || t === "hillMid" || t === "hillNear")).toBe(
      true
    );
  });

  it("the bottom row is always the nearest layer, since it's drawn last and covers to the bottom", () => {
    const grid = buildHillsGrid(mulberry32(9), 24, 14, 0.5);
    const bottomRow = grid[13];
    expect(bottomRow.every((tag) => tag === "hillNear")).toBe(true);
  });

  it("each column fills solidly to the bottom once a layer starts, no gaps", () => {
    const grid = buildHillsGrid(mulberry32(9), 24, 14, 0.5);
    for (let x = 0; x < 24; x++) {
      let seenFilled = false;
      for (let y = 0; y < 14; y++) {
        const filled = grid[y][x] !== null;
        if (filled) seenFilled = true;
        if (seenFilled) expect(filled).toBe(true);
      }
    }
  });
});

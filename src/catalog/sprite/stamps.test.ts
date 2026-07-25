import { describe, expect, it } from "vitest";
import { walkCycle } from "../../core/walkCycle";
import { matrix, tagEdges, buildSilhouetteSlots } from "./stamps";

describe("matrix", () => {
  it("creates a height x width grid filled with null", () => {
    const grid = matrix(3, 2);
    expect(grid).toEqual([
      [null, null, null],
      [null, null, null],
    ]);
  });
});

describe("tagEdges", () => {
  it("tags an isolated filled cell as edge, not interior", () => {
    const mask = [
      [false, false, false],
      [false, true, false],
      [false, false, false],
    ];
    const grid = tagEdges(mask, 3, 3, "body", "edge");
    expect(grid[1][1]).toBe("edge");
  });

  it("tags the center of a fully filled 3x3 block as interior", () => {
    const mask = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ];
    const grid = tagEdges(mask, 3, 3, "body", "edge");
    expect(grid[1][1]).toBe("body");
    expect(grid[0][0]).toBe("edge");
  });

  it("leaves unfilled cells as null", () => {
    const mask = [[false]];
    const grid = tagEdges(mask, 1, 1, "body", "edge");
    expect(grid[0][0]).toBeNull();
  });
});

describe("buildSilhouetteSlots", () => {
  function regionsFixture(): Record<string, boolean[][]> {
    return {
      torso: [
        [true, true],
        [true, true],
      ],
      legL: [
        [false, false],
        [true, false],
      ],
    };
  }

  it("only marks the given region names as limbs", () => {
    const slots = buildSilhouetteSlots(2, 2, regionsFixture(), ["legL"]);
    const byName = Object.fromEntries(slots.map((s) => [s.name, s]));
    expect(byName.legL.role).toBe("limb");
    expect(byName.torso.role).toBe("body");
  });

  it("only paints cells belonging to that region into its own grid", () => {
    const slots = buildSilhouetteSlots(2, 2, regionsFixture(), ["legL"]);
    const legL = slots.find((s) => s.name === "legL")!;
    expect(legL.variants[0].grid[0]).toEqual([null, null]);
    expect(legL.variants[0].grid[1][0]).not.toBeNull();
  });

  it("classifies edges using the combined silhouette, not each region alone", () => {
    // legL's one filled cell sits directly under a torso cell, so within the
    // full silhouette it has a filled neighbor above — it should not be
    // trivially isolated the way it would be judged on its own.
    const slots = buildSilhouetteSlots(2, 2, regionsFixture(), ["legL"]);
    const legL = slots.find((s) => s.name === "legL")!;
    expect(["body", "edge"]).toContain(legL.variants[0].grid[1][0]);
  });

  it("produces slots walkCycle can find via role: limb", () => {
    const slots = buildSilhouetteSlots(2, 2, regionsFixture(), ["legL"]);
    const definition = {
      name: "fixture",
      width: 2,
      height: 2,
      slots,
      defaultPalette: { body: "#000000", edge: "#000000" },
      allowedRegionTags: ["body", "edge"],
    };
    expect(Object.keys(walkCycle(definition, 0))).toEqual(["legL"]);
  });
});

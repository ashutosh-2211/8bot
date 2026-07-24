import { describe, expect, it } from "vitest";
import { compose, composeShape } from "./composer";
import type { ObjectDefinition, ShapeDefinition } from "./types";

const square: ObjectDefinition = {
  name: "square",
  width: 2,
  height: 2,
  slots: [
    {
      name: "block",
      position: { x: 0, y: 0 },
      variants: [
        {
          id: "solid",
          anchor: { x: 0, y: 0 },
          grid: [
            ["fill", "fill"],
            ["fill", null],
          ],
        },
        {
          id: "hollow",
          anchor: { x: 0, y: 0 },
          grid: [
            ["fill", null],
            [null, "fill"],
          ],
        },
      ],
    },
  ],
  defaultPalette: { fill: "#112233" },
  allowedRegionTags: ["fill"],
};

describe("compose", () => {
  it("composes the default variant of each slot with the default palette", () => {
    const result = compose(square);
    expect(result.name).toBe("square");
    expect(result.pixels).toEqual([
      { x: 0, y: 0, color: "#112233", layer: 0 },
      { x: 1, y: 0, color: "#112233", layer: 0 },
      { x: 0, y: 1, color: "#112233", layer: 0 },
    ]);
  });

  it("selects a chosen variant", () => {
    const result = compose(square, { block: "hollow" });
    expect(result.pixels).toEqual([
      { x: 0, y: 0, color: "#112233", layer: 0 },
      { x: 1, y: 1, color: "#112233", layer: 0 },
    ]);
  });

  it("applies a palette override", () => {
    const result = compose(square, {}, { fill: "#ffffff" });
    expect(result.pixels.every((p) => p.color === "#ffffff")).toBe(true);
  });

  it("applies a pose offset to a slot", () => {
    const result = compose(square, {}, {}, { block: { dx: 3, dy: -1 } });
    expect(result.pixels).toEqual([
      { x: 3, y: -1, color: "#112233", layer: 0 },
      { x: 4, y: -1, color: "#112233", layer: 0 },
      { x: 3, y: 0, color: "#112233", layer: 0 },
    ]);
  });

  it("throws for an unknown variant id", () => {
    expect(() => compose(square, { block: "missing" })).toThrow(/Unknown part id/);
  });

  it("throws for a slot with no variants", () => {
    const empty: ObjectDefinition = { ...square, slots: [{ name: "block", position: { x: 0, y: 0 }, variants: [] }] };
    expect(() => compose(empty)).toThrow(/no variants/);
  });

  it("throws for a palette override that is not a valid hex color", () => {
    expect(() => compose(square, {}, { fill: "javascript:alert(1)" })).toThrow(/Invalid color/);
  });

  it("grows width/height to fit pixels pushed out of bounds by a pose offset", () => {
    const result = compose(square, {}, {}, { block: { dx: 3, dy: -1 } });
    // static width/height are both 2, but the pose pushes pixels to x=4 and y=-1..0
    expect(result.width).toBeGreaterThanOrEqual(5);
    expect(result.pixels.every((p) => p.x < result.width)).toBe(true);
  });

  it("never shrinks below the static width/height when unposed", () => {
    const result = compose(square);
    expect(result.width).toBe(square.width);
    expect(result.height).toBe(square.height);
  });

  it("grows height when a limb pose offset pushes a pixel below the static bottom edge", () => {
    const withLimb: ObjectDefinition = {
      name: "limbed",
      width: 4,
      height: 4,
      slots: [
        {
          name: "leg",
          position: { x: 0, y: 3 },
          role: "limb",
          variants: [
            { id: "solid", anchor: { x: 0, y: 0 }, grid: [["fill"]] },
          ],
        },
      ],
      defaultPalette: { fill: "#112233" },
      allowedRegionTags: ["fill"],
    };
    const noPose = compose(withLimb);
    expect(noPose.height).toBe(4);

    const posed = compose(withLimb, {}, {}, { leg: { dy: 1 } });
    expect(posed.pixels[0].y).toBe(4);
    expect(posed.height).toBeGreaterThanOrEqual(5);
    expect(posed.pixels.every((p) => p.y < posed.height)).toBe(true);
  });
});

describe("composeShape", () => {
  const cube: ShapeDefinition = {
    name: "cube",
    kind: "cube",
    width: 6,
    height: 6,
    defaultColor: "#4488cc",
  };

  it("fills the full width/height grid for a cube", () => {
    const result = composeShape(cube);
    expect(result.pixels).toHaveLength(36);
  });

  it("uses a lighter color for the top band and darker for the side band", () => {
    const result = composeShape(cube);
    const top = result.pixels.find((p) => p.y === 0 && p.x === 0)!;
    const side = result.pixels.find((p) => p.x === cube.width - 1 && p.y === cube.height - 1)!;
    const base = result.pixels.find((p) => p.x === 2 && p.y === 2)!;
    expect(top.color).not.toBe(base.color);
    expect(side.color).not.toBe(base.color);
    expect(top.color).not.toBe(side.color);
  });

  it("masks pixels outside the ellipse for a sphere", () => {
    const sphere: ShapeDefinition = { ...cube, name: "sphere", kind: "sphere" };
    const result = composeShape(sphere);
    expect(result.pixels.length).toBeLessThan(36);
    expect(result.pixels.some((p) => p.x === 0 && p.y === 0)).toBe(false);
  });

  it("respects a color override", () => {
    const result = composeShape(cube, "#00ff00");
    const base = result.pixels.find((p) => p.x === 2 && p.y === 2)!;
    expect(base.color).toBe("#00ff00");
  });

  it("throws for a color override that is not a valid hex color", () => {
    expect(() =>
      composeShape(cube, '"/><script>alert(1)</script><rect fill="#000')
    ).toThrow(/Invalid color/);
  });
});

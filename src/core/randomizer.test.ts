import { describe, expect, it } from "vitest";
import { mulberry32, randomize } from "./randomizer";
import type { ObjectDefinition } from "./types";

describe("mulberry32", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(7);
    const b = mulberry32(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays within [0, 1)", () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 50; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

const definition: ObjectDefinition = {
  name: "randomizer-test-object",
  width: 1,
  height: 1,
  slots: [
    {
      name: "head",
      position: { x: 0, y: 0 },
      variants: [
        { id: "a", anchor: { x: 0, y: 0 }, grid: [["x"]] },
        { id: "b", anchor: { x: 0, y: 0 }, grid: [["x"]] },
      ],
    },
  ],
  defaultPalette: { x: "#000000" },
  allowedRegionTags: ["x"],
  paletteOptions: [{}, { x: "#ffffff" }],
};

describe("randomize", () => {
  it("is deterministic for a given seed", () => {
    const a = randomize(definition, 99);
    const b = randomize(definition, 99);
    expect(a).toEqual(b);
  });

  it("only picks variant ids that exist on the slot", () => {
    const { choices } = randomize(definition, 5);
    expect(["a", "b"]).toContain(choices.head);
  });

  it("only picks a palette from paletteOptions", () => {
    const { palette } = randomize(definition, 5);
    expect(definition.paletteOptions).toContainEqual(palette);
  });

  it("diverges between consecutive unseeded calls even within the same millisecond", () => {
    const manyVariantDefinition: ObjectDefinition = {
      ...definition,
      slots: [
        {
          name: "head",
          position: { x: 0, y: 0 },
          variants: Array.from({ length: 20 }, (_, i) => ({
            id: `v${i}`,
            anchor: { x: 0, y: 0 },
            grid: [["x"]],
          })),
        },
      ],
    };
    const results = Array.from({ length: 10 }, () => randomize(manyVariantDefinition));
    const distinctChoices = new Set(results.map((r) => r.choices.head));
    expect(distinctChoices.size).toBeGreaterThan(1);
  });
});

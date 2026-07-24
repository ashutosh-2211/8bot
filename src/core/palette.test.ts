import { describe, expect, it } from "vitest";
import { resolvePalette, colorForRegion, lighten, darken } from "./palette";
import type { ObjectDefinition } from "./types";

const definition: ObjectDefinition = {
  name: "test-object",
  width: 1,
  height: 1,
  slots: [],
  defaultPalette: { skin: "#e0ac69", outfit: "#3355ff" },
  allowedRegionTags: ["skin", "outfit"],
};

describe("resolvePalette", () => {
  it("returns the default palette with no overrides", () => {
    expect(resolvePalette(definition)).toEqual(definition.defaultPalette);
  });

  it("merges a valid override", () => {
    expect(resolvePalette(definition, { outfit: "#ff0000" })).toEqual({
      skin: "#e0ac69",
      outfit: "#ff0000",
    });
  });

  it("throws on an override for an unknown region tag", () => {
    expect(() => resolvePalette(definition, { hair: "#000000" })).toThrow(
      /hair/
    );
  });
});

describe("colorForRegion", () => {
  it("returns the color for a defined region", () => {
    expect(colorForRegion({ skin: "#e0ac69" }, "skin")).toBe("#e0ac69");
  });

  it("throws for an undefined region", () => {
    expect(() => colorForRegion({}, "skin")).toThrow(/skin/);
  });
});

describe("lighten/darken", () => {
  it("darken decreases channel values, lighten increases them", () => {
    const base = "#808080";
    const lighter = lighten(base, 0.2);
    const darker = darken(base, 0.2);
    expect(parseInt(lighter.slice(1), 16)).toBeGreaterThan(parseInt(base.slice(1), 16));
    expect(parseInt(darker.slice(1), 16)).toBeLessThan(parseInt(base.slice(1), 16));
  });
});

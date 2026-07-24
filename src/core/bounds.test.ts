import { describe, expect, it } from "vitest";
import { getBounds, intersects } from "./bounds";
import type { ComposedObject } from "./types";

const object: ComposedObject = { name: "test", width: 10, height: 20, pixels: [] };

describe("getBounds", () => {
  it("defaults to position (0,0) and pixelSize 1", () => {
    expect(getBounds(object)).toEqual({ x: 0, y: 0, width: 10, height: 20 });
  });

  it("uses a given world position", () => {
    expect(getBounds(object, { x: 50, y: 100 })).toEqual({ x: 50, y: 100, width: 10, height: 20 });
  });

  it("scales width/height by pixelSize", () => {
    expect(getBounds(object, { x: 0, y: 0 }, 8)).toEqual({ x: 0, y: 0, width: 80, height: 160 });
  });
});

describe("intersects", () => {
  it("returns true when two bounds overlap", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 5, y: 5, width: 10, height: 10 };
    expect(intersects(a, b)).toBe(true);
  });

  it("returns false when two bounds are apart", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 100, y: 100, width: 10, height: 10 };
    expect(intersects(a, b)).toBe(false);
  });

  it("returns false when bounds only touch at an edge", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 10, y: 0, width: 10, height: 10 };
    expect(intersects(a, b)).toBe(false);
  });
});

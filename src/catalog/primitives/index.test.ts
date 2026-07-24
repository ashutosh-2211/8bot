import { describe, expect, it } from "vitest";
import {
  createCube,
  randomCube,
  createOblongoid,
  createSphere,
  cubeDefinition,
  oblongoidDefinition,
  sphereDefinition,
} from "./index";

describe("primitive shapes", () => {
  it("createCube fills the full bounding box", () => {
    const cube = createCube();
    expect(cube.pixels).toHaveLength(cubeDefinition.width * cubeDefinition.height);
  });

  it("createOblongoid fills the full bounding box", () => {
    const oblongoid = createOblongoid();
    expect(oblongoid.pixels).toHaveLength(oblongoidDefinition.width * oblongoidDefinition.height);
  });

  it("createSphere masks corners out of the bounding box", () => {
    const sphere = createSphere();
    expect(sphere.pixels.length).toBeLessThan(sphereDefinition.width * sphereDefinition.height);
  });

  it("createCube accepts a color override", () => {
    const cube = createCube("#000000");
    const base = cube.pixels.find((p) => p.x === 4 && p.y === 4)!;
    expect(base.color).toBe("#000000");
  });

  it("randomCube is deterministic for a given seed", () => {
    expect(randomCube(15)).toEqual(randomCube(15));
  });

  it("unseeded randomCube calls diverge even within the same millisecond", () => {
    const colors = new Set(Array.from({ length: 20 }, () => randomCube().pixels[0].color));
    expect(colors.size).toBeGreaterThan(1);
  });
});

import { describe, expect, it } from "vitest";
import { walkCycle } from "../../core/walkCycle";
import { compose } from "../../core/composer";
import { createSprite, spriteDefinition } from "./index";

describe("createSprite", () => {
  it("defaults to the abstract mask subject", () => {
    const sprite = createSprite({ seed: 1 });
    expect(sprite.name).toBe("sprite-mask");
    expect(sprite.pixels.length).toBeGreaterThan(0);
  });

  it("supports every subject without throwing", () => {
    const subjects = ["mask", "human", "animal", "bird", "cloud", "hills"] as const;
    for (const subject of subjects) {
      const sprite = createSprite({ subject, seed: 1 });
      expect(sprite.pixels.length).toBeGreaterThan(0);
    }
  });

  it("is deterministic for a given seed", () => {
    const a = createSprite({ subject: "animal", seed: 42 });
    const b = createSprite({ subject: "animal", seed: 42 });
    expect(a).toEqual(b);
  });

  it("produces different output for different seeds", () => {
    const a = createSprite({ subject: "bird", seed: 1 });
    const b = createSprite({ subject: "bird", seed: 2 });
    expect(a).not.toEqual(b);
  });

  it("honors a custom size", () => {
    const sprite = createSprite({ subject: "mask", seed: 1, size: { width: 8, height: 8 } });
    expect(sprite.width).toBe(8);
    expect(sprite.height).toBe(8);
  });

  it("honors a palette override", () => {
    const sprite = createSprite({ subject: "mask", seed: 1, palette: { body: "#00ff00" } });
    expect(sprite.pixels.some((p) => p.color === "#00ff00")).toBe(true);
  });
});

describe("spriteDefinition", () => {
  it("returns a reusable ObjectDefinition that walkCycle + compose can animate", () => {
    const def = spriteDefinition({ subject: "human", seed: 1 });
    const standing = compose(def, {}, {});
    const walking = compose(def, {}, {}, walkCycle(def, Math.PI / 2));
    expect(walking.pixels).not.toEqual(standing.pixels);
  });

  it("landscape subjects declare no limb slots, so walkCycle is a no-op", () => {
    const def = spriteDefinition({ subject: "hills", seed: 1 });
    expect(Object.keys(walkCycle(def, 1))).toHaveLength(0);
  });
});

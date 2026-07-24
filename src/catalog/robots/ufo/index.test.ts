import { describe, expect, it } from "vitest";
import { createUfo, randomUfo, ufoDefinition } from "./index";
import { walkCycle } from "../../../core/walkCycle";

describe("ufo catalog object", () => {
  it("has no limb slots, only dome and saucer", () => {
    const names = ufoDefinition.slots.map((s) => s.name);
    expect(names).toEqual(["dome", "saucer"]);
  });

  it("walkCycle returns an empty pose since it has no limbs", () => {
    expect(walkCycle(ufoDefinition, 0)).toEqual({});
  });

  it("composes with a single eye pixel", () => {
    const ufo = createUfo();
    const eyePixels = ufo.pixels.filter((p) => p.color === ufoDefinition.defaultPalette.eye);
    expect(eyePixels.length).toBeGreaterThan(0);
  });

  it("randomUfo is deterministic for a given seed", () => {
    expect(randomUfo(6)).toEqual(randomUfo(6));
  });
});

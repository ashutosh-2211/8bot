import { describe, expect, it } from "vitest";
import { compose } from "../../core/composer";
import { mulberry32 } from "../../core/randomizer";
import { walkCycle } from "../../core/walkCycle";
import { buildBirdDefinition } from "./bird";

describe("buildBirdDefinition", () => {
  it("declares wingL/wingR as limb slots", () => {
    const def = buildBirdDefinition(mulberry32(1), 14, 14, 0.5);
    const pose = walkCycle(def, 0);
    expect(Object.keys(pose).sort()).toEqual(["wingL", "wingR"]);
  });

  it("composes into a non-empty set of pixels, including an accent-colored beak", () => {
    const def = buildBirdDefinition(mulberry32(1), 14, 14, 0.5);
    const composed = compose(def, {}, { body: "#8fb3e0", accent: "#f4c56a" });
    expect(composed.pixels.length).toBeGreaterThan(0);
    expect(composed.pixels.some((p) => p.color === "#f4c56a")).toBe(true);
  });

  it("is deterministic for a given seed", () => {
    const a = compose(buildBirdDefinition(mulberry32(5), 14, 14, 0.5), {}, { body: "#8fb3e0" });
    const b = compose(buildBirdDefinition(mulberry32(5), 14, 14, 0.5), {}, { body: "#8fb3e0" });
    expect(a).toEqual(b);
  });

  it("a walk-cycle pose visibly moves the wings, changing the composed pixels", () => {
    const def = buildBirdDefinition(mulberry32(5), 14, 14, 0.5);
    const folded = compose(def, {}, { body: "#8fb3e0" });
    const flapping = compose(def, {}, { body: "#8fb3e0" }, walkCycle(def, Math.PI / 2));
    expect(flapping.pixels).not.toEqual(folded.pixels);
  });
});

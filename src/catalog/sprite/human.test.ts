import { describe, expect, it } from "vitest";
import { compose } from "../../core/composer";
import { mulberry32 } from "../../core/randomizer";
import { walkCycle } from "../../core/walkCycle";
import { buildHumanDefinition } from "./human";

describe("buildHumanDefinition", () => {
  it("declares armL/armR/legL/legR as limb slots", () => {
    const def = buildHumanDefinition(mulberry32(1), 14, 18, 0.5);
    const pose = walkCycle(def, 0);
    expect(Object.keys(pose).sort()).toEqual(["armL", "armR", "legL", "legR"]);
  });

  it("composes into a non-empty set of pixels", () => {
    const def = buildHumanDefinition(mulberry32(1), 14, 18, 0.5);
    const composed = compose(def, {}, { body: "#d9942f" });
    expect(composed.pixels.length).toBeGreaterThan(0);
  });

  it("is deterministic for a given seed", () => {
    const a = compose(buildHumanDefinition(mulberry32(5), 14, 18, 0.5), {}, { body: "#d9942f" });
    const b = compose(buildHumanDefinition(mulberry32(5), 14, 18, 0.5), {}, { body: "#d9942f" });
    expect(a).toEqual(b);
  });

  it("a walk-cycle pose visibly moves the limbs, changing the composed pixels", () => {
    const def = buildHumanDefinition(mulberry32(5), 14, 18, 0.5);
    const standing = compose(def, {}, { body: "#d9942f" });
    const walking = compose(def, {}, { body: "#d9942f" }, walkCycle(def, Math.PI / 2));
    expect(walking.pixels).not.toEqual(standing.pixels);
  });
});

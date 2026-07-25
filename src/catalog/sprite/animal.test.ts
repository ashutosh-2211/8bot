import { describe, expect, it } from "vitest";
import { compose } from "../../core/composer";
import { mulberry32 } from "../../core/randomizer";
import { walkCycle } from "../../core/walkCycle";
import { buildAnimalDefinition } from "./animal";

describe("buildAnimalDefinition", () => {
  it("declares legL/legR as limb slots", () => {
    const def = buildAnimalDefinition(mulberry32(1), 18, 14, 0.5);
    const pose = walkCycle(def, 0);
    expect(Object.keys(pose).sort()).toEqual(["legL", "legR"]);
  });

  it("composes into a non-empty set of pixels", () => {
    const def = buildAnimalDefinition(mulberry32(1), 18, 14, 0.5);
    const composed = compose(def, {}, { body: "#3f9d92" });
    expect(composed.pixels.length).toBeGreaterThan(0);
  });

  it("is deterministic for a given seed", () => {
    const a = compose(buildAnimalDefinition(mulberry32(5), 18, 14, 0.5), {}, { body: "#3f9d92" });
    const b = compose(buildAnimalDefinition(mulberry32(5), 18, 14, 0.5), {}, { body: "#3f9d92" });
    expect(a).toEqual(b);
  });

  it("a walk-cycle pose visibly moves the legs, changing the composed pixels", () => {
    const def = buildAnimalDefinition(mulberry32(5), 18, 14, 0.5);
    const standing = compose(def, {}, { body: "#3f9d92" });
    const walking = compose(def, {}, { body: "#3f9d92" }, walkCycle(def, Math.PI / 2));
    expect(walking.pixels).not.toEqual(standing.pixels);
  });
});

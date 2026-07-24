import { describe, expect, it } from "vitest";
import { createOctopod, randomOctopod, octopodDefinition } from "./index";
import { walkCycle } from "../../../core/walkCycle";

describe("octopod catalog object", () => {
  it("declares 8 leg slots marked as limbs", () => {
    const pose = walkCycle(octopodDefinition, 0);
    expect(Object.keys(pose)).toHaveLength(8);
  });

  it("composes with defaults", () => {
    const octopod = createOctopod();
    expect(octopod.pixels.length).toBeGreaterThan(0);
  });

  it("randomOctopod is deterministic for a given seed", () => {
    expect(randomOctopod(21)).toEqual(randomOctopod(21));
  });
});

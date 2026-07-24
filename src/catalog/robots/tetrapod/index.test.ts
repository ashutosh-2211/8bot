import { describe, expect, it } from "vitest";
import { createTetrapod, randomTetrapod, tetrapodDefinition } from "./index";
import { walkCycle } from "../../../core/walkCycle";

describe("tetrapod catalog object", () => {
  it("declares 4 leg slots marked as limbs", () => {
    const pose = walkCycle(tetrapodDefinition, 0);
    expect(Object.keys(pose)).toHaveLength(4);
  });

  it("composes with defaults", () => {
    expect(createTetrapod().pixels.length).toBeGreaterThan(0);
  });

  it("randomTetrapod is deterministic for a given seed", () => {
    expect(randomTetrapod(8)).toEqual(randomTetrapod(8));
  });
});

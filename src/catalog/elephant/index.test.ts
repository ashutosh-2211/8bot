import { describe, expect, it } from "vitest";
import { createElephant, randomElephant, elephantDefinition } from "./index";
import { walkCycle } from "../../core/walkCycle";

describe("elephant catalog object", () => {
  it("composes with defaults", () => {
    const elephant = createElephant();
    expect(elephant.pixels.length).toBeGreaterThan(0);
  });

  it("applies a palette override", () => {
    const elephant = createElephant({ palette: { hide: "#c9a0dc" } });
    expect(elephant.pixels.some((p) => p.color === "#c9a0dc")).toBe(true);
  });

  it("randomElephant is deterministic for a given seed", () => {
    expect(randomElephant(11)).toEqual(randomElephant(11));
  });

  it("marks all 4 legs as limbs for walkCycle", () => {
    const pose = walkCycle(elephantDefinition, 0);
    expect(Object.keys(pose)).toHaveLength(4);
  });
});

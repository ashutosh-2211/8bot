import { describe, expect, it } from "vitest";
import { createHuman, randomHuman, humanDefinition } from "./index";
import { walkCycle } from "../../core/walkCycle";

describe("human catalog object", () => {
  it("composes with default parts and palette", () => {
    const human = createHuman();
    expect(human.pixels.length).toBeGreaterThan(0);
    expect(human.pixels.every((p) => typeof p.color === "string")).toBe(true);
  });

  it("applies a palette override", () => {
    const human = createHuman({ palette: { outfit: "#00ff00" } });
    expect(human.pixels.some((p) => p.color === "#00ff00")).toBe(true);
  });

  it("selects a chosen variant part", () => {
    const defaultHead = createHuman();
    const squareHead = createHuman({ parts: { head: "square" } });
    expect(squareHead.pixels).not.toEqual(defaultHead.pixels);
  });

  it("randomHuman is deterministic for a given seed", () => {
    const a = randomHuman(42);
    const b = randomHuman(42);
    expect(a).toEqual(b);
  });

  it("marks arm and leg slots as limbs so walkCycle animates them", () => {
    const pose = walkCycle(humanDefinition, 0);
    expect(Object.keys(pose).sort()).toEqual(["armLeft", "armRight", "legLeft", "legRight"]);
  });

  it("accepts a pose and composes a visibly different result", () => {
    const standing = createHuman();
    const walking = createHuman({ pose: walkCycle(humanDefinition, Math.PI / 2) });
    expect(walking.pixels).not.toEqual(standing.pixels);
  });
});

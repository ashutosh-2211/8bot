import { describe, expect, it } from "vitest";
import { createFlyingBot, randomFlyingBot, flyingBotDefinition } from "./index";
import { walkCycle } from "../../../core/walkCycle";

describe("flying bot catalog object", () => {
  it("has no leg slots, only body and thrusters", () => {
    const names = flyingBotDefinition.slots.map((s) => s.name);
    expect(names).toEqual(["body", "thrusterLeft", "thrusterRight"]);
  });

  it("marks both thrusters as limbs for walkCycle", () => {
    const pose = walkCycle(flyingBotDefinition, 0);
    expect(Object.keys(pose).sort()).toEqual(["thrusterLeft", "thrusterRight"]);
  });

  it("composes with defaults", () => {
    expect(createFlyingBot().pixels.length).toBeGreaterThan(0);
  });

  it("randomFlyingBot is deterministic for a given seed", () => {
    expect(randomFlyingBot(4)).toEqual(randomFlyingBot(4));
  });
});

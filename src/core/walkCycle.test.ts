import { describe, expect, it } from "vitest";
import { walkCycle } from "./walkCycle";
import type { ObjectDefinition } from "./types";

function definitionWithLegs(legCount: number): ObjectDefinition {
  const legPart = { id: "default", anchor: { x: 0, y: 0 }, grid: [["x"]] };
  return {
    name: "walker",
    width: legCount,
    height: 1,
    slots: [
      { name: "body", variants: [legPart], position: { x: 0, y: 0 }, role: "body" },
      ...Array.from({ length: legCount }, (_, i) => ({
        name: `leg${i}`,
        variants: [legPart],
        position: { x: i, y: 1 },
        role: "limb" as const,
      })),
    ],
    defaultPalette: { x: "#000000" },
    allowedRegionTags: ["x"],
  };
}

describe("walkCycle", () => {
  it("only produces offsets for slots marked role: limb", () => {
    const pose = walkCycle(definitionWithLegs(4), 0);
    expect(Object.keys(pose).sort()).toEqual(["leg0", "leg1", "leg2", "leg3"]);
  });

  it("works for any limb count, including 8 legs and 2 thrusters", () => {
    expect(Object.keys(walkCycle(definitionWithLegs(8), 0))).toHaveLength(8);
    expect(Object.keys(walkCycle(definitionWithLegs(2), 0))).toHaveLength(2);
  });

  it("alternates even and odd limb slots out of phase", () => {
    const pose = walkCycle(definitionWithLegs(4), Math.PI / 2);
    expect(pose.leg0.dy).toBe(pose.leg2.dy);
    expect(pose.leg1.dy).toBe(pose.leg3.dy);
    expect(pose.leg0.dy).not.toBe(pose.leg1.dy);
  });

  it("is a pure function of t (same t gives the same pose)", () => {
    expect(walkCycle(definitionWithLegs(4), 1.2)).toEqual(walkCycle(definitionWithLegs(4), 1.2));
  });
});

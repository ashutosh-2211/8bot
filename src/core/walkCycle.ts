import type { ObjectDefinition, Pose } from "./types";

export function walkCycle(definition: ObjectDefinition, t: number): Pose {
  const limbSlots = definition.slots.filter((slot) => slot.role === "limb");
  const pose: Pose = {};
  limbSlots.forEach((slot, index) => {
    const phase = t + (index % 2) * Math.PI;
    pose[slot.name] = { dy: Math.round(Math.sin(phase)) };
  });
  return pose;
}

import type { ObjectDefinition, SlotDefinition } from "../../../core/types";
import { bodies, legs } from "./parts";

const legSlots: SlotDefinition[] = Array.from({ length: 8 }, (_, i) => ({
  name: `leg${i}`,
  variants: legs,
  position: { x: i, y: 4 },
  role: "limb",
}));

export const octopodDefinition: ObjectDefinition = {
  name: "octopod",
  width: 8,
  height: 7,
  slots: [{ name: "body", variants: bodies, position: { x: 1, y: 0 }, role: "body" }, ...legSlots],
  defaultPalette: { chassis: "#888888", joint: "#444444", eye: "#ff3333" },
  allowedRegionTags: ["chassis", "joint", "eye"],
  paletteOptions: [{}, { chassis: "#5577ff" }, { eye: "#33ff88" }],
};

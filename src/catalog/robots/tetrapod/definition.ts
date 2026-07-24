import type { ObjectDefinition, SlotDefinition } from "../../../core/types";
import { bodies, legs } from "./parts";

const legSlots: SlotDefinition[] = [1, 5].flatMap((x) =>
  [0, 1].map(
    (i): SlotDefinition => ({
      name: `leg${x}_${i}`,
      variants: legs,
      position: { x: x + i, y: 4 },
      role: "limb",
    })
  )
);

export const tetrapodDefinition: ObjectDefinition = {
  name: "tetrapod",
  width: 8,
  height: 7,
  slots: [{ name: "body", variants: bodies, position: { x: 0, y: 0 }, role: "body" }, ...legSlots],
  defaultPalette: { chassis: "#888888", joint: "#444444", eye: "#ff3333" },
  allowedRegionTags: ["chassis", "joint", "eye"],
  paletteOptions: [{}, { chassis: "#aa5533" }, { eye: "#33aaff" }],
};

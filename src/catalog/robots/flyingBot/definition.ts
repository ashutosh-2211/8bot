import type { ObjectDefinition } from "../../../core/types";
import { bodies, thrusters } from "./parts";

export const flyingBotDefinition: ObjectDefinition = {
  name: "flyingBot",
  width: 6,
  height: 6,
  slots: [
    { name: "body", variants: bodies, position: { x: 0, y: 0 }, role: "body" },
    { name: "thrusterLeft", variants: thrusters, position: { x: 0, y: 4 }, layer: -1, role: "limb" },
    { name: "thrusterRight", variants: thrusters, position: { x: 4, y: 4 }, layer: -1, role: "limb" },
  ],
  defaultPalette: { chassis: "#cccccc", thruster: "#3388ff", eye: "#ff3333" },
  allowedRegionTags: ["chassis", "thruster", "eye"],
  paletteOptions: [{}, { chassis: "#ffaa33" }, { thruster: "#ff33aa" }],
};

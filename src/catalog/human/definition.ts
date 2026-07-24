import type { ObjectDefinition } from "../../core/types";
import { heads, torsos, arms, legs } from "./parts";

export const humanDefinition: ObjectDefinition = {
  name: "human",
  width: 9,
  height: 17,
  slots: [
    { name: "head", variants: heads, position: { x: 2, y: 0 }, role: "body" },
    { name: "torso", variants: torsos, position: { x: 2, y: 5 }, role: "body" },
    { name: "armLeft", variants: arms, position: { x: 0, y: 5 }, role: "limb" },
    { name: "armRight", variants: arms, position: { x: 7, y: 5 }, role: "limb" },
    { name: "legLeft", variants: legs, position: { x: 2, y: 11 }, role: "limb" },
    { name: "legRight", variants: legs, position: { x: 5, y: 11 }, role: "limb" },
  ],
  defaultPalette: { skin: "#e0ac69", outfit: "#3355ff", eyes: "#1a1a1a", hair: "#4a2c17" },
  allowedRegionTags: ["skin", "outfit", "eyes", "hair"],
  paletteOptions: [{}, { outfit: "#ff5533" }, { outfit: "#33aa55", hair: "#111111" }],
};

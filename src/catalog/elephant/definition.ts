import type { ObjectDefinition } from "../../core/types";
import { bodies, legs, trunks, ears } from "./parts";

export const elephantDefinition: ObjectDefinition = {
  name: "elephant",
  width: 14,
  height: 10,
  slots: [
    { name: "body", variants: bodies, position: { x: 2, y: 0 }, role: "body" },
    { name: "legFrontLeft", variants: legs, position: { x: 2, y: 6 }, role: "limb" },
    { name: "legFrontRight", variants: legs, position: { x: 5, y: 6 }, role: "limb" },
    { name: "legBackLeft", variants: legs, position: { x: 8, y: 6 }, role: "limb" },
    { name: "legBackRight", variants: legs, position: { x: 10, y: 6 }, role: "limb" },
    { name: "trunk", variants: trunks, position: { x: 0, y: 2 }, role: "accessory" },
    { name: "earLeft", variants: ears, position: { x: 2, y: 0 }, role: "accessory" },
    { name: "earRight", variants: ears, position: { x: 10, y: 0 }, role: "accessory" },
  ],
  defaultPalette: { hide: "#9a9a9a", eye: "#1a1a1a" },
  allowedRegionTags: ["hide", "eye"],
  paletteOptions: [{}, { hide: "#c9a0dc" }],
};

import type { ObjectDefinition } from "../../../core/types";
import { saucers, domes } from "./parts";

export const ufoDefinition: ObjectDefinition = {
  name: "ufo",
  width: 8,
  height: 4,
  slots: [
    { name: "dome", variants: domes, position: { x: 2, y: 0 }, role: "body" },
    { name: "saucer", variants: saucers, position: { x: 0, y: 2 }, role: "body" },
  ],
  defaultPalette: { saucer: "#999999", dome: "#66cccc", eye: "#ff3333" },
  allowedRegionTags: ["saucer", "dome", "eye"],
  paletteOptions: [{}, { saucer: "#5566ff" }, { dome: "#ffaa33" }],
};

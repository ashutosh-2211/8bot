import type { ObjectDefinition } from "../../core/types";
import { trunks, foliageClusters } from "./parts";

export const treeDefinition: ObjectDefinition = {
  name: "tree",
  width: 6,
  height: 9,
  slots: [
    { name: "foliage", variants: foliageClusters, position: { x: 0, y: 0 }, role: "body" },
    { name: "trunk", variants: trunks, position: { x: 2, y: 5 }, role: "body" },
  ],
  defaultPalette: { bark: "#6b4423", leaf: "#2e8b3d" },
  allowedRegionTags: ["bark", "leaf"],
  paletteOptions: [{}, { leaf: "#c96b2e" }, { leaf: "#3ddc84" }],
};

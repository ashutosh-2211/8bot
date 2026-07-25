import type { ObjectDefinition, Part } from "../../core/types";
import { trunks, foliageClusters, branches } from "./parts";

// branch0/branch1 default to a visible pod so createTree() isn't a bare pole;
// branch2/branch3 default to "none" so the silhouette stays readable. All four
// slots share the same three variants — only the default (variants[0]) differs.
function orderedBranches(defaultId: string): Part[] {
  const byId = new Map(branches.map((b) => [b.id, b]));
  const rest = branches.filter((b) => b.id !== defaultId);
  return [byId.get(defaultId)!, ...rest];
}

export const treeDefinition: ObjectDefinition = {
  name: "tree",
  width: 12,
  height: 11,
  slots: [
    { name: "foliage", variants: foliageClusters, position: { x: 3, y: 1 }, role: "body" },
    { name: "trunk", variants: trunks, position: { x: 5, y: 6 }, role: "body" },
    { name: "branch0", variants: orderedBranches("sphereBranch"), position: { x: 1, y: 3 }, role: "accessory" },
    { name: "branch1", variants: orderedBranches("oblongoidBranch"), position: { x: 8, y: 3 }, role: "accessory" },
    { name: "branch2", variants: orderedBranches("none"), position: { x: 0, y: 6 }, role: "accessory" },
    { name: "branch3", variants: orderedBranches("none"), position: { x: 9, y: 6 }, role: "accessory" },
  ],
  defaultPalette: { bark: "#6b4423", leaf: "#2e8b3d" },
  allowedRegionTags: ["bark", "leaf"],
  paletteOptions: [{}, { leaf: "#c96b2e" }, { leaf: "#3ddc84" }],
};

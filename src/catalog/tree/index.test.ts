import { describe, expect, it } from "vitest";
import { createTree, randomTree, treeDefinition } from "./index";

const BRANCH_SLOTS = ["branch0", "branch1", "branch2", "branch3"];

describe("tree catalog object", () => {
  it("composes with defaults", () => {
    const tree = createTree();
    expect(tree.pixels.length).toBeGreaterThan(0);
  });

  it("applies a palette override for a seasonal look", () => {
    const tree = createTree({ palette: { leaf: "#c96b2e" } });
    expect(tree.pixels.some((p) => p.color === "#c96b2e")).toBe(true);
  });

  it("randomTree is deterministic for a given seed", () => {
    expect(randomTree(3)).toEqual(randomTree(3));
  });

  it("declares 4 branch slots, each with a none/sphere/oblongoid choice", () => {
    for (const name of BRANCH_SLOTS) {
      const slot = treeDefinition.slots.find((s) => s.name === name);
      expect(slot).toBeDefined();
      const ids = slot!.variants.map((v) => v.id).sort();
      expect(ids).toEqual(["none", "oblongoidBranch", "sphereBranch"]);
    }
  });

  it("shows at least one branch by default, not the fully bare tree", () => {
    const bare = createTree({
      parts: { branch0: "none", branch1: "none", branch2: "none", branch3: "none" },
    });
    const defaultTree = createTree();
    expect(defaultTree.pixels.length).toBeGreaterThan(bare.pixels.length);
  });

  it("can compose a bare tree with zero visible branches", () => {
    const bare = createTree({
      parts: { branch0: "none", branch1: "none", branch2: "none", branch3: "none" },
    });
    const full = createTree({
      parts: {
        branch0: "sphereBranch",
        branch1: "sphereBranch",
        branch2: "sphereBranch",
        branch3: "sphereBranch",
      },
    });
    expect(bare.pixels.length).toBeLessThan(full.pixels.length);
  });

  it("puts an oblongoid-topped branch pixel where the sphere variant has none", () => {
    const sphereOnly = createTree({ parts: { branch0: "sphereBranch" } });
    const oblongoidOnly = createTree({ parts: { branch0: "oblongoidBranch" } });
    expect(oblongoidOnly.pixels.length).toBeGreaterThan(sphereOnly.pixels.length);
  });
});

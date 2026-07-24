import { describe, expect, it } from "vitest";
import { createTree, randomTree } from "./index";

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
});

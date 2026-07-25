import type { Pixel, PixelGrid, SlotDefinition } from "../../core/types";

export function matrix(width: number, height: number): PixelGrid {
  return Array.from({ length: height }, () => Array<Pixel>(width).fill(null));
}

export function tagEdges(
  mask: boolean[][],
  width: number,
  height: number,
  interiorTag: Pixel,
  edgeTag: Pixel
): PixelGrid {
  const grid = matrix(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y][x]) continue;
      const onEdge =
        !mask[y]?.[x - 1] || !mask[y]?.[x + 1] || !mask[y - 1]?.[x] || !mask[y + 1]?.[x];
      grid[y][x] = onEdge ? edgeTag : interiorTag;
    }
  }
  return grid;
}

// Builds one SlotDefinition per region, all sharing a single body/edge
// silhouette classification computed across every region together — so a
// limb's boundary pixels are tagged "edge" using the whole figure's
// neighbors, not just its own small part. role: "limb" for regionNames
// listed in limbNames, so core/walkCycle.ts picks them up automatically.
export function buildSilhouetteSlots(
  width: number,
  height: number,
  regions: Record<string, boolean[][]>,
  limbNames: string[]
): SlotDefinition[] {
  const regionNames = Object.keys(regions);
  const fullMask = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => regionNames.some((name) => regions[name][y][x]))
  );
  const tagged = tagEdges(fullMask, width, height, "body", "edge");

  return regionNames.map((regionName) => {
    const grid = matrix(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (regions[regionName][y][x]) grid[y][x] = tagged[y][x];
      }
    }
    return {
      name: regionName,
      variants: [{ id: "generated", grid, anchor: { x: 0, y: 0 } }],
      position: { x: 0, y: 0 },
      role: limbNames.includes(regionName) ? "limb" : "body",
    };
  });
}

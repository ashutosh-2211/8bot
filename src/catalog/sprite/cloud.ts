import type { PixelGrid } from "../../core/types";
import { tagEdges } from "./stamps";

export function buildCloudGrid(
  rng: () => number,
  width: number,
  height: number,
  variance: number
): PixelGrid {
  const baseline = Math.round(height * 0.58);
  const puffCount = 4 + Math.floor(rng() * 3);
  const mask: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));

  for (let i = 0; i < puffCount; i++) {
    const puffX = ((i + 0.5) / puffCount) * width + (rng() - 0.5) * width * 0.1;
    const puffY = baseline - rng() * height * (0.15 + variance * 0.2);
    const radius = height * (0.16 + variance * 0.14) + rng() * height * 0.08;
    for (let y = 0; y < height; y++) {
      if (y > baseline + 1) continue;
      for (let x = 0; x < width; x++) {
        const dx = x - puffX;
        const dy = (y - puffY) / 0.9;
        if (dx * dx + dy * dy <= radius * radius) mask[y][x] = true;
      }
    }
  }

  return tagEdges(mask, width, height, "cloud", "cloudEdge");
}

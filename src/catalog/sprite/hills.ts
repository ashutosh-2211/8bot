import type { Pixel, PixelGrid } from "../../core/types";
import { matrix } from "./stamps";

interface HillLayer {
  tag: Pixel;
  baseFrac: number;
  amp: number;
}

export function buildHillsGrid(
  rng: () => number,
  width: number,
  height: number,
  variance: number
): PixelGrid {
  const grid = matrix(width, height);
  const layers: HillLayer[] = [
    { tag: "hillFar", baseFrac: 0.42, amp: 0.08 + variance * 0.08 },
    { tag: "hillMid", baseFrac: 0.58, amp: 0.1 + variance * 0.1 },
    { tag: "hillNear", baseFrac: 0.74, amp: 0.12 + variance * 0.14 },
  ];

  for (const layer of layers) {
    let height_ = layer.baseFrac * height;
    for (let x = 0; x < width; x++) {
      height_ += (rng() - 0.5) * layer.amp * height * 0.6;
      height_ = Math.min(height * 0.92, Math.max(height * 0.22, height_));
      const startY = Math.round(height_);
      for (let y = startY; y < height; y++) grid[y][x] = layer.tag;
    }
  }

  return grid;
}

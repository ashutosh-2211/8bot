import type { PixelGrid } from "../../core/types";
import { tagEdges } from "./stamps";

export function buildMaskGrid(
  rng: () => number,
  width: number,
  height: number,
  density: number
): PixelGrid {
  const halfWidth = Math.ceil(width / 2);
  const threshold = 0.3 + density * 0.35;
  const half: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < halfWidth; x++) {
      const edgeBias = x === halfWidth - 1 ? 0.12 : 0;
      row.push(rng() < threshold + edgeBias);
    }
    half.push(row);
  }
  const mask = half.map((row) => row.concat([...row].reverse()).slice(0, width));
  return tagEdges(mask, width, height, "body", "edge");
}

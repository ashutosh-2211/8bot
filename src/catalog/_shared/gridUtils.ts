import type { Pixel, PixelGrid } from "../../core/types";

export function filled(rows: number, cols: number, tag: Pixel): PixelGrid {
  return Array.from({ length: rows }, () => Array<Pixel>(cols).fill(tag));
}

export function withPixels(
  grid: PixelGrid,
  overrides: Array<[row: number, col: number, tag: Pixel]>
): PixelGrid {
  const copy = grid.map((row) => [...row]);
  for (const [row, col, tag] of overrides) {
    copy[row][col] = tag;
  }
  return copy;
}

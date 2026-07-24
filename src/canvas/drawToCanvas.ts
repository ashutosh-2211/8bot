import type { ComposedObject } from "../core/types";

export interface DrawOptions {
  pixelSize?: number;
  mode?: "flat" | "isometric";
}

export function drawToCanvas(
  ctx: CanvasRenderingContext2D,
  object: ComposedObject,
  options: DrawOptions = {}
): void {
  const pixelSize = options.pixelSize ?? 1;
  const mode = options.mode ?? "flat";
  const pixels =
    mode === "isometric"
      ? [...object.pixels].sort((a, b) => a.layer - b.layer)
      : object.pixels;

  for (const pixel of pixels) {
    const { x, y } = project(pixel.x, pixel.y, pixel.layer, mode);
    ctx.fillStyle = pixel.color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }
}

function project(
  x: number,
  y: number,
  layer: number,
  mode: "flat" | "isometric"
): { x: number; y: number } {
  if (mode !== "isometric") return { x, y };
  return { x: x + layer * 0.5, y: y - layer * 0.5 };
}

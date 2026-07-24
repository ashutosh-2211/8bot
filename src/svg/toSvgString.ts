import type { ComposedObject } from "../core/types";

export interface SvgOptions {
  pixelSize?: number;
  mode?: "flat" | "isometric";
}

export function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function toSvgString(object: ComposedObject, options: SvgOptions = {}): string {
  const pixelSize = options.pixelSize ?? 1;
  const mode = options.mode ?? "flat";
  const pixels =
    mode === "isometric"
      ? [...object.pixels].sort((a, b) => a.layer - b.layer)
      : object.pixels;

  const rects = pixels
    .map((pixel) => {
      const px = mode === "isometric" ? pixel.x + pixel.layer * 0.5 : pixel.x;
      const py = mode === "isometric" ? pixel.y - pixel.layer * 0.5 : pixel.y;
      return `<rect x="${px * pixelSize}" y="${py * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${escapeAttr(pixel.color)}" />`;
    })
    .join("");

  const width = object.width * pixelSize;
  const height = object.height * pixelSize;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects}</svg>`;
}

export function renderToSvgElement(
  object: ComposedObject,
  options: SvgOptions = {}
): SVGSVGElement {
  const svgString = toSvgString(object, options);
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  return doc.documentElement as unknown as SVGSVGElement;
}

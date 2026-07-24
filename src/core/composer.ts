import type {
  ObjectDefinition,
  ShapeDefinition,
  ComposedObject,
  ComposedPixel,
  Palette,
  Pose,
} from "./types";
import { resolvePalette, colorForRegion, lighten, darken, isValidHexColor } from "./palette";

export function compose(
  definition: ObjectDefinition,
  choices: Record<string, string> = {},
  paletteOverrides: Partial<Palette> = {},
  pose: Pose = {}
): ComposedObject {
  const palette = resolvePalette(definition, paletteOverrides);
  const pixels: ComposedPixel[] = [];

  for (const slot of definition.slots) {
    if (slot.variants.length === 0) {
      throw new Error(
        `Slot "${slot.name}" on object "${definition.name}" has no variants`
      );
    }
    const chosenId = choices[slot.name];
    const part = chosenId
      ? slot.variants.find((variant) => variant.id === chosenId)
      : slot.variants[0];
    if (!part) {
      throw new Error(
        `Unknown part id "${chosenId}" for slot "${slot.name}" on object "${definition.name}"`
      );
    }
    const layer = slot.layer ?? part.layer ?? 0;
    const offset = pose[slot.name] ?? {};
    const offsetX = offset.dx ?? 0;
    const offsetY = offset.dy ?? 0;
    part.grid.forEach((row, rowIndex) => {
      row.forEach((tag, colIndex) => {
        if (tag === null) return;
        pixels.push({
          x: slot.position.x + part.anchor.x + colIndex + offsetX,
          y: slot.position.y + part.anchor.y + rowIndex + offsetY,
          color: colorForRegion(palette, tag),
          layer,
        });
      });
    });
  }

  let maxPixelX = 0;
  let maxPixelY = 0;
  for (const pixel of pixels) {
    if (pixel.x > maxPixelX) maxPixelX = pixel.x;
    if (pixel.y > maxPixelY) maxPixelY = pixel.y;
  }
  const width = Math.max(definition.width, maxPixelX + 1);
  const height = Math.max(definition.height, maxPixelY + 1);

  return { name: definition.name, width, height, pixels };
}

export function composeShape(
  definition: ShapeDefinition,
  colorOverride?: string
): ComposedObject {
  if (colorOverride !== undefined && !isValidHexColor(colorOverride)) {
    throw new Error(
      `Invalid color "${colorOverride}" for shape "${definition.name}" — expected a 6-digit hex color like "#a1b2c3"`
    );
  }
  const baseColor = colorOverride ?? definition.defaultColor;
  const topColor = lighten(baseColor, 0.3);
  const sideColor = darken(baseColor, 0.3);
  const { width, height, kind } = definition;
  const bevel = Math.max(1, Math.round(Math.min(width, height) * 0.2));
  const pixels: ComposedPixel[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (kind === "sphere" && !isInsideEllipse(x, y, width, height)) continue;
      let color = baseColor;
      if (y < bevel) {
        color = topColor;
      } else if (x >= width - bevel) {
        color = sideColor;
      }
      pixels.push({ x, y, color, layer: 0 });
    }
  }

  return { name: definition.name, width, height, pixels };
}

function isInsideEllipse(x: number, y: number, width: number, height: number): boolean {
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const rx = width / 2;
  const ry = height / 2;
  const nx = (x - cx) / rx;
  const ny = (y - cy) / ry;
  return nx * nx + ny * ny <= 1;
}

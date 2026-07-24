import type { Palette, ObjectDefinition } from "./types";

export function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function resolvePalette(
  definition: ObjectDefinition,
  overrides: Partial<Palette> = {}
): Palette {
  for (const tag of Object.keys(overrides)) {
    if (!definition.allowedRegionTags.includes(tag)) {
      throw new Error(
        `"${tag}" is not a valid region tag for object "${definition.name}". Allowed: ${definition.allowedRegionTags.join(", ")}`
      );
    }
  }
  const filtered: Palette = {};
  for (const [tag, color] of Object.entries(overrides)) {
    if (color !== undefined) {
      if (!isValidHexColor(color)) {
        throw new Error(
          `Invalid color "${color}" for region "${tag}" — expected a 6-digit hex color like "#a1b2c3"`
        );
      }
      filtered[tag] = color;
    }
  }
  return { ...definition.defaultPalette, ...filtered };
}

export function colorForRegion(palette: Palette, tag: string): string {
  const color = palette[tag];
  if (!color) {
    throw new Error(`No color defined for region "${tag}"`);
  }
  return color;
}

export function lighten(hex: string, amount: number): string {
  return shift(hex, amount);
}

export function darken(hex: string, amount: number): string {
  return shift(hex, -amount);
}

function shift(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = clamp(((num >> 16) & 0xff) + Math.round(255 * amount));
  const g = clamp(((num >> 8) & 0xff) + Math.round(255 * amount));
  const b = clamp((num & 0xff) + Math.round(255 * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, value));
}

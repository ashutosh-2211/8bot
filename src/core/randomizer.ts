import type { ObjectDefinition, Palette } from "./types";

export interface RandomChoice {
  choices: Record<string, string>;
  palette: Partial<Palette>;
}

export function mulberry32(seed: number): () => number {
  let t = seed;
  return function next(): number {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomize(definition: ObjectDefinition, seed?: number): RandomChoice {
  const rng = mulberry32(seed ?? Date.now());
  const choices: Record<string, string> = {};
  for (const slot of definition.slots) {
    if (slot.variants.length === 0) continue;
    const index = Math.floor(rng() * slot.variants.length);
    choices[slot.name] = slot.variants[index].id;
  }
  const paletteOptions =
    definition.paletteOptions && definition.paletteOptions.length > 0
      ? definition.paletteOptions
      : [{}];
  const palette = paletteOptions[Math.floor(rng() * paletteOptions.length)];
  return { choices, palette };
}

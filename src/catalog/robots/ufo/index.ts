import { compose } from "../../../core/composer";
import { registerObject } from "../../../core/registry";
import { randomize } from "../../../core/randomizer";
import type { Palette } from "../../../core/types";
import { ufoDefinition } from "./definition";

registerObject(ufoDefinition);

export interface CreateUfoOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createUfo(options: CreateUfoOptions = {}) {
  return compose(ufoDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomUfo(seed?: number) {
  const { choices, palette } = randomize(ufoDefinition, seed);
  return compose(ufoDefinition, choices, palette);
}

export { ufoDefinition };

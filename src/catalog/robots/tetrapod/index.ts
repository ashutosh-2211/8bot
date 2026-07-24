import { compose } from "../../../core/composer";
import { registerObject } from "../../../core/registry";
import { randomize } from "../../../core/randomizer";
import type { Palette, Pose } from "../../../core/types";
import { tetrapodDefinition } from "./definition";

registerObject(tetrapodDefinition);

export interface CreateTetrapodOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
  pose?: Pose;
}

export function createTetrapod(options: CreateTetrapodOptions = {}) {
  return compose(tetrapodDefinition, options.parts ?? {}, options.palette ?? {}, options.pose ?? {});
}

export function randomTetrapod(seed?: number) {
  const { choices, palette } = randomize(tetrapodDefinition, seed);
  return compose(tetrapodDefinition, choices, palette);
}

export { tetrapodDefinition };

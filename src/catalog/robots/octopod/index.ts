import { compose } from "../../../core/composer";
import { registerObject } from "../../../core/registry";
import { randomize } from "../../../core/randomizer";
import type { Palette, Pose } from "../../../core/types";
import { octopodDefinition } from "./definition";

registerObject(octopodDefinition);

export interface CreateOctopodOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
  pose?: Pose;
}

export function createOctopod(options: CreateOctopodOptions = {}) {
  return compose(octopodDefinition, options.parts ?? {}, options.palette ?? {}, options.pose ?? {});
}

export function randomOctopod(seed?: number) {
  const { choices, palette } = randomize(octopodDefinition, seed);
  return compose(octopodDefinition, choices, palette);
}

export { octopodDefinition };

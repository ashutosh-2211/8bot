import { compose } from "../../core/composer";
import { registerObject } from "../../core/registry";
import { randomize } from "../../core/randomizer";
import type { Palette, Pose } from "../../core/types";
import { elephantDefinition } from "./definition";

registerObject(elephantDefinition);

export interface CreateElephantOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
  pose?: Pose;
}

export function createElephant(options: CreateElephantOptions = {}) {
  return compose(elephantDefinition, options.parts ?? {}, options.palette ?? {}, options.pose ?? {});
}

export function randomElephant(seed?: number) {
  const { choices, palette } = randomize(elephantDefinition, seed);
  return compose(elephantDefinition, choices, palette);
}

export { elephantDefinition };

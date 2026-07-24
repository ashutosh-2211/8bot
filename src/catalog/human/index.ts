import { compose } from "../../core/composer";
import { registerObject } from "../../core/registry";
import { randomize } from "../../core/randomizer";
import type { Palette, Pose } from "../../core/types";
import { humanDefinition } from "./definition";

registerObject(humanDefinition);

export interface CreateHumanOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
  pose?: Pose;
}

export function createHuman(options: CreateHumanOptions = {}) {
  return compose(humanDefinition, options.parts ?? {}, options.palette ?? {}, options.pose ?? {});
}

export function randomHuman(seed?: number) {
  const { choices, palette } = randomize(humanDefinition, seed);
  return compose(humanDefinition, choices, palette);
}

export { humanDefinition };

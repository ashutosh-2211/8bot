import { compose } from "../../../core/composer";
import { registerObject } from "../../../core/registry";
import { randomize } from "../../../core/randomizer";
import type { Palette, Pose } from "../../../core/types";
import { flyingBotDefinition } from "./definition";

registerObject(flyingBotDefinition);

export interface CreateFlyingBotOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
  pose?: Pose;
}

export function createFlyingBot(options: CreateFlyingBotOptions = {}) {
  return compose(flyingBotDefinition, options.parts ?? {}, options.palette ?? {}, options.pose ?? {});
}

export function randomFlyingBot(seed?: number) {
  const { choices, palette } = randomize(flyingBotDefinition, seed);
  return compose(flyingBotDefinition, choices, palette);
}

export { flyingBotDefinition };

import { compose } from "../../core/composer";
import { registerObject } from "../../core/registry";
import { randomize } from "../../core/randomizer";
import type { Palette } from "../../core/types";
import { treeDefinition } from "./definition";

registerObject(treeDefinition);

export interface CreateTreeOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createTree(options: CreateTreeOptions = {}) {
  return compose(treeDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomTree(seed?: number) {
  const { choices, palette } = randomize(treeDefinition, seed);
  return compose(treeDefinition, choices, palette);
}

export { treeDefinition };

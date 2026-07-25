import type { ComposedObject, ObjectDefinition, Palette, Pose } from "../../core/types";
import { mulberry32 } from "../../core/randomizer";
import { compose } from "../../core/composer";
import { darken } from "../../core/palette";
import { matrix } from "./stamps";
import { buildMaskGrid } from "./mask";
import { buildCloudGrid } from "./cloud";
import { buildHillsGrid } from "./hills";
import { buildHumanDefinition } from "./human";
import { buildAnimalDefinition } from "./animal";
import { buildBirdDefinition } from "./bird";

export type SpriteSubject = "mask" | "human" | "animal" | "bird" | "cloud" | "hills";

export interface CreateSpriteOptions {
  subject?: SpriteSubject;
  seed?: number;
  size?: { width: number; height: number };
  variance?: number;
  palette?: Partial<Palette>;
  pose?: Pose;
}

interface SpriteBuilder {
  defaultSize: { width: number; height: number };
  build: (rng: () => number, width: number, height: number, variance: number) => ObjectDefinition;
}

function singleSlotDefinition(
  name: string,
  width: number,
  height: number,
  grid: ReturnType<typeof matrix>,
  defaultPalette: Palette,
  allowedRegionTags: string[]
): ObjectDefinition {
  return {
    name,
    width,
    height,
    slots: [
      { name: "shape", variants: [{ id: "generated", grid, anchor: { x: 0, y: 0 } }], position: { x: 0, y: 0 }, role: "body" },
    ],
    defaultPalette,
    allowedRegionTags,
  };
}

const BUILDERS: Record<SpriteSubject, SpriteBuilder> = {
  mask: {
    defaultSize: { width: 12, height: 12 },
    build: (rng, w, h, v) =>
      singleSlotDefinition(
        "sprite-mask",
        w,
        h,
        buildMaskGrid(rng, w, h, v),
        { body: "#d9942f", edge: darken("#d9942f", 0.4) },
        ["body", "edge"]
      ),
  },
  cloud: {
    defaultSize: { width: 24, height: 12 },
    build: (rng, w, h, v) =>
      singleSlotDefinition(
        "sprite-cloud",
        w,
        h,
        buildCloudGrid(rng, w, h, v),
        { cloud: "#eaf4f1", cloudEdge: darken("#eaf4f1", 0.22) },
        ["cloud", "cloudEdge"]
      ),
  },
  hills: {
    defaultSize: { width: 24, height: 14 },
    build: (rng, w, h, v) =>
      singleSlotDefinition(
        "sprite-hills",
        w,
        h,
        buildHillsGrid(rng, w, h, v),
        { hillFar: "#2c4258", hillMid: "#2f6b6a", hillNear: "#24544f" },
        ["hillFar", "hillMid", "hillNear"]
      ),
  },
  human: { defaultSize: { width: 14, height: 18 }, build: buildHumanDefinition },
  animal: { defaultSize: { width: 18, height: 14 }, build: buildAnimalDefinition },
  bird: { defaultSize: { width: 14, height: 14 }, build: buildBirdDefinition },
};

export function spriteDefinition(options: CreateSpriteOptions = {}): ObjectDefinition {
  const subject = options.subject ?? "mask";
  const builder = BUILDERS[subject];
  const { width, height } = options.size ?? builder.defaultSize;
  const rng = mulberry32(options.seed ?? Date.now());
  return builder.build(rng, width, height, options.variance ?? 0.5);
}

export function createSprite(options: CreateSpriteOptions = {}): ComposedObject {
  const definition = spriteDefinition(options);
  return compose(definition, {}, options.palette ?? {}, options.pose ?? {});
}

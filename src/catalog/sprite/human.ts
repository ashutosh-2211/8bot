import type { ObjectDefinition } from "../../core/types";
import { darken } from "../../core/palette";
import { buildSilhouetteSlots } from "./stamps";

type RegionName = "head" | "torso" | "armL" | "armR" | "legL" | "legR";

function emptyRegions(width: number, height: number): Record<RegionName, boolean[][]> {
  const blank = () =>
    Array.from({ length: height }, () => Array<boolean>(width).fill(false));
  return { head: blank(), torso: blank(), armL: blank(), armR: blank(), legL: blank(), legR: blank() };
}

export function buildHumanDefinition(
  rng: () => number,
  width: number,
  height: number,
  variance: number
): ObjectDefinition {
  const cx = (width - 1) / 2;
  const j = 0.5 + variance * 0.7;
  const headR = 1.5 + rng() * 0.5 * j;
  const headCy = 1.5;
  const torsoTop = Math.round(headCy + headR + 0.6);
  const torsoBottom = Math.round(height * 0.58);
  const torsoHalfW = 1.5 + rng() * 0.5 * j;
  const armHalfW = torsoHalfW + 1.3 + rng() * 0.4 * j;
  const armBottom = torsoBottom - 1 - Math.floor(rng() * 2);
  const legGap = 0.3 + rng() * 0.15;
  const legHalfOuter = legGap + 1.5 + rng() * 0.3 * j;

  const regions = emptyRegions(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = x - cx;
      const dx = Math.abs(sx);
      if ((dx * dx) / (headR * headR) + ((y - headCy) * (y - headCy)) / ((headR * 1.15) * (headR * 1.15)) <= 1) {
        regions.head[y][x] = true;
      }
      if (y >= torsoTop && y <= torsoBottom && dx <= torsoHalfW) {
        regions.torso[y][x] = true;
      }
      if (y >= torsoTop && y <= armBottom && dx > torsoHalfW && dx <= armHalfW) {
        regions[sx < 0 ? "armL" : "armR"][y][x] = true;
      }
      if (y > torsoBottom && y < height && dx >= legGap && dx <= legHalfOuter) {
        regions[sx < 0 ? "legL" : "legR"][y][x] = true;
      }
    }
  }

  const slots = buildSilhouetteSlots(width, height, regions, ["armL", "armR", "legL", "legR"]);
  const bodyColor = "#d9942f";
  return {
    name: "sprite-human",
    width,
    height,
    slots,
    defaultPalette: { body: bodyColor, edge: darken(bodyColor, 0.4) },
    allowedRegionTags: ["body", "edge"],
  };
}

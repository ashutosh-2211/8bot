import type { ObjectDefinition } from "../../core/types";
import { darken } from "../../core/palette";
import { buildSilhouetteSlots } from "./stamps";

type RegionName = "head" | "body" | "legL" | "legR";

function emptyRegions(width: number, height: number): Record<RegionName, boolean[][]> {
  const blank = () => Array.from({ length: height }, () => Array<boolean>(width).fill(false));
  return { head: blank(), body: blank(), legL: blank(), legR: blank() };
}

export function buildAnimalDefinition(
  rng: () => number,
  width: number,
  height: number,
  variance: number
): ObjectDefinition {
  const cx = (width - 1) / 2;
  const j = 0.5 + variance * 0.7;
  const earR = 0.8 + rng() * 0.3 * j;
  const earOffset = 1.6 + rng() * 0.4;
  const headR = 1.9 + rng() * 0.4 * j;
  const headCy = 2.1;
  const earCy = headCy - headR * 0.85;
  const bodyTop = headCy + headR + 0.5;
  const bodyBottom = Math.round(height * 0.62);
  const bodyHalfW = 2.4 + rng() * 0.8 * j;
  const legGap = 0.4 + rng() * 0.2;
  const legHalfOuter = legGap + 1.4 + rng() * 0.3 * j;

  const regions = emptyRegions(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = x - cx;
      const dx = Math.abs(sx);
      const earDx = dx - earOffset;
      if ((earDx * earDx) / (earR * earR) + ((y - earCy) * (y - earCy)) / (earR * earR) <= 1) {
        regions.head[y][x] = true;
      }
      if ((dx * dx) / (headR * headR) + ((y - headCy) * (y - headCy)) / ((headR * 1.05) * (headR * 1.05)) <= 1) {
        regions.head[y][x] = true;
      }
      if (y >= bodyTop && y <= bodyBottom) {
        const bodyMid = (bodyTop + bodyBottom) / 2;
        const bodyHalfH = (bodyBottom - bodyTop) / 2 || 1;
        const bt = y - bodyMid;
        if ((dx * dx) / (bodyHalfW * bodyHalfW) + (bt * bt) / (bodyHalfH * bodyHalfH * 1.3) <= 1) {
          regions.body[y][x] = true;
        }
      }
      if (y > bodyBottom && y < height && dx >= legGap && dx <= legHalfOuter) {
        regions[sx < 0 ? "legL" : "legR"][y][x] = true;
      }
    }
  }

  const slots = buildSilhouetteSlots(width, height, regions, ["legL", "legR"]);
  const bodyColor = "#3f9d92";
  return {
    name: "sprite-animal",
    width,
    height,
    slots,
    defaultPalette: { body: bodyColor, edge: darken(bodyColor, 0.4) },
    allowedRegionTags: ["body", "edge"],
  };
}

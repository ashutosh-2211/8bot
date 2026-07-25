import type { ObjectDefinition } from "../../core/types";
import { darken } from "../../core/palette";
import { matrix, buildSilhouetteSlots } from "./stamps";

type RegionName = "body" | "wingL" | "wingR";

function emptyRegions(width: number, height: number): Record<RegionName, boolean[][]> {
  const blank = () => Array.from({ length: height }, () => Array<boolean>(width).fill(false));
  return { body: blank(), wingL: blank(), wingR: blank() };
}

export function buildBirdDefinition(
  rng: () => number,
  width: number,
  height: number,
  variance: number
): ObjectDefinition {
  const cx = (width - 1) / 2;
  const j = 0.5 + variance * 0.7;
  const bodyCy = height * 0.55;
  const bodyRx = 2.2 + rng() * 0.6 * j;
  const bodyRy = 2.6 + rng() * 0.5 * j;
  const headR = 1.2 + rng() * 0.3 * j;
  const headCy = bodyCy - bodyRy - headR * 0.5;
  const wingSpan = bodyRx + 1.5 + rng() * 0.6 * j;
  const wingTop = bodyCy - bodyRy * 0.4;
  const wingBottom = bodyCy + bodyRy * 0.5;
  const legTop = Math.round(bodyCy + bodyRy * 0.7);

  const regions = emptyRegions(width, height);
  const beak = matrix(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = x - cx;
      const dx = Math.abs(sx);
      if ((dx * dx) / (bodyRx * bodyRx) + ((y - bodyCy) * (y - bodyCy)) / (bodyRy * bodyRy) <= 1) {
        regions.body[y][x] = true;
      }
      if ((dx * dx) / (headR * headR) + ((y - headCy) * (y - headCy)) / ((headR * 1.1) * (headR * 1.1)) <= 1) {
        regions.body[y][x] = true;
      }
      if (y >= legTop && y < height && dx >= 0.15 && dx <= 1.0) {
        regions.body[y][x] = true;
      }
      if (
        y >= Math.round(headCy + headR * 0.2) &&
        y <= Math.round(headCy + headR * 0.85) &&
        dx < 0.85
      ) {
        beak[y][x] = "accent";
      }
      if (y >= wingTop && y <= wingBottom) {
        const span = wingSpan - (Math.abs(y - bodyCy) / (wingBottom - wingTop || 1)) * 1.4;
        if (dx > bodyRx * 0.5 && dx <= span) {
          regions[sx < 0 ? "wingL" : "wingR"][y][x] = true;
        }
      }
    }
  }

  const slots = buildSilhouetteSlots(width, height, regions, ["wingL", "wingR"]);
  slots.push({
    name: "beak",
    variants: [{ id: "generated", grid: beak, anchor: { x: 0, y: 0 } }],
    position: { x: 0, y: 0 },
    role: "body",
  });

  const bodyColor = "#8fb3e0";
  return {
    name: "sprite-bird",
    width,
    height,
    slots,
    defaultPalette: { body: bodyColor, edge: darken(bodyColor, 0.4), accent: "#f4c56a" },
    allowedRegionTags: ["body", "edge", "accent"],
  };
}

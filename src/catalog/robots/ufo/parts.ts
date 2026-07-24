import type { Part } from "../../../core/types";
import { filled, withPixels } from "../../_shared/gridUtils";

export const saucers: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(2, 8, "saucer") },
];

export const domes: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(2, 4, "dome"), [
      [1, 1, "eye"],
      [1, 2, "eye"],
    ]),
  },
];

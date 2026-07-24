import type { Part } from "../../../core/types";
import { filled, withPixels } from "../../_shared/gridUtils";

export const bodies: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(4, 8, "chassis"), [
      [1, 3, "eye"],
      [1, 4, "eye"],
    ]),
  },
];

export const legs: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(3, 2, "joint") },
];

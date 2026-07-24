import type { Part } from "../../../core/types";
import { filled, withPixels } from "../../_shared/gridUtils";

export const bodies: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(4, 6, "chassis"), [
      [1, 2, "eye"],
      [1, 3, "eye"],
    ]),
  },
];

export const thrusters: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(2, 2, "thruster") },
];

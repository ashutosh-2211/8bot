import type { Part } from "../../core/types";
import { filled, withPixels } from "../_shared/gridUtils";

export const bodies: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(6, 10, "hide"), [[2, 0, "eye"]]),
  },
];

export const legs: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(4, 2, "hide") },
];

export const trunks: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(2, 3, "hide") },
];

export const ears: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(3, 2, "hide") },
];

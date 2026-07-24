import type { Part } from "../../core/types";
import { filled, withPixels } from "../_shared/gridUtils";

export const heads: Part[] = [
  {
    id: "round",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(5, 5, "skin"), [
      [0, 0, null],
      [0, 4, null],
      [1, 1, "eyes"],
      [1, 3, "eyes"],
      [0, 1, "hair"],
      [0, 2, "hair"],
      [0, 3, "hair"],
    ]),
  },
  {
    id: "square",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(5, 5, "skin"), [
      [1, 1, "eyes"],
      [1, 3, "eyes"],
      [0, 0, "hair"],
      [0, 1, "hair"],
      [0, 2, "hair"],
      [0, 3, "hair"],
      [0, 4, "hair"],
    ]),
  },
];

export const torsos: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(6, 5, "outfit") },
];

export const arms: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(5, 2, "skin") },
];

export const legs: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(6, 2, "outfit") },
];

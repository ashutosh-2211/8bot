import type { Part } from "../../core/types";
import { filled, withPixels } from "../_shared/gridUtils";

export const trunks: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(4, 2, "bark") },
];

export const foliageClusters: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(5, 6, "leaf") },
];

const emptyBranch: Part = {
  id: "none",
  anchor: { x: 0, y: 0 },
  grid: filled(3, 3, null),
};

const sphereBranch: Part = {
  id: "sphereBranch",
  anchor: { x: 0, y: 0 },
  grid: withPixels(filled(3, 3, null), [
    [0, 1, "leaf"],
    [1, 0, "leaf"],
    [1, 1, "leaf"],
    [1, 2, "leaf"],
    [2, 1, "bark"],
  ]),
};

const oblongoidBranch: Part = {
  id: "oblongoidBranch",
  anchor: { x: 0, y: 0 },
  grid: withPixels(filled(3, 3, null), [
    [0, 0, "leaf"],
    [0, 1, "leaf"],
    [0, 2, "leaf"],
    [1, 0, "leaf"],
    [1, 1, "leaf"],
    [1, 2, "leaf"],
    [2, 1, "bark"],
  ]),
};

export const branches: Part[] = [emptyBranch, sphereBranch, oblongoidBranch];

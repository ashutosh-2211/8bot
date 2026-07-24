import type { Part } from "../../core/types";
import { filled } from "../_shared/gridUtils";

export const trunks: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(4, 2, "bark") },
];

export const foliageClusters: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(5, 6, "leaf") },
];

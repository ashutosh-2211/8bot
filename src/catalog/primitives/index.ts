import { composeShape } from "../../core/composer";
import { registerShape } from "../../core/registry";
import { mulberry32 } from "../../core/randomizer";
import type { ShapeDefinition } from "../../core/types";

export const cubeDefinition: ShapeDefinition = {
  name: "cube",
  kind: "cube",
  width: 8,
  height: 8,
  defaultColor: "#4488cc",
};

export const oblongoidDefinition: ShapeDefinition = {
  name: "oblongoid",
  kind: "oblongoid",
  width: 12,
  height: 6,
  defaultColor: "#cc8844",
};

export const sphereDefinition: ShapeDefinition = {
  name: "sphere",
  kind: "sphere",
  width: 8,
  height: 8,
  defaultColor: "#44cc88",
};

registerShape(cubeDefinition);
registerShape(oblongoidDefinition);
registerShape(sphereDefinition);

const colorOptions = ["#4488cc", "#cc4444", "#ccaa44", "#8844cc"];

function pickColor(seed?: number): string {
  const rng = mulberry32(seed ?? Date.now());
  return colorOptions[Math.floor(rng() * colorOptions.length)];
}

export function createCube(color?: string) {
  return composeShape(cubeDefinition, color);
}

export function randomCube(seed?: number) {
  return composeShape(cubeDefinition, pickColor(seed));
}

export function createOblongoid(color?: string) {
  return composeShape(oblongoidDefinition, color);
}

export function randomOblongoid(seed?: number) {
  return composeShape(oblongoidDefinition, pickColor(seed));
}

export function createSphere(color?: string) {
  return composeShape(sphereDefinition, color);
}

export function randomSphere(seed?: number) {
  return composeShape(sphereDefinition, pickColor(seed));
}

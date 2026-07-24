import type { ObjectDefinition, ShapeDefinition } from "./types";

const objects = new Map<string, ObjectDefinition>();
const shapes = new Map<string, ShapeDefinition>();

function isDeepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function registerObject(definition: ObjectDefinition): void {
  const existing = objects.get(definition.name);
  if (existing) {
    if (isDeepEqual(existing, definition)) {
      return;
    }
    throw new Error(`Object "${definition.name}" already registered`);
  }
  objects.set(definition.name, definition);
}

export function getObject(name: string): ObjectDefinition {
  const definition = objects.get(name);
  if (!definition) {
    throw new Error(`Object "${name}" not registered`);
  }
  return definition;
}

export function listObjects(): string[] {
  return [...objects.keys()];
}

export function registerShape(definition: ShapeDefinition): void {
  const existing = shapes.get(definition.name);
  if (existing) {
    if (isDeepEqual(existing, definition)) {
      return;
    }
    throw new Error(`Shape "${definition.name}" already registered`);
  }
  shapes.set(definition.name, definition);
}

export function getShape(name: string): ShapeDefinition {
  const definition = shapes.get(name);
  if (!definition) {
    throw new Error(`Shape "${name}" not registered`);
  }
  return definition;
}

export function listShapes(): string[] {
  return [...shapes.keys()];
}

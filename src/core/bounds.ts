import type { ComposedObject, Position, Bounds } from "./types";

export function getBounds(
  object: ComposedObject,
  position: Position = { x: 0, y: 0 },
  pixelSize = 1
): Bounds {
  return {
    x: position.x,
    y: position.y,
    width: object.width * pixelSize,
    height: object.height * pixelSize,
  };
}

export function intersects(a: Bounds, b: Bounds): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

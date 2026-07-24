import { describe, expect, it, vi } from "vitest";
import { drawToCanvas } from "./drawToCanvas";
import type { ComposedObject } from "../core/types";

function fakeContext() {
  return {
    fillStyle: "",
    fillRect: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

const object: ComposedObject = {
  name: "test",
  width: 2,
  height: 1,
  pixels: [
    { x: 0, y: 0, color: "#111111", layer: 0 },
    { x: 1, y: 0, color: "#222222", layer: 1 },
  ],
};

describe("drawToCanvas", () => {
  it("draws one fillRect per pixel at flat coordinates by default", () => {
    const ctx = fakeContext();
    drawToCanvas(ctx, object);
    expect(ctx.fillRect).toHaveBeenCalledTimes(2);
    expect(ctx.fillRect).toHaveBeenNthCalledWith(1, 0, 0, 1, 1);
    expect(ctx.fillRect).toHaveBeenNthCalledWith(2, 1, 0, 1, 1);
  });

  it("scales by pixelSize", () => {
    const ctx = fakeContext();
    drawToCanvas(ctx, object, { pixelSize: 4 });
    expect(ctx.fillRect).toHaveBeenNthCalledWith(1, 0, 0, 4, 4);
    expect(ctx.fillRect).toHaveBeenNthCalledWith(2, 4, 0, 4, 4);
  });

  it("offsets by layer in isometric mode and draws lower layers first", () => {
    const ctx = fakeContext();
    drawToCanvas(ctx, object, { mode: "isometric" });
    expect(ctx.fillRect).toHaveBeenNthCalledWith(1, 0, 0, 1, 1);
    expect(ctx.fillRect).toHaveBeenNthCalledWith(2, 1.5, -0.5, 1, 1);
  });
});

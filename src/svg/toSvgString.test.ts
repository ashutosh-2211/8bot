import { describe, expect, it } from "vitest";
import { toSvgString, renderToSvgElement } from "./toSvgString";
import type { ComposedObject } from "../core/types";

const object: ComposedObject = {
  name: "test",
  width: 2,
  height: 1,
  pixels: [
    { x: 0, y: 0, color: "#111111", layer: 0 },
    { x: 1, y: 0, color: "#222222", layer: 0 },
  ],
};

describe("toSvgString", () => {
  it("produces an svg with the right viewBox and one rect per pixel", () => {
    const svg = toSvgString(object);
    expect(svg).toContain('viewBox="0 0 2 1"');
    expect(svg).toContain('fill="#111111"');
    expect(svg).toContain('fill="#222222"');
    expect(svg.match(/<rect/g)).toHaveLength(2);
  });

  it("scales by pixelSize", () => {
    const svg = toSvgString(object, { pixelSize: 3 });
    expect(svg).toContain('width="6"');
    expect(svg).toContain('height="3"');
  });
});

describe("renderToSvgElement", () => {
  it("parses to a real SVG element with the expected rect count", () => {
    const el = renderToSvgElement(object);
    expect(el.tagName.toLowerCase()).toBe("svg");
    expect(el.querySelectorAll("rect")).toHaveLength(2);
  });
});

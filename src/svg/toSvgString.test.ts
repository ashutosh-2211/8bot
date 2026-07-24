import { describe, expect, it } from "vitest";
import { toSvgString, renderToSvgElement, escapeAttr } from "./toSvgString";
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

  it("escapes a malicious color value so it cannot break out of the fill attribute", () => {
    // Bypasses compose/composeShape validation by hand-building a ComposedObject,
    // simulating any future path that might skip upstream hex validation.
    const malicious: ComposedObject = {
      name: "hacked",
      width: 1,
      height: 1,
      pixels: [
        { x: 0, y: 0, color: '"/><script>alert(1)</script><rect fill="#000', layer: 0 },
      ],
    };
    const svg = toSvgString(malicious);
    expect(svg).not.toContain("<script>");
    expect(svg.match(/<rect/g)).toHaveLength(1);
  });
});

describe("escapeAttr", () => {
  it("escapes ampersand, angle brackets, and quote characters", () => {
    expect(escapeAttr(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });
});

describe("renderToSvgElement", () => {
  it("parses to a real SVG element with the expected rect count", () => {
    const el = renderToSvgElement(object);
    expect(el.tagName.toLowerCase()).toBe("svg");
    expect(el.querySelectorAll("rect")).toHaveLength(2);
  });
});

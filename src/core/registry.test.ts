import { describe, expect, it } from "vitest";
import {
  registerObject,
  getObject,
  listObjects,
  registerShape,
  getShape,
  listShapes,
} from "./registry";
import type { ObjectDefinition, ShapeDefinition } from "./types";

const objectDef: ObjectDefinition = {
  name: "registry-test-object",
  width: 1,
  height: 1,
  slots: [],
  defaultPalette: {},
  allowedRegionTags: [],
};

const shapeDef: ShapeDefinition = {
  name: "registry-test-shape",
  kind: "cube",
  width: 1,
  height: 1,
  defaultColor: "#ffffff",
};

describe("object registry", () => {
  it("registers and retrieves an object definition", () => {
    registerObject(objectDef);
    expect(getObject("registry-test-object")).toBe(objectDef);
    expect(listObjects()).toContain("registry-test-object");
  });

  it("throws registering the same name twice", () => {
    expect(() => registerObject(objectDef)).toThrow(/already registered/);
  });

  it("throws getting an unregistered name", () => {
    expect(() => getObject("does-not-exist")).toThrow(/not registered/);
  });
});

describe("shape registry", () => {
  it("registers and retrieves a shape definition", () => {
    registerShape(shapeDef);
    expect(getShape("registry-test-shape")).toBe(shapeDef);
    expect(listShapes()).toContain("registry-test-shape");
  });
});

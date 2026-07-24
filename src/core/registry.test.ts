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

  it("throws registering a different definition under the same name", () => {
    const conflicting: ObjectDefinition = { ...objectDef, width: 99 };
    expect(() => registerObject(conflicting)).toThrow(/already registered/);
  });

  it("does not throw re-registering a deep-equal definition under the same name (e.g. HMR re-evaluation)", () => {
    const sameShapeDifferentReference: ObjectDefinition = {
      name: "registry-test-object",
      width: 1,
      height: 1,
      slots: [],
      defaultPalette: {},
      allowedRegionTags: [],
    };
    expect(() => registerObject(sameShapeDifferentReference)).not.toThrow();
    // the originally registered reference is preserved, not overwritten
    expect(getObject("registry-test-object")).toBe(objectDef);
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

  it("throws registering a different shape definition under the same name", () => {
    const conflicting: ShapeDefinition = { ...shapeDef, defaultColor: "#000000" };
    expect(() => registerShape(conflicting)).toThrow(/already registered/);
  });

  it("does not throw re-registering a deep-equal shape definition under the same name", () => {
    const sameShapeDifferentReference: ShapeDefinition = {
      name: "registry-test-shape",
      kind: "cube",
      width: 1,
      height: 1,
      defaultColor: "#ffffff",
    };
    expect(() => registerShape(sameShapeDifferentReference)).not.toThrow();
    expect(getShape("registry-test-shape")).toBe(shapeDef);
  });
});

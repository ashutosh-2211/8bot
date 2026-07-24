import { describe, expect, it } from "vitest";
import * as catalog from "./index";

describe("catalog barrel export", () => {
  it("exposes create/random functions for every v1 object", () => {
    const names = [
      "createHuman",
      "randomHuman",
      "createElephant",
      "randomElephant",
      "createTree",
      "randomTree",
      "createOctopod",
      "randomOctopod",
      "createTetrapod",
      "randomTetrapod",
      "createFlyingBot",
      "randomFlyingBot",
      "createUfo",
      "randomUfo",
      "createCube",
      "randomCube",
      "createOblongoid",
      "randomOblongoid",
      "createSphere",
      "randomSphere",
    ];
    for (const name of names) {
      expect(typeof (catalog as Record<string, unknown>)[name]).toBe("function");
    }
  });
});

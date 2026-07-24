import { describe, expect, it, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

// This test guards against a regression where each package subpath entry
// (index/core/catalog/canvas/svg) bundled its own copy of the module-level
// registry Maps, so registrations made via one entry point (e.g. importing
// "8bot/catalog" for its registration side effects) were invisible when
// reading the registry back via another entry point (e.g. "8bot/core").
//
// It exercises the actual built CJS output in dist/, since the bug only
// manifests across separately bundled entry points, not within the single
// module graph vitest uses when running against src/.
const rootDir = process.cwd();
const require = createRequire(import.meta.url);

describe("registry singleton across package entry points", () => {
  beforeAll(() => {
    const catalogEntry = path.join(rootDir, "dist/catalog/index.js");
    if (!existsSync(catalogEntry)) {
      execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
    }
  });

  it("shares registrations between dist/catalog and dist/core (CJS)", () => {
    require(path.join(rootDir, "dist/catalog/index.js"));
    delete require.cache[require.resolve(path.join(rootDir, "dist/core/index.js"))];
    const core = require(path.join(rootDir, "dist/core/index.js"));
    const objects = core.listObjects();
    expect(objects.length).toBeGreaterThan(0);
    expect(objects).toEqual(
      expect.arrayContaining(["human", "elephant", "tree", "octopod", "tetrapod", "flyingBot", "ufo"])
    );
  });
});

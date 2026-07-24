# 8bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `8bot` npm package — a framework-agnostic core for composing 8-bit pixel objects, a built-in catalog (Human, Elephant, Tree, Octopod, Tetrapod, Flying bot, UFO, Cube, Oblongoid, Sphere), and Canvas/SVG renderers, all published as one package with subpath exports.

**Architecture:** Three layers: `core` (Part/Palette/ObjectDefinition/ShapeDefinition types, a registry, a composer that turns chosen parts + a palette into a renderer-agnostic `ComposedObject`, and a seeded randomizer), `catalog` (built-in object definitions, one folder per object, each exposing `createX()`/`randomX()`), and `canvas`/`svg` (thin adapters that draw a `ComposedObject`). Same `ComposedObject` shape serves flat 2D and isometric 2.5D — layer number drives projection offset in the renderers.

**Tech Stack:** TypeScript, tsup (build), Vitest + jsdom (tests).

## Global Constraints

- Package name stays `8bot`; keep existing `package.json` fields (repository, author, license, bugs, homepage) from the current file — only add/replace what's needed for the build.
- No `Co-Authored-By: Claude` (or any AI co-author) trailer in any commit. Use short conventional-commit-style messages, e.g. `feat(core): add composer`.
- Palette customization is tagged-region based (region tag string → hex color), never raw palette-index based.
- The composer output (`ComposedObject`) must be plain data with no DOM/Canvas dependency, so both renderers and future custom adapters consume the same shape.
- Subpath exports required: `8bot`, `8bot/core`, `8bot/catalog`, `8bot/canvas`, `8bot/svg`.
- Every task that adds behavior must add a Vitest test co-located as `*.test.ts` next to the source file, and tests must pass before committing.

---

### Task 1: Project scaffolding

**Files:**
- Modify: `package.json`
- Create: `tsconfig.json`
- Create: `tsup.config.ts`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `src/index.ts` (placeholder export, replaced by later tasks)

**Interfaces:**
- Produces: `npm run build`, `npm test`, `npm run typecheck` scripts that later tasks rely on.

- [ ] **Step 1: Replace `package.json`**

```json
{
  "name": "8bot",
  "version": "1.0.0",
  "description": "This is a package consisting of all the random 8 bit pixeleted character generation for websites web games etc",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./core": {
      "types": "./dist/core/index.d.ts",
      "import": "./dist/core/index.mjs",
      "require": "./dist/core/index.js"
    },
    "./catalog": {
      "types": "./dist/catalog/index.d.ts",
      "import": "./dist/catalog/index.mjs",
      "require": "./dist/catalog/index.js"
    },
    "./canvas": {
      "types": "./dist/canvas/index.d.ts",
      "import": "./dist/canvas/index.mjs",
      "require": "./dist/canvas/index.js"
    },
    "./svg": {
      "types": "./dist/svg/index.d.ts",
      "import": "./dist/svg/index.mjs",
      "require": "./dist/svg/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/ashutosh-2211/8bot.git"
  },
  "author": "askash (ashutoshpatra1135@gmail.com)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/ashutosh-2211/8bot/issues"
  },
  "homepage": "https://github.com/ashutosh-2211/8bot#readme",
  "devDependencies": {
    "typescript": "^5.5.4",
    "tsup": "^8.2.4",
    "vitest": "^2.0.5",
    "jsdom": "^25.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `tsup.config.ts`**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "core/index": "src/core/index.ts",
    "catalog/index": "src/catalog/index.ts",
    "canvas/index": "src/canvas/index.ts",
    "svg/index": "src/svg/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules
dist
```

- [ ] **Step 6: Create placeholder `src/index.ts`**

```ts
export {};
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: installs typescript, tsup, vitest, jsdom with no errors.

- [ ] **Step 8: Verify scripts run on the placeholder**

Run: `npm run typecheck && npm test`
Expected: both pass (no tests yet is OK — vitest reports "no test files found" only if include glob matches nothing; that's fine at this stage).

- [ ] **Step 9: Commit**

```bash
git add package.json tsconfig.json tsup.config.ts vitest.config.ts .gitignore src/index.ts
git commit -m "chore: scaffold package tooling"
```

---

### Task 2: Core types

**Files:**
- Create: `src/core/types.ts`

**Interfaces:**
- Produces: `RegionTag`, `Pixel`, `PixelGrid`, `Part`, `Palette`, `SlotDefinition`, `ObjectDefinition`, `ShapeKind`, `ShapeDefinition`, `ComposedPixel`, `ComposedObject` — used by every later task.

- [ ] **Step 1: Write `src/core/types.ts`**

```ts
export type RegionTag = string;
export type Pixel = RegionTag | null;
export type PixelGrid = Pixel[][];

export interface Part {
  id: string;
  grid: PixelGrid;
  anchor: { x: number; y: number };
  layer?: number;
}

export interface Palette {
  [regionTag: string]: string;
}

export interface SlotDefinition {
  name: string;
  variants: Part[];
  position: { x: number; y: number };
  layer?: number;
}

export interface ObjectDefinition {
  name: string;
  width: number;
  height: number;
  slots: SlotDefinition[];
  defaultPalette: Palette;
  allowedRegionTags: string[];
  paletteOptions?: Array<Partial<Palette>>;
}

export type ShapeKind = "cube" | "oblongoid" | "sphere";

export interface ShapeDefinition {
  name: string;
  kind: ShapeKind;
  width: number;
  height: number;
  defaultColor: string;
}

export interface ComposedPixel {
  x: number;
  y: number;
  color: string;
  layer: number;
}

export interface ComposedObject {
  name: string;
  width: number;
  height: number;
  pixels: ComposedPixel[];
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS (types file has no logic, just needs to compile).

- [ ] **Step 3: Commit**

```bash
git add src/core/types.ts
git commit -m "feat(core): add shared types"
```

---

### Task 3: Palette resolution and color utilities

**Files:**
- Create: `src/core/palette.ts`
- Test: `src/core/palette.test.ts`

**Interfaces:**
- Consumes: `Palette`, `ObjectDefinition` from `src/core/types.ts` (Task 2).
- Produces: `resolvePalette(definition, overrides?): Palette`, `colorForRegion(palette, tag): string`, `lighten(hex, amount): string`, `darken(hex, amount): string` — used by `composer.ts` (Task 5).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { resolvePalette, colorForRegion, lighten, darken } from "./palette";
import type { ObjectDefinition } from "./types";

const definition: ObjectDefinition = {
  name: "test-object",
  width: 1,
  height: 1,
  slots: [],
  defaultPalette: { skin: "#e0ac69", outfit: "#3355ff" },
  allowedRegionTags: ["skin", "outfit"],
};

describe("resolvePalette", () => {
  it("returns the default palette with no overrides", () => {
    expect(resolvePalette(definition)).toEqual(definition.defaultPalette);
  });

  it("merges a valid override", () => {
    expect(resolvePalette(definition, { outfit: "#ff0000" })).toEqual({
      skin: "#e0ac69",
      outfit: "#ff0000",
    });
  });

  it("throws on an override for an unknown region tag", () => {
    expect(() => resolvePalette(definition, { hair: "#000000" })).toThrow(
      /hair/
    );
  });
});

describe("colorForRegion", () => {
  it("returns the color for a defined region", () => {
    expect(colorForRegion({ skin: "#e0ac69" }, "skin")).toBe("#e0ac69");
  });

  it("throws for an undefined region", () => {
    expect(() => colorForRegion({}, "skin")).toThrow(/skin/);
  });
});

describe("lighten/darken", () => {
  it("darken decreases channel values, lighten increases them", () => {
    const base = "#808080";
    const lighter = lighten(base, 0.2);
    const darker = darken(base, 0.2);
    expect(parseInt(lighter.slice(1), 16)).toBeGreaterThan(parseInt(base.slice(1), 16));
    expect(parseInt(darker.slice(1), 16)).toBeLessThan(parseInt(base.slice(1), 16));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/core/palette.test.ts`
Expected: FAIL with "Cannot find module './palette'".

- [ ] **Step 3: Write `src/core/palette.ts`**

```ts
import type { Palette, ObjectDefinition } from "./types";

export function resolvePalette(
  definition: ObjectDefinition,
  overrides: Partial<Palette> = {}
): Palette {
  for (const tag of Object.keys(overrides)) {
    if (!definition.allowedRegionTags.includes(tag)) {
      throw new Error(
        `"${tag}" is not a valid region tag for object "${definition.name}". Allowed: ${definition.allowedRegionTags.join(", ")}`
      );
    }
  }
  return { ...definition.defaultPalette, ...overrides };
}

export function colorForRegion(palette: Palette, tag: string): string {
  const color = palette[tag];
  if (!color) {
    throw new Error(`No color defined for region "${tag}"`);
  }
  return color;
}

export function lighten(hex: string, amount: number): string {
  return shift(hex, amount);
}

export function darken(hex: string, amount: number): string {
  return shift(hex, -amount);
}

function shift(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = clamp(((num >> 16) & 0xff) + Math.round(255 * amount));
  const g = clamp(((num >> 8) & 0xff) + Math.round(255 * amount));
  const b = clamp((num & 0xff) + Math.round(255 * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, value));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/core/palette.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/palette.ts src/core/palette.test.ts
git commit -m "feat(core): add palette resolution and color utils"
```

---

### Task 4: Registry

**Files:**
- Create: `src/core/registry.ts`
- Test: `src/core/registry.test.ts`

**Interfaces:**
- Consumes: `ObjectDefinition`, `ShapeDefinition` from `src/core/types.ts` (Task 2).
- Produces: `registerObject(definition)`, `getObject(name): ObjectDefinition`, `listObjects(): string[]`, `registerShape(definition)`, `getShape(name): ShapeDefinition`, `listShapes(): string[]` — used by catalog object modules (Tasks 10-17).

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/core/registry.test.ts`
Expected: FAIL with "Cannot find module './registry'".

- [ ] **Step 3: Write `src/core/registry.ts`**

```ts
import type { ObjectDefinition, ShapeDefinition } from "./types";

const objects = new Map<string, ObjectDefinition>();
const shapes = new Map<string, ShapeDefinition>();

export function registerObject(definition: ObjectDefinition): void {
  if (objects.has(definition.name)) {
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
  if (shapes.has(definition.name)) {
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/core/registry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/registry.ts src/core/registry.test.ts
git commit -m "feat(core): add object and shape registry"
```

---

### Task 5: Composer (`compose` and `composeShape`)

**Files:**
- Create: `src/core/composer.ts`
- Test: `src/core/composer.test.ts`

**Interfaces:**
- Consumes: `resolvePalette`, `colorForRegion`, `lighten`, `darken` from `src/core/palette.ts` (Task 3); `ObjectDefinition`, `ShapeDefinition`, `ComposedObject`, `Palette` from `src/core/types.ts` (Task 2).
- Produces: `compose(definition, choices?, paletteOverrides?): ComposedObject`, `composeShape(definition, colorOverride?): ComposedObject` — used by every catalog object (Tasks 10-17) and both renderers (Tasks 8-9).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { compose, composeShape } from "./composer";
import type { ObjectDefinition, ShapeDefinition } from "./types";

const square: ObjectDefinition = {
  name: "square",
  width: 2,
  height: 2,
  slots: [
    {
      name: "block",
      position: { x: 0, y: 0 },
      variants: [
        {
          id: "solid",
          anchor: { x: 0, y: 0 },
          grid: [
            ["fill", "fill"],
            ["fill", null],
          ],
        },
        {
          id: "hollow",
          anchor: { x: 0, y: 0 },
          grid: [
            ["fill", null],
            [null, "fill"],
          ],
        },
      ],
    },
  ],
  defaultPalette: { fill: "#112233" },
  allowedRegionTags: ["fill"],
};

describe("compose", () => {
  it("composes the default variant of each slot with the default palette", () => {
    const result = compose(square);
    expect(result.name).toBe("square");
    expect(result.pixels).toEqual([
      { x: 0, y: 0, color: "#112233", layer: 0 },
      { x: 1, y: 0, color: "#112233", layer: 0 },
      { x: 0, y: 1, color: "#112233", layer: 0 },
    ]);
  });

  it("selects a chosen variant", () => {
    const result = compose(square, { block: "hollow" });
    expect(result.pixels).toEqual([
      { x: 0, y: 0, color: "#112233", layer: 0 },
      { x: 1, y: 1, color: "#112233", layer: 0 },
    ]);
  });

  it("applies a palette override", () => {
    const result = compose(square, {}, { fill: "#ffffff" });
    expect(result.pixels.every((p) => p.color === "#ffffff")).toBe(true);
  });

  it("throws for an unknown variant id", () => {
    expect(() => compose(square, { block: "missing" })).toThrow(/Unknown part id/);
  });

  it("throws for a slot with no variants", () => {
    const empty: ObjectDefinition = { ...square, slots: [{ name: "block", position: { x: 0, y: 0 }, variants: [] }] };
    expect(() => compose(empty)).toThrow(/no variants/);
  });
});

describe("composeShape", () => {
  const cube: ShapeDefinition = {
    name: "cube",
    kind: "cube",
    width: 6,
    height: 6,
    defaultColor: "#4488cc",
  };

  it("fills the full width/height grid for a cube", () => {
    const result = composeShape(cube);
    expect(result.pixels).toHaveLength(36);
  });

  it("uses a lighter color for the top band and darker for the side band", () => {
    const result = composeShape(cube);
    const top = result.pixels.find((p) => p.y === 0 && p.x === 0)!;
    const side = result.pixels.find((p) => p.x === cube.width - 1 && p.y === cube.height - 1)!;
    const base = result.pixels.find((p) => p.x === 2 && p.y === 2)!;
    expect(top.color).not.toBe(base.color);
    expect(side.color).not.toBe(base.color);
    expect(top.color).not.toBe(side.color);
  });

  it("masks pixels outside the ellipse for a sphere", () => {
    const sphere: ShapeDefinition = { ...cube, name: "sphere", kind: "sphere" };
    const result = composeShape(sphere);
    expect(result.pixels.length).toBeLessThan(36);
    expect(result.pixels.some((p) => p.x === 0 && p.y === 0)).toBe(false);
  });

  it("respects a color override", () => {
    const result = composeShape(cube, "#00ff00");
    const base = result.pixels.find((p) => p.x === 2 && p.y === 2)!;
    expect(base.color).toBe("#00ff00");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/core/composer.test.ts`
Expected: FAIL with "Cannot find module './composer'".

- [ ] **Step 3: Write `src/core/composer.ts`**

```ts
import type {
  ObjectDefinition,
  ShapeDefinition,
  ComposedObject,
  ComposedPixel,
  Palette,
} from "./types";
import { resolvePalette, colorForRegion, lighten, darken } from "./palette";

export function compose(
  definition: ObjectDefinition,
  choices: Record<string, string> = {},
  paletteOverrides: Partial<Palette> = {}
): ComposedObject {
  const palette = resolvePalette(definition, paletteOverrides);
  const pixels: ComposedPixel[] = [];

  for (const slot of definition.slots) {
    if (slot.variants.length === 0) {
      throw new Error(
        `Slot "${slot.name}" on object "${definition.name}" has no variants`
      );
    }
    const chosenId = choices[slot.name];
    const part = chosenId
      ? slot.variants.find((variant) => variant.id === chosenId)
      : slot.variants[0];
    if (!part) {
      throw new Error(
        `Unknown part id "${chosenId}" for slot "${slot.name}" on object "${definition.name}"`
      );
    }
    const layer = slot.layer ?? part.layer ?? 0;
    part.grid.forEach((row, rowIndex) => {
      row.forEach((tag, colIndex) => {
        if (tag === null) return;
        pixels.push({
          x: slot.position.x + part.anchor.x + colIndex,
          y: slot.position.y + part.anchor.y + rowIndex,
          color: colorForRegion(palette, tag),
          layer,
        });
      });
    });
  }

  return { name: definition.name, width: definition.width, height: definition.height, pixels };
}

export function composeShape(
  definition: ShapeDefinition,
  colorOverride?: string
): ComposedObject {
  const baseColor = colorOverride ?? definition.defaultColor;
  const topColor = lighten(baseColor, 0.3);
  const sideColor = darken(baseColor, 0.3);
  const { width, height, kind } = definition;
  const bevel = Math.max(1, Math.round(Math.min(width, height) * 0.2));
  const pixels: ComposedPixel[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (kind === "sphere" && !isInsideEllipse(x, y, width, height)) continue;
      let color = baseColor;
      if (y < bevel) {
        color = topColor;
      } else if (x >= width - bevel) {
        color = sideColor;
      }
      pixels.push({ x, y, color, layer: 0 });
    }
  }

  return { name: definition.name, width, height, pixels };
}

function isInsideEllipse(x: number, y: number, width: number, height: number): boolean {
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const rx = width / 2;
  const ry = height / 2;
  const nx = (x - cx) / rx;
  const ny = (y - cy) / ry;
  return nx * nx + ny * ny <= 1;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/core/composer.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/composer.ts src/core/composer.test.ts
git commit -m "feat(core): add compose and composeShape"
```

---

### Task 6: Randomizer

**Files:**
- Create: `src/core/randomizer.ts`
- Test: `src/core/randomizer.test.ts`

**Interfaces:**
- Consumes: `ObjectDefinition`, `Palette` from `src/core/types.ts` (Task 2).
- Produces: `mulberry32(seed): () => number`, `randomize(definition, seed?): { choices: Record<string,string>; palette: Partial<Palette> }` — used by every catalog object's `randomX()` (Tasks 10-17).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { mulberry32, randomize } from "./randomizer";
import type { ObjectDefinition } from "./types";

describe("mulberry32", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(7);
    const b = mulberry32(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays within [0, 1)", () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 50; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

const definition: ObjectDefinition = {
  name: "randomizer-test-object",
  width: 1,
  height: 1,
  slots: [
    {
      name: "head",
      position: { x: 0, y: 0 },
      variants: [
        { id: "a", anchor: { x: 0, y: 0 }, grid: [["x"]] },
        { id: "b", anchor: { x: 0, y: 0 }, grid: [["x"]] },
      ],
    },
  ],
  defaultPalette: { x: "#000000" },
  allowedRegionTags: ["x"],
  paletteOptions: [{}, { x: "#ffffff" }],
};

describe("randomize", () => {
  it("is deterministic for a given seed", () => {
    const a = randomize(definition, 99);
    const b = randomize(definition, 99);
    expect(a).toEqual(b);
  });

  it("only picks variant ids that exist on the slot", () => {
    const { choices } = randomize(definition, 5);
    expect(["a", "b"]).toContain(choices.head);
  });

  it("only picks a palette from paletteOptions", () => {
    const { palette } = randomize(definition, 5);
    expect(definition.paletteOptions).toContainEqual(palette);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/core/randomizer.test.ts`
Expected: FAIL with "Cannot find module './randomizer'".

- [ ] **Step 3: Write `src/core/randomizer.ts`**

```ts
import type { ObjectDefinition, Palette } from "./types";

export interface RandomChoice {
  choices: Record<string, string>;
  palette: Partial<Palette>;
}

export function mulberry32(seed: number): () => number {
  let t = seed;
  return function next(): number {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomize(definition: ObjectDefinition, seed?: number): RandomChoice {
  const rng = mulberry32(seed ?? Date.now());
  const choices: Record<string, string> = {};
  for (const slot of definition.slots) {
    if (slot.variants.length === 0) continue;
    const index = Math.floor(rng() * slot.variants.length);
    choices[slot.name] = slot.variants[index].id;
  }
  const paletteOptions =
    definition.paletteOptions && definition.paletteOptions.length > 0
      ? definition.paletteOptions
      : [{}];
  const palette = paletteOptions[Math.floor(rng() * paletteOptions.length)];
  return { choices, palette };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/core/randomizer.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/randomizer.ts src/core/randomizer.test.ts
git commit -m "feat(core): add seeded randomizer"
```

---

### Task 7: Core barrel export

**Files:**
- Create: `src/core/index.ts`
- Test: `src/core/index.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 2-6.
- Produces: the `8bot/core` public surface relied on by the catalog (Tasks 10-17) and by consumers building custom objects.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import * as core from "./index";

describe("core barrel export", () => {
  it("exposes the full public API", () => {
    expect(typeof core.compose).toBe("function");
    expect(typeof core.composeShape).toBe("function");
    expect(typeof core.registerObject).toBe("function");
    expect(typeof core.getObject).toBe("function");
    expect(typeof core.registerShape).toBe("function");
    expect(typeof core.getShape).toBe("function");
    expect(typeof core.randomize).toBe("function");
    expect(typeof core.mulberry32).toBe("function");
    expect(typeof core.resolvePalette).toBe("function");
    expect(typeof core.colorForRegion).toBe("function");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/core/index.test.ts`
Expected: FAIL with "Cannot find module './index'".

- [ ] **Step 3: Write `src/core/index.ts`**

```ts
export * from "./types";
export * from "./palette";
export * from "./registry";
export * from "./composer";
export * from "./randomizer";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/core/index.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/index.ts src/core/index.test.ts
git commit -m "feat(core): add core barrel export"
```

---

### Task 8: Canvas renderer

**Files:**
- Create: `src/canvas/drawToCanvas.ts`
- Create: `src/canvas/index.ts`
- Test: `src/canvas/drawToCanvas.test.ts`

**Interfaces:**
- Consumes: `ComposedObject` from `src/core/types.ts` (Task 2).
- Produces: `drawToCanvas(ctx, object, options?): void` — public via `8bot/canvas`.

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/canvas/drawToCanvas.test.ts`
Expected: FAIL with "Cannot find module './drawToCanvas'".

- [ ] **Step 3: Write `src/canvas/drawToCanvas.ts`**

```ts
import type { ComposedObject } from "../core/types";

export interface DrawOptions {
  pixelSize?: number;
  mode?: "flat" | "isometric";
}

export function drawToCanvas(
  ctx: CanvasRenderingContext2D,
  object: ComposedObject,
  options: DrawOptions = {}
): void {
  const pixelSize = options.pixelSize ?? 1;
  const mode = options.mode ?? "flat";
  const pixels =
    mode === "isometric"
      ? [...object.pixels].sort((a, b) => a.layer - b.layer)
      : object.pixels;

  for (const pixel of pixels) {
    const { x, y } = project(pixel.x, pixel.y, pixel.layer, mode);
    ctx.fillStyle = pixel.color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }
}

function project(
  x: number,
  y: number,
  layer: number,
  mode: "flat" | "isometric"
): { x: number; y: number } {
  if (mode !== "isometric") return { x, y };
  return { x: x + layer * 0.5, y: y - layer * 0.5 };
}
```

- [ ] **Step 4: Write `src/canvas/index.ts`**

```ts
export * from "./drawToCanvas";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/canvas/drawToCanvas.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/canvas
git commit -m "feat(canvas): add drawToCanvas renderer"
```

---

### Task 9: SVG renderer

**Files:**
- Create: `src/svg/toSvgString.ts`
- Create: `src/svg/index.ts`
- Test: `src/svg/toSvgString.test.ts`

**Interfaces:**
- Consumes: `ComposedObject` from `src/core/types.ts` (Task 2).
- Produces: `toSvgString(object, options?): string`, `renderToSvgElement(object, options?): SVGSVGElement` — public via `8bot/svg`.

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/svg/toSvgString.test.ts`
Expected: FAIL with "Cannot find module './toSvgString'".

- [ ] **Step 3: Write `src/svg/toSvgString.ts`**

```ts
import type { ComposedObject } from "../core/types";

export interface SvgOptions {
  pixelSize?: number;
  mode?: "flat" | "isometric";
}

export function toSvgString(object: ComposedObject, options: SvgOptions = {}): string {
  const pixelSize = options.pixelSize ?? 1;
  const mode = options.mode ?? "flat";
  const pixels =
    mode === "isometric"
      ? [...object.pixels].sort((a, b) => a.layer - b.layer)
      : object.pixels;

  const rects = pixels
    .map((pixel) => {
      const px = mode === "isometric" ? pixel.x + pixel.layer * 0.5 : pixel.x;
      const py = mode === "isometric" ? pixel.y - pixel.layer * 0.5 : pixel.y;
      return `<rect x="${px * pixelSize}" y="${py * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${pixel.color}" />`;
    })
    .join("");

  const width = object.width * pixelSize;
  const height = object.height * pixelSize;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects}</svg>`;
}

export function renderToSvgElement(
  object: ComposedObject,
  options: SvgOptions = {}
): SVGSVGElement {
  const svgString = toSvgString(object, options);
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  return doc.documentElement as unknown as SVGSVGElement;
}
```

- [ ] **Step 4: Write `src/svg/index.ts`**

```ts
export * from "./toSvgString";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/svg/toSvgString.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/svg
git commit -m "feat(svg): add toSvgString and renderToSvgElement"
```

---

### Task 10: Catalog grid utilities + Human

**Files:**
- Create: `src/catalog/_shared/gridUtils.ts`
- Create: `src/catalog/human/parts.ts`
- Create: `src/catalog/human/definition.ts`
- Create: `src/catalog/human/index.ts`
- Test: `src/catalog/human/index.test.ts`

**Interfaces:**
- Consumes: `compose` from `src/core/composer.ts`, `registerObject` from `src/core/registry.ts`, `randomize` from `src/core/randomizer.ts`, `Palette`/`Part`/`PixelGrid`/`Pixel`/`ObjectDefinition` from `src/core/types.ts`.
- Produces: `filled(rows, cols, tag): PixelGrid` and `withPixels(grid, overrides): PixelGrid` in `_shared/gridUtils.ts` (reused by every later catalog task); `createHuman(options?)`, `randomHuman(seed?)`, `humanDefinition` from `catalog/human`.

- [ ] **Step 1: Write `src/catalog/_shared/gridUtils.ts`**

```ts
import type { Pixel, PixelGrid } from "../../core/types";

export function filled(rows: number, cols: number, tag: Pixel): PixelGrid {
  return Array.from({ length: rows }, () => Array<Pixel>(cols).fill(tag));
}

export function withPixels(
  grid: PixelGrid,
  overrides: Array<[row: number, col: number, tag: Pixel]>
): PixelGrid {
  const copy = grid.map((row) => [...row]);
  for (const [row, col, tag] of overrides) {
    copy[row][col] = tag;
  }
  return copy;
}
```

- [ ] **Step 2: Write `src/catalog/human/parts.ts`**

```ts
import type { Part } from "../../core/types";
import { filled, withPixels } from "../_shared/gridUtils";

export const heads: Part[] = [
  {
    id: "round",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(5, 5, "skin"), [
      [0, 0, null],
      [0, 4, null],
      [1, 1, "eyes"],
      [1, 3, "eyes"],
      [0, 1, "hair"],
      [0, 2, "hair"],
      [0, 3, "hair"],
    ]),
  },
  {
    id: "square",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(5, 5, "skin"), [
      [1, 1, "eyes"],
      [1, 3, "eyes"],
      [0, 0, "hair"],
      [0, 1, "hair"],
      [0, 2, "hair"],
      [0, 3, "hair"],
      [0, 4, "hair"],
    ]),
  },
];

export const torsos: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(6, 5, "outfit") },
];

export const arms: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(5, 2, "skin") },
];

export const legs: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(6, 2, "outfit") },
];
```

- [ ] **Step 3: Write `src/catalog/human/definition.ts`**

```ts
import type { ObjectDefinition } from "../../core/types";
import { heads, torsos, arms, legs } from "./parts";

export const humanDefinition: ObjectDefinition = {
  name: "human",
  width: 9,
  height: 17,
  slots: [
    { name: "head", variants: heads, position: { x: 2, y: 0 } },
    { name: "torso", variants: torsos, position: { x: 2, y: 5 } },
    { name: "armLeft", variants: arms, position: { x: 0, y: 5 } },
    { name: "armRight", variants: arms, position: { x: 7, y: 5 } },
    { name: "legLeft", variants: legs, position: { x: 2, y: 11 } },
    { name: "legRight", variants: legs, position: { x: 5, y: 11 } },
  ],
  defaultPalette: { skin: "#e0ac69", outfit: "#3355ff", eyes: "#1a1a1a", hair: "#4a2c17" },
  allowedRegionTags: ["skin", "outfit", "eyes", "hair"],
  paletteOptions: [{}, { outfit: "#ff5533" }, { outfit: "#33aa55", hair: "#111111" }],
};
```

- [ ] **Step 4: Write `src/catalog/human/index.ts`**

```ts
import { compose } from "../../core/composer";
import { registerObject } from "../../core/registry";
import { randomize } from "../../core/randomizer";
import type { Palette } from "../../core/types";
import { humanDefinition } from "./definition";

registerObject(humanDefinition);

export interface CreateHumanOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createHuman(options: CreateHumanOptions = {}) {
  return compose(humanDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomHuman(seed?: number) {
  const { choices, palette } = randomize(humanDefinition, seed);
  return compose(humanDefinition, choices, palette);
}

export { humanDefinition };
```

- [ ] **Step 5: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { createHuman, randomHuman } from "./index";

describe("human catalog object", () => {
  it("composes with default parts and palette", () => {
    const human = createHuman();
    expect(human.pixels.length).toBeGreaterThan(0);
    expect(human.pixels.every((p) => typeof p.color === "string")).toBe(true);
  });

  it("applies a palette override", () => {
    const human = createHuman({ palette: { outfit: "#00ff00" } });
    expect(human.pixels.some((p) => p.color === "#00ff00")).toBe(true);
  });

  it("selects a chosen variant part", () => {
    const defaultHead = createHuman();
    const squareHead = createHuman({ parts: { head: "square" } });
    expect(squareHead.pixels).not.toEqual(defaultHead.pixels);
  });

  it("randomHuman is deterministic for a given seed", () => {
    const a = randomHuman(42);
    const b = randomHuman(42);
    expect(a).toEqual(b);
  });
});
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/catalog/human/index.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/catalog/_shared src/catalog/human
git commit -m "feat(catalog): add human object"
```

---

### Task 11: Elephant

**Files:**
- Create: `src/catalog/elephant/parts.ts`
- Create: `src/catalog/elephant/definition.ts`
- Create: `src/catalog/elephant/index.ts`
- Test: `src/catalog/elephant/index.test.ts`

**Interfaces:**
- Consumes: `filled`, `withPixels` from `src/catalog/_shared/gridUtils.ts` (Task 10); `compose`, `registerObject`, `randomize` from core (Tasks 4-6).
- Produces: `createElephant(options?)`, `randomElephant(seed?)`, `elephantDefinition`.

- [ ] **Step 1: Write `src/catalog/elephant/parts.ts`**

```ts
import type { Part } from "../../core/types";
import { filled, withPixels } from "../_shared/gridUtils";

export const bodies: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(6, 10, "hide"), [[2, 0, "eye"]]),
  },
];

export const legs: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(4, 2, "hide") },
];

export const trunks: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(2, 3, "hide") },
];

export const ears: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(3, 2, "hide") },
];
```

- [ ] **Step 2: Write `src/catalog/elephant/definition.ts`**

```ts
import type { ObjectDefinition } from "../../core/types";
import { bodies, legs, trunks, ears } from "./parts";

export const elephantDefinition: ObjectDefinition = {
  name: "elephant",
  width: 14,
  height: 10,
  slots: [
    { name: "body", variants: bodies, position: { x: 2, y: 0 } },
    { name: "legFrontLeft", variants: legs, position: { x: 2, y: 6 } },
    { name: "legFrontRight", variants: legs, position: { x: 5, y: 6 } },
    { name: "legBackLeft", variants: legs, position: { x: 8, y: 6 } },
    { name: "legBackRight", variants: legs, position: { x: 10, y: 6 } },
    { name: "trunk", variants: trunks, position: { x: 0, y: 2 } },
    { name: "earLeft", variants: ears, position: { x: 2, y: 0 } },
    { name: "earRight", variants: ears, position: { x: 10, y: 0 } },
  ],
  defaultPalette: { hide: "#9a9a9a", eye: "#1a1a1a" },
  allowedRegionTags: ["hide", "eye"],
  paletteOptions: [{}, { hide: "#c9a0dc" }],
};
```

- [ ] **Step 3: Write `src/catalog/elephant/index.ts`**

```ts
import { compose } from "../../core/composer";
import { registerObject } from "../../core/registry";
import { randomize } from "../../core/randomizer";
import type { Palette } from "../../core/types";
import { elephantDefinition } from "./definition";

registerObject(elephantDefinition);

export interface CreateElephantOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createElephant(options: CreateElephantOptions = {}) {
  return compose(elephantDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomElephant(seed?: number) {
  const { choices, palette } = randomize(elephantDefinition, seed);
  return compose(elephantDefinition, choices, palette);
}

export { elephantDefinition };
```

- [ ] **Step 4: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { createElephant, randomElephant } from "./index";

describe("elephant catalog object", () => {
  it("composes with defaults", () => {
    const elephant = createElephant();
    expect(elephant.pixels.length).toBeGreaterThan(0);
  });

  it("applies a palette override", () => {
    const elephant = createElephant({ palette: { hide: "#c9a0dc" } });
    expect(elephant.pixels.some((p) => p.color === "#c9a0dc")).toBe(true);
  });

  it("randomElephant is deterministic for a given seed", () => {
    expect(randomElephant(11)).toEqual(randomElephant(11));
  });
});
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/catalog/elephant/index.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/catalog/elephant
git commit -m "feat(catalog): add elephant object"
```

---

### Task 12: Tree

**Files:**
- Create: `src/catalog/tree/parts.ts`
- Create: `src/catalog/tree/definition.ts`
- Create: `src/catalog/tree/index.ts`
- Test: `src/catalog/tree/index.test.ts`

**Interfaces:**
- Consumes: `filled` from `src/catalog/_shared/gridUtils.ts` (Task 10); `compose`, `registerObject`, `randomize` from core.
- Produces: `createTree(options?)`, `randomTree(seed?)`, `treeDefinition`.

- [ ] **Step 1: Write `src/catalog/tree/parts.ts`**

```ts
import type { Part } from "../../core/types";
import { filled } from "../_shared/gridUtils";

export const trunks: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(4, 2, "bark") },
];

export const foliageClusters: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(5, 6, "leaf") },
];
```

- [ ] **Step 2: Write `src/catalog/tree/definition.ts`**

```ts
import type { ObjectDefinition } from "../../core/types";
import { trunks, foliageClusters } from "./parts";

export const treeDefinition: ObjectDefinition = {
  name: "tree",
  width: 6,
  height: 9,
  slots: [
    { name: "foliage", variants: foliageClusters, position: { x: 0, y: 0 } },
    { name: "trunk", variants: trunks, position: { x: 2, y: 5 } },
  ],
  defaultPalette: { bark: "#6b4423", leaf: "#2e8b3d" },
  allowedRegionTags: ["bark", "leaf"],
  paletteOptions: [{}, { leaf: "#c96b2e" }, { leaf: "#3ddc84" }],
};
```

- [ ] **Step 3: Write `src/catalog/tree/index.ts`**

```ts
import { compose } from "../../core/composer";
import { registerObject } from "../../core/registry";
import { randomize } from "../../core/randomizer";
import type { Palette } from "../../core/types";
import { treeDefinition } from "./definition";

registerObject(treeDefinition);

export interface CreateTreeOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createTree(options: CreateTreeOptions = {}) {
  return compose(treeDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomTree(seed?: number) {
  const { choices, palette } = randomize(treeDefinition, seed);
  return compose(treeDefinition, choices, palette);
}

export { treeDefinition };
```

- [ ] **Step 4: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { createTree, randomTree } from "./index";

describe("tree catalog object", () => {
  it("composes with defaults", () => {
    const tree = createTree();
    expect(tree.pixels.length).toBeGreaterThan(0);
  });

  it("applies a palette override for a seasonal look", () => {
    const tree = createTree({ palette: { leaf: "#c96b2e" } });
    expect(tree.pixels.some((p) => p.color === "#c96b2e")).toBe(true);
  });

  it("randomTree is deterministic for a given seed", () => {
    expect(randomTree(3)).toEqual(randomTree(3));
  });
});
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/catalog/tree/index.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/catalog/tree
git commit -m "feat(catalog): add tree object"
```

---

### Task 13: Octopod robot

**Files:**
- Create: `src/catalog/robots/octopod/parts.ts`
- Create: `src/catalog/robots/octopod/definition.ts`
- Create: `src/catalog/robots/octopod/index.ts`
- Test: `src/catalog/robots/octopod/index.test.ts`

**Interfaces:**
- Consumes: `filled`, `withPixels` from `src/catalog/_shared/gridUtils.ts` (Task 10); `compose`, `registerObject`, `randomize` from core.
- Produces: `createOctopod(options?)`, `randomOctopod(seed?)`, `octopodDefinition`. Establishes the 8-slot variable-limb pattern reused (with different counts) by Tasks 14-15.

- [ ] **Step 1: Write `src/catalog/robots/octopod/parts.ts`**

```ts
import type { Part } from "../../../core/types";
import { filled, withPixels } from "../../_shared/gridUtils";

export const bodies: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(4, 6, "chassis"), [
      [1, 2, "eye"],
      [1, 3, "eye"],
    ]),
  },
];

export const legs: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(3, 1, "joint") },
];
```

- [ ] **Step 2: Write `src/catalog/robots/octopod/definition.ts`**

```ts
import type { ObjectDefinition, SlotDefinition } from "../../../core/types";
import { bodies, legs } from "./parts";

const legSlots: SlotDefinition[] = Array.from({ length: 8 }, (_, i) => ({
  name: `leg${i}`,
  variants: legs,
  position: { x: i, y: 4 },
}));

export const octopodDefinition: ObjectDefinition = {
  name: "octopod",
  width: 8,
  height: 7,
  slots: [{ name: "body", variants: bodies, position: { x: 1, y: 0 } }, ...legSlots],
  defaultPalette: { chassis: "#888888", joint: "#444444", eye: "#ff3333" },
  allowedRegionTags: ["chassis", "joint", "eye"],
  paletteOptions: [{}, { chassis: "#5577ff" }, { eye: "#33ff88" }],
};
```

- [ ] **Step 3: Write `src/catalog/robots/octopod/index.ts`**

```ts
import { compose } from "../../../core/composer";
import { registerObject } from "../../../core/registry";
import { randomize } from "../../../core/randomizer";
import type { Palette } from "../../../core/types";
import { octopodDefinition } from "./definition";

registerObject(octopodDefinition);

export interface CreateOctopodOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createOctopod(options: CreateOctopodOptions = {}) {
  return compose(octopodDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomOctopod(seed?: number) {
  const { choices, palette } = randomize(octopodDefinition, seed);
  return compose(octopodDefinition, choices, palette);
}

export { octopodDefinition };
```

- [ ] **Step 4: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { createOctopod, randomOctopod, octopodDefinition } from "./index";

describe("octopod catalog object", () => {
  it("declares 8 leg slots", () => {
    const legSlots = octopodDefinition.slots.filter((s) => s.name.startsWith("leg"));
    expect(legSlots).toHaveLength(8);
  });

  it("composes with defaults", () => {
    const octopod = createOctopod();
    expect(octopod.pixels.length).toBeGreaterThan(0);
  });

  it("randomOctopod is deterministic for a given seed", () => {
    expect(randomOctopod(21)).toEqual(randomOctopod(21));
  });
});
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/catalog/robots/octopod/index.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/catalog/robots/octopod
git commit -m "feat(catalog): add octopod robot"
```

---

### Task 14: Tetrapod robot

**Files:**
- Create: `src/catalog/robots/tetrapod/parts.ts`
- Create: `src/catalog/robots/tetrapod/definition.ts`
- Create: `src/catalog/robots/tetrapod/index.ts`
- Test: `src/catalog/robots/tetrapod/index.test.ts`

**Interfaces:**
- Consumes: `filled`, `withPixels` from `src/catalog/_shared/gridUtils.ts`; `compose`, `registerObject`, `randomize` from core.
- Produces: `createTetrapod(options?)`, `randomTetrapod(seed?)`, `tetrapodDefinition`.

- [ ] **Step 1: Write `src/catalog/robots/tetrapod/parts.ts`**

```ts
import type { Part } from "../../../core/types";
import { filled, withPixels } from "../../_shared/gridUtils";

export const bodies: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(4, 8, "chassis"), [
      [1, 3, "eye"],
      [1, 4, "eye"],
    ]),
  },
];

export const legs: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(3, 2, "joint") },
];
```

- [ ] **Step 2: Write `src/catalog/robots/tetrapod/definition.ts`**

```ts
import type { ObjectDefinition, SlotDefinition } from "../../../core/types";
import { bodies, legs } from "./parts";

const legSlots: SlotDefinition[] = [1, 5].flatMap((x) =>
  [0, 1].map((i): SlotDefinition => ({
    name: `leg${x}_${i}`,
    variants: legs,
    position: { x: x + i, y: 4 },
  }))
);

export const tetrapodDefinition: ObjectDefinition = {
  name: "tetrapod",
  width: 8,
  height: 7,
  slots: [{ name: "body", variants: bodies, position: { x: 0, y: 0 } }, ...legSlots],
  defaultPalette: { chassis: "#888888", joint: "#444444", eye: "#ff3333" },
  allowedRegionTags: ["chassis", "joint", "eye"],
  paletteOptions: [{}, { chassis: "#aa5533" }, { eye: "#33aaff" }],
};
```

- [ ] **Step 3: Write `src/catalog/robots/tetrapod/index.ts`**

```ts
import { compose } from "../../../core/composer";
import { registerObject } from "../../../core/registry";
import { randomize } from "../../../core/randomizer";
import type { Palette } from "../../../core/types";
import { tetrapodDefinition } from "./definition";

registerObject(tetrapodDefinition);

export interface CreateTetrapodOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createTetrapod(options: CreateTetrapodOptions = {}) {
  return compose(tetrapodDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomTetrapod(seed?: number) {
  const { choices, palette } = randomize(tetrapodDefinition, seed);
  return compose(tetrapodDefinition, choices, palette);
}

export { tetrapodDefinition };
```

- [ ] **Step 4: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { createTetrapod, randomTetrapod, tetrapodDefinition } from "./index";

describe("tetrapod catalog object", () => {
  it("declares 4 leg slots", () => {
    const legSlots = tetrapodDefinition.slots.filter((s) => s.name.startsWith("leg"));
    expect(legSlots).toHaveLength(4);
  });

  it("composes with defaults", () => {
    expect(createTetrapod().pixels.length).toBeGreaterThan(0);
  });

  it("randomTetrapod is deterministic for a given seed", () => {
    expect(randomTetrapod(8)).toEqual(randomTetrapod(8));
  });
});
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/catalog/robots/tetrapod/index.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/catalog/robots/tetrapod
git commit -m "feat(catalog): add tetrapod robot"
```

---

### Task 15: Flying bot

**Files:**
- Create: `src/catalog/robots/flyingBot/parts.ts`
- Create: `src/catalog/robots/flyingBot/definition.ts`
- Create: `src/catalog/robots/flyingBot/index.ts`
- Test: `src/catalog/robots/flyingBot/index.test.ts`

**Interfaces:**
- Consumes: `filled`, `withPixels` from `src/catalog/_shared/gridUtils.ts`; `compose`, `registerObject`, `randomize` from core.
- Produces: `createFlyingBot(options?)`, `randomFlyingBot(seed?)`, `flyingBotDefinition`.

- [ ] **Step 1: Write `src/catalog/robots/flyingBot/parts.ts`**

```ts
import type { Part } from "../../../core/types";
import { filled, withPixels } from "../../_shared/gridUtils";

export const bodies: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(4, 6, "chassis"), [
      [1, 2, "eye"],
      [1, 3, "eye"],
    ]),
  },
];

export const thrusters: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(2, 2, "thruster") },
];
```

- [ ] **Step 2: Write `src/catalog/robots/flyingBot/definition.ts`**

```ts
import type { ObjectDefinition } from "../../../core/types";
import { bodies, thrusters } from "./parts";

export const flyingBotDefinition: ObjectDefinition = {
  name: "flyingBot",
  width: 6,
  height: 6,
  slots: [
    { name: "body", variants: bodies, position: { x: 0, y: 0 } },
    { name: "thrusterLeft", variants: thrusters, position: { x: 0, y: 4 }, layer: -1 },
    { name: "thrusterRight", variants: thrusters, position: { x: 4, y: 4 }, layer: -1 },
  ],
  defaultPalette: { chassis: "#cccccc", thruster: "#3388ff", eye: "#ff3333" },
  allowedRegionTags: ["chassis", "thruster", "eye"],
  paletteOptions: [{}, { chassis: "#ffaa33" }, { thruster: "#ff33aa" }],
};
```

- [ ] **Step 3: Write `src/catalog/robots/flyingBot/index.ts`**

```ts
import { compose } from "../../../core/composer";
import { registerObject } from "../../../core/registry";
import { randomize } from "../../../core/randomizer";
import type { Palette } from "../../../core/types";
import { flyingBotDefinition } from "./definition";

registerObject(flyingBotDefinition);

export interface CreateFlyingBotOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createFlyingBot(options: CreateFlyingBotOptions = {}) {
  return compose(flyingBotDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomFlyingBot(seed?: number) {
  const { choices, palette } = randomize(flyingBotDefinition, seed);
  return compose(flyingBotDefinition, choices, palette);
}

export { flyingBotDefinition };
```

- [ ] **Step 4: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { createFlyingBot, randomFlyingBot, flyingBotDefinition } from "./index";

describe("flying bot catalog object", () => {
  it("has no leg slots, only body and thrusters", () => {
    const names = flyingBotDefinition.slots.map((s) => s.name);
    expect(names).toEqual(["body", "thrusterLeft", "thrusterRight"]);
  });

  it("composes with defaults", () => {
    expect(createFlyingBot().pixels.length).toBeGreaterThan(0);
  });

  it("randomFlyingBot is deterministic for a given seed", () => {
    expect(randomFlyingBot(4)).toEqual(randomFlyingBot(4));
  });
});
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/catalog/robots/flyingBot/index.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/catalog/robots/flyingBot
git commit -m "feat(catalog): add flying bot robot"
```

---

### Task 16: Uni-eyed UFO robot

**Files:**
- Create: `src/catalog/robots/ufo/parts.ts`
- Create: `src/catalog/robots/ufo/definition.ts`
- Create: `src/catalog/robots/ufo/index.ts`
- Test: `src/catalog/robots/ufo/index.test.ts`

**Interfaces:**
- Consumes: `filled`, `withPixels` from `src/catalog/_shared/gridUtils.ts`; `compose`, `registerObject`, `randomize` from core.
- Produces: `createUfo(options?)`, `randomUfo(seed?)`, `ufoDefinition`.

- [ ] **Step 1: Write `src/catalog/robots/ufo/parts.ts`**

```ts
import type { Part } from "../../../core/types";
import { filled, withPixels } from "../../_shared/gridUtils";

export const saucers: Part[] = [
  { id: "default", anchor: { x: 0, y: 0 }, grid: filled(2, 8, "saucer") },
];

export const domes: Part[] = [
  {
    id: "default",
    anchor: { x: 0, y: 0 },
    grid: withPixels(filled(2, 4, "dome"), [
      [1, 1, "eye"],
      [1, 2, "eye"],
    ]),
  },
];
```

- [ ] **Step 2: Write `src/catalog/robots/ufo/definition.ts`**

```ts
import type { ObjectDefinition } from "../../../core/types";
import { saucers, domes } from "./parts";

export const ufoDefinition: ObjectDefinition = {
  name: "ufo",
  width: 8,
  height: 4,
  slots: [
    { name: "dome", variants: domes, position: { x: 2, y: 0 } },
    { name: "saucer", variants: saucers, position: { x: 0, y: 2 } },
  ],
  defaultPalette: { saucer: "#999999", dome: "#66cccc", eye: "#ff3333" },
  allowedRegionTags: ["saucer", "dome", "eye"],
  paletteOptions: [{}, { saucer: "#5566ff" }, { dome: "#ffaa33" }],
};
```

- [ ] **Step 3: Write `src/catalog/robots/ufo/index.ts`**

```ts
import { compose } from "../../../core/composer";
import { registerObject } from "../../../core/registry";
import { randomize } from "../../../core/randomizer";
import type { Palette } from "../../../core/types";
import { ufoDefinition } from "./definition";

registerObject(ufoDefinition);

export interface CreateUfoOptions {
  parts?: Record<string, string>;
  palette?: Partial<Palette>;
}

export function createUfo(options: CreateUfoOptions = {}) {
  return compose(ufoDefinition, options.parts ?? {}, options.palette ?? {});
}

export function randomUfo(seed?: number) {
  const { choices, palette } = randomize(ufoDefinition, seed);
  return compose(ufoDefinition, choices, palette);
}

export { ufoDefinition };
```

- [ ] **Step 4: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { createUfo, randomUfo, ufoDefinition } from "./index";

describe("ufo catalog object", () => {
  it("has no limb slots, only dome and saucer", () => {
    const names = ufoDefinition.slots.map((s) => s.name);
    expect(names).toEqual(["dome", "saucer"]);
  });

  it("composes with a single eye pixel", () => {
    const ufo = createUfo();
    const eyePixels = ufo.pixels.filter((p) => p.color === ufoDefinition.defaultPalette.eye);
    expect(eyePixels.length).toBeGreaterThan(0);
  });

  it("randomUfo is deterministic for a given seed", () => {
    expect(randomUfo(6)).toEqual(randomUfo(6));
  });
});
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/catalog/robots/ufo/index.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/catalog/robots/ufo
git commit -m "feat(catalog): add uni-eyed ufo robot"
```

---

### Task 17: Primitive shapes (Cube, Oblongoid, Sphere)

**Files:**
- Create: `src/catalog/primitives/index.ts`
- Test: `src/catalog/primitives/index.test.ts`

**Interfaces:**
- Consumes: `composeShape` from `src/core/composer.ts` (Task 5), `registerShape` from `src/core/registry.ts` (Task 4), `mulberry32` from `src/core/randomizer.ts` (Task 6).
- Produces: `createCube(color?)`, `randomCube(seed?)`, `createOblongoid(color?)`, `randomOblongoid(seed?)`, `createSphere(color?)`, `randomSphere(seed?)`, `cubeDefinition`, `oblongoidDefinition`, `sphereDefinition`.

- [ ] **Step 1: Write `src/catalog/primitives/index.ts`**

```ts
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
```

- [ ] **Step 2: Write the test**

```ts
import { describe, expect, it } from "vitest";
import {
  createCube,
  randomCube,
  createOblongoid,
  createSphere,
  cubeDefinition,
  oblongoidDefinition,
  sphereDefinition,
} from "./index";

describe("primitive shapes", () => {
  it("createCube fills the full bounding box", () => {
    const cube = createCube();
    expect(cube.pixels).toHaveLength(cubeDefinition.width * cubeDefinition.height);
  });

  it("createOblongoid fills the full bounding box", () => {
    const oblongoid = createOblongoid();
    expect(oblongoid.pixels).toHaveLength(oblongoidDefinition.width * oblongoidDefinition.height);
  });

  it("createSphere masks corners out of the bounding box", () => {
    const sphere = createSphere();
    expect(sphere.pixels.length).toBeLessThan(sphereDefinition.width * sphereDefinition.height);
  });

  it("createCube accepts a color override", () => {
    const cube = createCube("#000000");
    const base = cube.pixels.find((p) => p.x === 4 && p.y === 4)!;
    expect(base.color).toBe("#000000");
  });

  it("randomCube is deterministic for a given seed", () => {
    expect(randomCube(15)).toEqual(randomCube(15));
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/catalog/primitives/index.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/catalog/primitives
git commit -m "feat(catalog): add cube, oblongoid and sphere primitives"
```

---

### Task 18: Catalog and root barrel exports

**Files:**
- Create: `src/catalog/index.ts`
- Modify: `src/index.ts` (replace Task 1 placeholder)
- Test: `src/catalog/index.test.ts`
- Test: `src/index.test.ts`

**Interfaces:**
- Consumes: every catalog module from Tasks 10-17; `src/core/index.ts` from Task 7.
- Produces: the full `8bot` and `8bot/catalog` public surfaces.

- [ ] **Step 1: Write `src/catalog/index.ts`**

```ts
export * from "./human";
export * from "./elephant";
export * from "./tree";
export * from "./robots/octopod";
export * from "./robots/tetrapod";
export * from "./robots/flyingBot";
export * from "./robots/ufo";
export * from "./primitives";
```

- [ ] **Step 2: Write `src/catalog/index.test.ts`**

```ts
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
```

- [ ] **Step 3: Replace `src/index.ts`**

```ts
export * from "./core";
export * from "./catalog";
```

- [ ] **Step 4: Write `src/index.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { createHuman, compose } from "./index";

describe("root package export", () => {
  it("re-exports core and catalog together", () => {
    expect(typeof createHuman).toBe("function");
    expect(typeof compose).toBe("function");
  });
});
```

Renderers (`drawToCanvas`, `toSvgString`) are intentionally left off the root export — they're only available via `8bot/canvas` and `8bot/svg`. This is enforced simply by `src/index.ts` (Step 3) never importing from `../canvas` or `../svg`, so no negative-export test is needed.

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/catalog/index.test.ts src/index.test.ts`
Expected: PASS

- [ ] **Step 6: Run full test suite and typecheck**

Run: `npm test && npm run typecheck`
Expected: all tests PASS, typecheck PASS.

- [ ] **Step 7: Commit**

```bash
git add src/catalog/index.ts src/catalog/index.test.ts src/index.ts src/index.test.ts
git commit -m "feat: add catalog and root barrel exports"
```

---

### Task 19: Build verification

**Files:**
- None created — this task verifies Tasks 1-18 produce a valid published artifact.

**Interfaces:**
- Consumes: the full `src/` tree from all prior tasks.
- Produces: a working `dist/` output matching the `exports` map in `package.json` (Task 1).

- [ ] **Step 1: Run the build**

Run: `npm run build`
Expected: tsup completes with no errors, producing `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`, and matching files under `dist/core/`, `dist/catalog/`, `dist/canvas/`, `dist/svg/`.

- [ ] **Step 2: Verify each subpath resolves**

Run:
```bash
node -e "const c = require('./dist/catalog/index.js'); console.log(typeof c.createHuman, typeof c.randomOctopod)"
node -e "const s = require('./dist/svg/index.js'); console.log(typeof s.toSvgString)"
```
Expected: both print `function function`.

- [ ] **Step 3: Run the full test suite one more time**

Run: `npm test`
Expected: all tests PASS (confirms the build step didn't require any source change that could have broken tests).

- [ ] **Step 4: Commit if the build step required any fixes**

If Steps 1-2 required source changes to pass, stage and commit them:
```bash
git add -A
git commit -m "fix: resolve build output issues"
```
If no changes were needed, skip this step (nothing to commit).

---

### Task 20: README

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: nothing (documentation only).
- Produces: usage documentation for consumers.

- [ ] **Step 1: Write `README.md`**

```markdown
# 8bot

A framework-agnostic library for composing 8-bit pixel objects — characters,
robots, props, and geometric primitives — for webapps, web games, or
anywhere else.

## Install

```bash
npm install 8bot
```

## Use a built-in object

```ts
import { createHuman, randomHuman } from "8bot/catalog";
import { drawToCanvas } from "8bot/canvas";

const human = createHuman({ palette: { outfit: "#ff5533" } });
const anyHuman = randomHuman(); // random parts + palette
const repeatableHuman = randomHuman(42); // same seed -> same human

const ctx = (document.getElementById("scene") as HTMLCanvasElement).getContext("2d")!;
drawToCanvas(ctx, human, { pixelSize: 8 });
```

Or render to SVG instead:

```ts
import { toSvgString } from "8bot/svg";

document.body.innerHTML = toSvgString(human, { pixelSize: 8 });
```

## Built-in catalog

| Object | Import |
|---|---|
| Human | `createHuman`, `randomHuman` |
| Elephant | `createElephant`, `randomElephant` |
| Tree | `createTree`, `randomTree` |
| Octopod robot | `createOctopod`, `randomOctopod` |
| Tetrapod robot | `createTetrapod`, `randomTetrapod` |
| Flying bot | `createFlyingBot`, `randomFlyingBot` |
| Uni-eyed UFO | `createUfo`, `randomUfo` |
| Cube / Oblongoid / Sphere | `createCube`, `createOblongoid`, `createSphere` (+ `randomX`) |

## Build a custom object

Custom objects use the same primitives the catalog is built from —
`8bot/core` is not a wrapper, it's the actual public API:

```ts
import { compose, type ObjectDefinition } from "8bot/core";

const palaceDefinition: ObjectDefinition = {
  name: "palace",
  width: 10,
  height: 10,
  slots: [
    {
      name: "wall",
      position: { x: 0, y: 0 },
      variants: [{ id: "default", anchor: { x: 0, y: 0 }, grid: [["stone"]] }],
    },
  ],
  defaultPalette: { stone: "#aaaaaa" },
  allowedRegionTags: ["stone"],
};

const palace = compose(palaceDefinition, {}, { stone: "#ffcc88" });
```

## Isometric (2.5D) rendering

The same composed object renders flat or isometric — pass `mode: "isometric"`
to either renderer; parts with a higher `layer` are drawn projected further
up and to the right:

```ts
drawToCanvas(ctx, human, { mode: "isometric", pixelSize: 8 });
```

## Contributing a new catalog object

Add a folder under `src/catalog/<name>/` with `parts.ts`, `definition.ts`,
and `index.ts` (see `src/catalog/tree/` for the smallest example), then
export it from `src/catalog/index.ts`. No core code changes needed.

## Design spec

See `docs/superpowers/specs/2026-07-25-8bot-design.md` for the full design.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add usage README"
```

---

### Task 21: Final end-to-end verification

**Files:**
- None created.

**Interfaces:**
- Consumes: the entire package from Tasks 1-20.

- [ ] **Step 1: Run the full check sequence**

Run: `npm run typecheck && npm test && npm run build`
Expected: all three PASS with zero errors.

- [ ] **Step 2: Confirm every v1 catalog object composes without throwing**

Run:
```bash
node -e "
const c = require('./dist/catalog/index.js');
for (const fn of ['createHuman','createElephant','createTree','createOctopod','createTetrapod','createFlyingBot','createUfo','createCube','createOblongoid','createSphere']) {
  const result = c[fn]();
  console.log(fn, result.pixels.length, 'pixels');
}
"
```
Expected: 10 lines print, each with a pixel count greater than 0, no errors thrown.

- [ ] **Step 3: Confirm git status is clean**

Run: `git status`
Expected: working tree clean, all task commits present in `git log`.

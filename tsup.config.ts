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
  splitting: true,
  sourcemap: true,
  clean: true,
});

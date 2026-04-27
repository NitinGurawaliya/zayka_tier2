import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/styles/feedback.css"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: "dist",
  external: ["react", "react-dom"],
});

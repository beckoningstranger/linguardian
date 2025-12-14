import { defineConfig } from "tsup";
import { resolve } from "path";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node20",
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  noExternal: [/^@linguardian\/shared/],
  esbuildOptions(options) {
    const sharedPath = resolve(__dirname, "../packages/shared/src");
    options.alias = {
      "@linguardian/shared": resolve(sharedPath, "index.ts"),
      "@linguardian/shared/contracts": resolve(sharedPath, "contracts/index.ts"),
      "@linguardian/shared/constants": resolve(sharedPath, "constants/index.ts"),
    };
  },
});

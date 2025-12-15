import { createDefaultPreset, pathsToModuleNameMapper } from "ts-jest";
import { readFileSync } from "fs";
const tsconfig = JSON.parse(readFileSync("./tsconfig.json", "utf8"));
const { compilerOptions } = tsconfig;

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  transform: {
    ...tsJestTransformCfg,
  },
};

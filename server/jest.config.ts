import { createDefaultPreset, pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

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

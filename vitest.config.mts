import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      provider: "v8",
      reportOnFailure: true,
      reporter: ["text", "json-summary"],
      thresholds: { functions: 100 },
    },
    environment: "node",
    globals: false,
    include: ["test/**/*.test.ts"],
    exclude: [...configDefaults.exclude, "**/dist/**"],
    maxWorkers: 2,
    passWithNoTests: false,
    testTimeout: 10_000,
  },
});

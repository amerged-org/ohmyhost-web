import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "public/pages/**",
      "src/generated-*.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ["site/*.js"],
    languageOptions: {
      globals: {
        location: "readonly",
        history: "readonly",
        document: "readonly",
        navigator: "readonly",
        crypto: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        matchMedia: "readonly",
        performance: "readonly",
        requestAnimationFrame: "readonly",
        IntersectionObserver: "readonly",
      },
    },
  },
  prettier,
);

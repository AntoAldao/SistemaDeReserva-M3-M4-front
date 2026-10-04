import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "cypress/screenshots/**",
      "cypress/videos/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["frontend/app.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: { ...globals.browser } },
  },
  {
    files: ["frontend/src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["frontend/src/tests/**/*.test.js"],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
  {
    files: ["cypress/**/*.cy.js"],
    languageOptions: {
      globals: { ...globals.mocha, cy: "readonly", Cypress: "readonly", expect: "readonly" },
    },
  },
  {
    files: ["*.config.js", "scripts/**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node } },
  },
  prettier,
];

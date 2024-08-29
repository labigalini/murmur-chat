module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "next/core-web-vitals",
  ],
  ignorePatterns: [
    ".eslintrc.cjs",
    "convex/_generated",
    // There are currently ESLint errors in shadcn/ui
    "components/ui",
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Only warn on unused variables, and ignore variables starting with `_`
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
  },
};

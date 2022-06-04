module.exports = {
  root: true,
  env: {
    node: true,
  },
  // extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  // extends: ["plugin:vue/vue3-essential", '@vue/typescript'],
  extends: [
    "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  parserOptions: {
    "sourceType": "module",
    "ecmaVersion": 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "comma-dangle": ["warn", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "never"
    }],
    "quotes": ["warn", "single"],

    // temporary rules
    "@typescript-eslint/no-var-requires": 1,
    "@typescript-eslint/no-empty-function": 1,
    "@typescript-eslint/ban-types": 1,
    "@typescript-eslint/no-namespace": 1,
  },
  "ignorePatterns": ["**/dist/*"],
};
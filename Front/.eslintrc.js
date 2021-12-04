module.exports = {
  root: false,
  env: {
    node: true,
  },
  // extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  // extends: ["plugin:vue/vue3-essential", '@vue/typescript'],
  extends: ['plugin:vue/vue3-essential',],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    "comma-dangle": ["warn", {
      "arrays": "always",
      "objects": "always",
      "imports": "never",
      "exports": "never",
      "functions": "never"
    }],
  },
};

const eslintPluginPrettier = require("eslint-plugin-prettier");

module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        node: true,
        commonjs: true,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
        "prettier/prettier": "warn",
        "no-console": "off",
        "no-unused-vars": "warn",
       "no-debugger": "error",
    },
  },
];

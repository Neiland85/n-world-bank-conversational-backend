const eslintPluginPrettier = require("eslint-plugin-prettier");

module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        node: true,
        commonjs: true,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
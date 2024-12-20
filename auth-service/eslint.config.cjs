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
        require: "readonly",
        module: "readonly",
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error", // Enforce Prettier formatting
      "no-console": "warn", // Allow console.log globally but warn
      "no-unused-vars": "warn", // Warn about unused variables
      "no-debugger": "error", // Prevent debugger statements in production
    },
  },
];


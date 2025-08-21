/* .eslintrc.cjs */
module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["import", "unused-imports", "prettier", "n"],
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:import/recommended",
    "plugin:n/recommended",
    "plugin:prettier/recommended", // mostra conflitos de formatação como erro
  ],
  rules: {
    // Qualidade de import
    "import/no-unresolved": "off", // evita ruído com paths e aliases
    "import/extensions": "off", // permite import sem extensão .js
    "import/prefer-default-export": "off",

    // Node plugin
    "n/no-unsupported-features/es-syntax": "off", // permite import/export
    "n/no-missing-import": "off",

    // Código comum em APIs
    "no-console": "off",
    "class-methods-use-this": "off",
    "consistent-return": "off",
    camelcase: "off", // você usa snake_case em campos do DB
    "no-param-reassign": ["error", { props: false }],

    // Unused
    "unused-imports/no-unused-imports": "error",
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],

    // Prettier como fonte da verdade de formatação
    "prettier/prettier": "error",
  },
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".cjs", ".mjs"] },
    },
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    "tmp/",
    ".tmp/",
  ],
};

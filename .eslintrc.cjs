module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  plugins: ["prettier"],

  rules: {
    "no-console": "off",
    "no-unused-vars": "warn",
    "comma-dangle": ["error", "never"],
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    camelcase: "off",
    "no-param-reassign": "off",
    "comma-dangle": "off",
    "no-dupe-keys": "off",
  },
};

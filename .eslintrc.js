const isProductionEnvironment = process.env.NODE_ENV === "production";

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  ignorePatterns: ["./build/*", "**/*.css"],
  extends: ["airbnb-base", "prettier"],
  plugins: ["svelte3"],
  overrides: [
    {
      files: ["**/*.svelte"],
      processor: "svelte3/svelte3",
      plugins: ["svelte3"]
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    semi: ["warn", "always"],
    "no-console": [isProductionEnvironment ? "error" : "off", { allow: ["warn", "error"] }],
    "linebreak-style": "off",
    "comma-dangle": ["error", "never"],
    quotes: ["error", "double"],
    "import/prefer-default-export": "off",
    "import/no-mutable-exports": "off"
  }
};

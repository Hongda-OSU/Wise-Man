// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier/flat");
const { createTypeScriptImportResolver } = require("eslint-import-resolver-typescript");

module.exports = defineConfig([
  expoConfig,
  // Turns off rules that would fight Prettier. Must stay last.
  prettierConfig,
  {
    ignores: ["ios/*", ".expo/*"],
  },
  {
    // eslint-config-expo only carries the resolver as a nested dependency, which
    // eslint-plugin-import cannot load by name from here: every @/ import came back
    // unresolved. Wiring the resolver explicitly through the flat-config API fixes it.
    settings: {
      "import/resolver-next": [createTypeScriptImportResolver()],
    },
  },
  {
    // Design tokens belong in constants/. Two colours had already drifted a digit
    // from their token by the time this rule went in, so documentation alone was
    // not holding the line.
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message: "Use a token from constants/colors.ts instead of a raw hex value.",
        },
      ],
    },
  },
]);

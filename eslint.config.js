import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react-refresh/only-export-components": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
];

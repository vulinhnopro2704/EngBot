import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["**/components/ui/**/*"]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Fix image warnings
      "@next/next/no-img-element": "off",

      // Fix unescaped quotes
      "react/no-unescaped-entities": "off",

      // Fix unused variables
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],

      // Fix any type errors
      "@typescript-eslint/no-explicit-any": "warn",

      // Fix React hooks dependencies
      "react-hooks/exhaustive-deps": "warn",

      // Fix primitive vs object types
      "@typescript-eslint/no-wrapper-object-types": "warn"
    }
  }
];

export default eslintConfig;
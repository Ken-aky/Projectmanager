// eslint.config.js  — Flat-Config für ESLint ≥ 9
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  /* 1) Globale Ignore-Liste */
  {
    ignores: [
      '.eslintrc.cjs',      // alte Classic-Config (falls du sie noch nicht gelöscht hast)
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'public/**',
    ],
  },

  /* 2) Basis-Regeln von @eslint/js */
  js.configs.recommended,

  /* 3) Projekt-spezifische Regeln + Plugins */
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',

      /* Browser-Globals, damit `sessionStorage` & Co. nicht als undefiniert gemeldet werden */
      globals: {
        window: 'readonly',
        document: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
      },
    },

    settings: { react: { version: 'detect' } },

    rules: {
      'react/prop-types': 'off',
      'unused-imports/no-unused-imports': 'error',
      // ► weitere projekt­eigene Regeln hier hinzufügen
    },
  },
];

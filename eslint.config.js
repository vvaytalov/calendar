import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';

const basePlugins = {
  react,
  'react-hooks': reactHooks,
  import: importPlugin,
  'unused-imports': unusedImports,
  prettier
};

const baseSettings = {
  react: { version: 'detect' },
  'import/resolver': {
    node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
  }
};

const baseRules = {
  ...react.configs.recommended.rules,
  ...reactHooks.configs.recommended.rules,
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
  'react-hooks/set-state-in-effect': 'off',
  'import/no-unresolved': 'error',
  'prettier/prettier': 'error',
  'unused-imports/no-unused-imports': 'error',
  'no-unused-vars': 'off',
  'unused-imports/no-unused-vars': [
    'warn',
    { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
  ]
};

export default [
  {
    ignores: ['eslint.config.js']
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: basePlugins,
    settings: baseSettings,
    rules: baseRules
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: { ...basePlugins, '@typescript-eslint': tseslint },
    settings: baseSettings,
    rules: {
      ...baseRules,
      ...tseslint.configs.recommended.rules,
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
];

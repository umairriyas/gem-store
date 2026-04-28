/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Allow 'any' type
    '@typescript-eslint/no-explicit-any': 'off',

    // Allow unescaped quotes in JSX
    'react/no-unescaped-entities': 'off',

    // Ignore unused variables
    '@typescript-eslint/no-unused-vars': 'off',
  },
};

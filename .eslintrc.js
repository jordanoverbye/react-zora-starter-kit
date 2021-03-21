module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Next.js `Link` passes the `href` prop to anchor elements
    'jsx-a11y/anchor-is-valid': 'off',
  },
  extends: ['react-app'],
};

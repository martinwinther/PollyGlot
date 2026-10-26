module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // No prop-types in this project; props are documented by the components themselves
    'react/prop-types': 'off',
  },
  overrides: [
    {
      // Server and build files run in Node, not the browser
      files: ['server.js', 'utils.js', 'vite.config.js'],
      env: { node: true, browser: false },
    },
  ],
}

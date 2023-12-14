const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  ignores: [
    'dist-electron/',
    '.output/',
    'dist/',
    'public/',
    '**/*.min.js',
    '**/*.d.ts',
  ],
  rules: {
    'no-console': 0,
  },
  languageOptions: {
    globals: {
      _: true,
    },
    ecmaVersion: 'latest',
  },
})

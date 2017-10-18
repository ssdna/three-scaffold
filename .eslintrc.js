// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  env: {
    browser: true,
  },
  globals: {
    'THREE': true
  },
  plugins: [
    'html'
  ],
  rules: {

  }
};

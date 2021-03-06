module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: [
    'build/*',
  ],
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'no-undef': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
  },
};

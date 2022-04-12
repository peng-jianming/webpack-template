module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/essential',
    'standard',
    'plugin:prettier/recommended' // https://github.com/prettier/eslint-plugin-prettier
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  plugins: ['vue'],
  rules: {
    'no-new': 0
  }
};

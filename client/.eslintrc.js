module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/strongly-recommended', 'airbnb-base', 'prettier'],
  // required to lint *.vue files
  plugins: [
    'vue',
    'prettier'
  ],
  globals: {
    'ga': true, // Google Analytics
    'cordova': true,
    '__statics': true
  },
  // add your custom rules here
  rules: {
    'vue/attribute-hyphenation': 0,
    'vue/max-attributes-per-line': [
        2,
        {
            singleline: 2,
            multiline: {
                max: 2,
                allowFirstLine: true
            }
        }
    ],
    'no-param-reassign': 0,

    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,

    'vue/no-unused-vars': 0,
    'no-unused-vars': 1,

    // "one-var": 0,
    'prefer-destructuring': 0,
    // "one-var-declaration-per-line": 0,
    // "no-bitwise": 0,
    // "arrow-parens": ["error", "as-needed"],
    // "comma-dangle": ["error", "never"],
    // "curly": ["error", "multi"],
    // "no-prototype-builtins": 0,
    "quotes": [2, "single"],
    'function-paren-newline': ['error', 'consistent'],
    'max-len': ['error', { code: 300, ignoreComments: true }],
    camelcase: 0,
    // "no-underscore-dangle": 0,
    'no-mixed-operators': 0,
    // "object-shorthand": 0,
    'linebreak-style': 0,
    'import/prefer-default-export': 0,
    indent: ['error', 4],
    'no-plusplus': 0,
    'no-loop-func': 0,
    'no-underscore-dangle': 0,
    'no-nested-ternary': 0,
    'no-restricted-syntax': 0,
    'no-continue': 0,

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
}
}

module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    '@nuxt/eslint-config',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'vue/no-unused-vars': 'off',
    indent: ['off', 2, { SwitchCase: 1 }],
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
  },
  overrides: [
    {
      files: ['**/pages/**/*.{js,ts,vue}', '**/layouts/**/*.{js,ts,vue}', '**/app.{js,ts,vue}', '**/error.{js,ts,vue}'],
      rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off'
      }
    }
  ]
}

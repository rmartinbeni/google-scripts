import globals from 'globals'
import pluginJs from '@eslint/js'
import googleappsscript from 'eslint-plugin-googleappsscript'

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...googleappsscript.environments.googleappsscript.globals,
      },
    },
  },
  pluginJs.configs.recommended,
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
    plugins: {
      googleappsscript: googleappsscript,
    },
  },
]

import configs from 'doogu/eslint.config.js'

export default [
  ...configs,
  {
    ignores: ['**/dist/']
  }
]

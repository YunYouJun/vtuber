import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['dist', '**/dist/**', 'public', '**/public/**', 'node_modules', '**/node_modules/**'],
  formatters: true,
  unocss: true,
  vue: true,
})

/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  plugins: [cacheDir()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'markedHookFrontmatter',
      formats: ['umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['marked', 'js-yaml'],
      output: { globals: { marked: 'marked', 'js-yaml': 'yaml' } }
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})

/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  plugins: [cacheDir()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'markedCodePreview',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['marked', 'attributes-parser'],
      output: {
        globals: { marked: 'marked', 'attributes-parser': 'parseAttrs' }
      }
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})

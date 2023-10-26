/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'
import umdFormatResolver from 'vite-plugin-resolve-umd-format'

export default defineConfig({
  plugins: [cacheDir(), umdFormatResolver()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'markedHookHandlebars',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['marked', 'handlebars'],
      output: {
        globals: { marked: 'marked', handlebars: 'Handlebars' }
      }
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})

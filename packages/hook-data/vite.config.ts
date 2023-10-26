/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'
import umdFormatResolver from 'vite-plugin-resolve-umd-format'

export default defineConfig({
  plugins: [cacheDir(), umdFormatResolver()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'markedHookData',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['marked', 'fast-glob', 'loadee', 'node:path'],
      output: {
        globals: {
          marked: 'marked',
          loadee: 'loadee',
          'fast-glob': 'fg',
          'node:path': 'path'
        }
      }
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})

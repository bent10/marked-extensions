/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  plugins: [cacheDir()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['marked', 'fast-glob', 'loadee', 'node:path'],
      output: {
        globals: {
          'node:path': 'path',
          marked: 'marked',
          loadee: 'loadee',
          'fast-glob': 'fg'
        }
      }
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})

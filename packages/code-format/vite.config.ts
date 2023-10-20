/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  plugins: [cacheDir()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'markedCodeFormat',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['marked', 'prettier', 'attributes-parser'],
      output: {
        globals: {
          marked: 'marked',
          prettier: 'prettier',
          'attributes-parser': 'parseAttrs'
        },
        entryFileNames: '[name].[format].js'
      }
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})
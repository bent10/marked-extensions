/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  plugins: [cacheDir()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'markedDirective',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['marked', 'attribute-parser', 'moo'],
      output: {
        globals: {
          'attribute-parser': 'parseAttrs',
          moo: 'moo'
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

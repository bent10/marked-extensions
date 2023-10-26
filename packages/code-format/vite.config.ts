/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'
import umdFormatResolver from 'vite-plugin-resolve-umd-format'

export default defineConfig({
  plugins: [cacheDir(), umdFormatResolver()],
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
        }
      }
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})

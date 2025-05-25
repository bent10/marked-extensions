/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'
import umdFormatResolver from 'vite-plugin-resolve-umd-format'

export default defineConfig(configEnv => ({
  plugins: [cacheDir(), umdFormatResolver()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'markedFootnote',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['marked']
    },
    minify: configEnv.mode !== 'development',
    sourcemap: true
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
}))

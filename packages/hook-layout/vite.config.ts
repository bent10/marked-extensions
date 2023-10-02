/// <reference types="vitest" />
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  plugins: [cacheDir()],
  ssr: {
    noExternal: ['pupa', 'escape-goat', 'moo']
  },
  build: {
    ssr: 'src/index.ts'
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})

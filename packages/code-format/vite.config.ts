/// <reference types="vitest" />
import { resolve } from 'node:path'
import { defineConfig, type BuildOptions } from 'vite'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig(({ command, ssrBuild }) => {
  const isBuildLib = command === 'build' && !ssrBuild
  const build: BuildOptions = {}

  if (isBuildLib) {
    Object.assign(build, {
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'markedCodeFormat',
        formats: ['umd'],
        fileName: 'index'
      },
      rollupOptions: {
        external: ['marked', 'prettier'],
        output: {
          globals: {
            marked: 'marked',
            prettier: 'prettier'
          }
        }
      }
    })
  }

  return {
    plugins: [cacheDir()],
    build,
    test: {
      globals: true,
      include: ['test/*.test.ts']
    }
  }
})

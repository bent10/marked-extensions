import type { PluginObj } from '@babel/core'

/**
 * Create a Babel plugin to remove all import declarations from code.
 */
export const removeImport: PluginObj = {
  name: 'babel-plugin-remove-import',
  visitor: {
    ImportDeclaration(path) {
      path.remove()
    }
  }
}

/**
 * Checks if an object is a plain JavaScript object.
 *
 * @param obj - The object to check.
 * @returns `true` if the object is a plain JavaScript object, `false`
 *   otherwise.
 */
export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

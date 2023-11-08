import { extname } from 'path'
import { loadFile, loadFileSync } from 'loadee'
import setValue from 'set-value'

declare const window: Window

/**
 * Check if it's a browser environment.
 */
export function isBrowser() {
  return (
    /* c8 ignore next 3 */
    typeof window !== 'undefined' &&
    !!window.document &&
    !!window.document.documentElement
  )
}

/**
 * Checks if all items in an array are strings.
 */
export function isSpecificSources(items: unknown[]) {
  for (const item of items) {
    if (typeof item !== 'string') {
      return false
    }
  }

  return true
}

export async function retrieveData(
  target: { [key: string]: unknown },
  markdown: string,
  merge = true
) {
  const datasources = target.datasources as string[]
  const ancestor = target.datasourcesAncestor

  for (const source of datasources) {
    const notation = source.replace(
      new RegExp(`^${ancestor}/|${extname(source)}$`, 'g'),
      ''
    )

    setValue(target, notation, await loadFile(source), {
      separator: '/',
      merge
    })
  }

  return markdown
}

export function retrieveDataSync(
  target: { [key: string]: unknown },
  markdown: string,
  merge = true
) {
  const datasources = target.datasources as string[]
  const ancestor = target.datasourcesAncestor

  for (const source of datasources) {
    const notation = source.replace(
      new RegExp(`^${ancestor}/|${extname(source)}$`, 'g'),
      ''
    )

    setValue(target, notation, loadFileSync(source), {
      separator: '/',
      merge
    })
  }

  return markdown
}

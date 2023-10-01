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

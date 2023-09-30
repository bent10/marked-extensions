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

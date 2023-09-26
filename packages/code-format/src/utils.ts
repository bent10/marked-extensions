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

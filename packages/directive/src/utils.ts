import type { DirectiveLevel } from './types.js'

/**
 * Get the regular expression pattern for matching directives based on
 * `level` and `marker`.
 */
export function getDirectivePattern(level: DirectiveLevel, marker: string) {
  switch (level) {
    case 'container':
      return `^${marker}([\\s\\S]*?)\\n${marker}`
    case 'block':
      return `^${marker}((?:[a-zA-Z][\\w-]*|[\\{\\[].*?[\\}\\]])+)`
    case 'inline':
      return `^${marker}((?:[a-zA-Z][\\w-]*|[\\{].*?[\\}]+|[\\[].*?[\\]])+)`
  }
}

/**
 * Convert the first character of a string to uppercase.
 */
export function ucFirst(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Check if a given HTML tag is a void element.
 */
export function isVoidElements(str: string) {
  return [
    'area',
    'base',
    'basefont',
    'bgsound',
    'br',
    'col',
    'command',
    'embed',
    'frame',
    'hr',
    'image',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ].includes(str)
}

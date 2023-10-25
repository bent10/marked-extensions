import parseAttrs from 'attributes-parser'
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
 * Parse attributes value and return key-value pairs.
 */
export function parseAttrsValue(str: string) {
  const classes: string[] = []

  const rawAttr = str
    .slice(1, -1)
    .replace(
      /[\.#][^\.\s]*|class=(?:\'.*\'|\".*\"|[^"\s'`=<>\x00]+)/g,
      substr => {
        if (substr.startsWith('#')) {
          return `id="${substr.slice(1)}" `
        } else if (substr.startsWith('.')) {
          classes.push(substr.slice(1))
        } else if (substr.startsWith('class=')) {
          classes.push(
            substr.replace(/^class=/, '').replace(/^['"]|['"]$/g, '')
          )
        }

        return ''
      }
    )
  const attrs = parseAttrs(rawAttr)

  // assign classes
  classes.length && (attrs.class = classes.join(' '))

  return attrs
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

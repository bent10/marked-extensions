import type { AlertVariantItem } from './types.js'

/**
 * The default configuration for alert variants.
 */
const defaultAlertVariant: AlertVariantItem[] = [
  {
    type: 'note',
    icon: '<svg class="octicon octicon-info mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
    titleClassName: 'color-fg-accent'
  },
  {
    type: 'important',
    icon: '<svg class="octicon octicon-report mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
    titleClassName: 'color-fg-done'
  },
  {
    type: 'warning',
    icon: '<svg class="octicon octicon-alert mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
    titleClassName: 'color-fg-attention'
  }
]

/**
 * Resolves the variants configuration, combining the provided variants with
 * the default variants.
 */
export function resolveVariants(variants: AlertVariantItem[]) {
  if (!variants.length) return defaultAlertVariant

  return Object.values(
    [...defaultAlertVariant, ...variants].reduce(
      (map, item) => {
        map[item.type] = item
        return map
      },
      <{ [key: string]: AlertVariantItem }>{}
    )
  )
}

/**
 * Resolve the variant title classname.
 */
export function resolveTitleClassName(type: string, classname?: string) {
  return classname
    ? ['note', 'important', 'warning'].includes(type)
      ? `${classname} text-semibold d-inline-flex flex-items-center mb-1`
      : classname
    : `text-${type} text-semibold d-inline-flex flex-items-center mb-1`
}

/**
 * Returns regex pattern to match alert syntax.
 */
export function createSyntaxPattern(type: string) {
  return `^(?:\\[\\!${type.toUpperCase()}\\]|[\\*]{2}${ucFirst(
    type
  )}[\\*]{2})[\s]*?\n?`
}

/**
 * Capitalizes the first letter of a string.
 */
export function ucFirst(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}

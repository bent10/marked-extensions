import parseAttrs from 'attributes-parser'
import type { MarkedExtension } from 'marked'
import * as prettier from 'prettier'
import { ATTR_PATTERN, EXTENDED_LANG_MAP, LANG_MAP } from './constants.js'
import { isPlainObject } from './utils.js'

/**
 * A [marked](https://marked.js.org/) extension for formatting code blocks using [Prettier](https://prettier.io/).
 */
export default function markedCodeFormat(
  options: prettier.Options = {}
): MarkedExtension {
  return {
    async: true,
    async walkTokens(token) {
      if (token.type !== 'code' || !token.lang) return

      // ```jsx prettier="{ parser: 'babel' }"
      // ```
      const { prettier: inlineOptions } = parseAttrs(token.lang)

      // required `prettier` meta:
      // ```jsx prettier
      // ```
      if (!inlineOptions) return

      const langMappings = { ...LANG_MAP, ...EXTENDED_LANG_MAP }
      const langs = Object.keys(langMappings)
      const lang = token.lang.split(' ')[0]

      if (!langs.includes(lang.toLowerCase())) return

      const configFile =
        typeof process !== 'undefined'
          ? /* c8 ignore next 2 */
            await prettier.resolveConfig(process.cwd()) // ssr
          : {} // browser

      // preserve the original code block if formatting fails
      try {
        // remove the 'preview' attribute
        token.raw = token.raw?.replace(ATTR_PATTERN, '')
        token.lang = token.lang?.replace(ATTR_PATTERN, '')

        token.text = await prettier.format(token.text, {
          parser: langMappings[String(lang) as keyof typeof langMappings],
          ...configFile,
          ...options,
          ...(isPlainObject(inlineOptions)
            ? (inlineOptions as prettier.Options)
            : {})
        })
      } catch {}
    }
  }
}

import type { MarkedExtension } from 'marked'

/**
 * Represents the options for the `markedShiki` function.
 */
export type Options = {
  /**
   * Formats and highlights the code according to a specific coding style or
   * convention.
   *
   * @param code - The code to highlight.
   * @param lang - The language of the code.
   * @param props - Additional properties for code highlighting.
   * @returns A string representing the highlighted code.
   */
  highlight?: (
    code: string,
    lang: string,
    props: string[]
  ) => string | Promise<string>

  /**
   * The container template for the highlighted code.
   *
   * @default '%s'
   */
  container?: string
}

/**
 * A [marked](https://marked.js.org/) extension for integrating [Shiki](https://shiki.style/) syntax highlighting.
 */
export default function markedShiki(options: Options = {}): MarkedExtension {
  const { highlight, container } = options

  return {
    async: true,
    async walkTokens(token) {
      if (
        token.type !== 'code' ||
        !token.lang ||
        typeof highlight !== 'function'
      )
        return

      try {
        const [lang, ...props] = token.lang.split(' ')

        const { text } = token
        const highlightedText = await highlight(text, lang, props)
        const htmlText = !container
          ? highlightedText
          : container.replace('%s', highlightedText).replace('%t', text)

        // transforms token to html
        Object.assign(token, {
          type: 'html',
          block: true,
          text: `${htmlText}\n`
        })
      } catch (e) {
        throw e
      }
    }
  }
}

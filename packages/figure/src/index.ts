import type { MarkedExtension, Tokens } from 'marked'

/**
 * A [marked](https://marked.js.org/) extension that renders an image standing
 * alone in its paragraph as a `<figure>` with its alt text as the caption.
 */
export default function markedFigure(): MarkedExtension {
  return {
    renderer: {
      paragraph({ tokens }) {
        // A `<figure>` is not allowed inside a `<p>`, so only an image alone
        // in its paragraph becomes one.
        if (tokens.length !== 1 || tokens[0].type !== 'image') return false

        const image = tokens[0] as Tokens.Image
        // The caption repeats the alt text, so screen readers skip it and
        // read the alt once.
        const caption = this.parser.parseInline(image.tokens)
        const figcaption = caption
          ? `<figcaption aria-hidden="true">${caption}</figcaption>`
          : ''

        return `<figure>${this.image(image)}${figcaption}</figure>\n`
      }
    }
  }
}

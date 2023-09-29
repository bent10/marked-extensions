import type { LoadOptions } from 'js-yaml'
import type { MarkdownHook } from 'marked-sequential-hooks'
import pupa from 'pupa'
import { parse } from './parser.js'

export interface Options extends Pick<LoadOptions, 'schema' | 'json'> {
  /**
   * The prefix to use for hooks data when adding frontmatter data. If `true`,
   * the data will be added to the `matter` property of the hooks data. If a
   * string is provided, the data will be added with that string as the key.
   */
  dataPrefix?: boolean | string
}

/**
 * A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to support frontmatter in Markdown
 * documents.
 */
export default function markedHookFrontmatter(
  options: Options = {}
): MarkdownHook {
  const { dataPrefix = false, ...parseOptions } = options

  return (markdown, data) => {
    if (data.filename) {
      Object.assign(parseOptions, { filename: data.filename })
    }

    const { matter, content } = parse(markdown, parseOptions)

    if (typeof dataPrefix === 'boolean') {
      Object.assign(data, dataPrefix ? { matter } : matter)
    } else if (typeof dataPrefix === 'string') {
      data[dataPrefix] = matter
    }

    return pupa(content, data, { ignoreMissing: true })
  }
}

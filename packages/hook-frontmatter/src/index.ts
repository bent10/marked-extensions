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

  /**
   * Set to `false` to disable data interpolation in the markdown content.
   */
  interpolation?: boolean
}

type UnknownData = {
  [key: string]: unknown
}

/**
 * A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to support frontmatter in Markdown
 * documents.
 */
export default function markedHookFrontmatter(
  options: Options = {}
): MarkdownHook {
  const { dataPrefix = false, interpolation = true, ...parseOptions } = options

  return (markdown, data) => {
    if (data.filename) {
      Object.assign(parseOptions, { filename: data.filename })
    }

    const { matter = {}, content } = parse(markdown, parseOptions)
    const { matterDataPrefix = dataPrefix } = matter as UnknownData

    if (typeof matterDataPrefix === 'boolean') {
      Object.assign(
        data,
        matterDataPrefix
          ? { matter, matterDataPrefix: 'matter' }
          : { ...(matter as UnknownData), matterDataPrefix }
      )
    } else if (typeof matterDataPrefix === 'string') {
      data.matterDataPrefix = matterDataPrefix
      data[matterDataPrefix] = matter
    }

    return interpolation
      ? pupa(content, data, { ignoreMissing: true })
      : content
  }
}

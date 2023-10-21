import ejs, { type Options } from 'ejs'
import type { HtmlHook, MarkdownHook } from 'marked-sequential-hooks'

export type { Options }

/**
 * A [sequential hook](https://github.com/bent10/marked-extensions/tree/main/packages/sequential-hooks) for marked to support [EJS](https://ejs.co) in Markdown documents.
 */
export default function markedHookEjs(
  context?: unknown,
  options?: Options
): HtmlHook | MarkdownHook {
  return (str, data, isAsync) => {
    Object.assign(data, context)
    const template = ejs.compile(str, { async: isAsync, ...options })

    return template(data)
  }
}

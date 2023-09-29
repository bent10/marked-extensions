import type { HooksWithData, HtmlHook, MarkdownHook } from './types.js'

/**
 * Execute hooks fucntions sequentially, passing the result to each
 * subsequent hook.
 */
export function reducer(
  this: HooksWithData,
  hooks: MarkdownHook[] | HtmlHook[],
  content: string
) {
  if (!this.data) this.data = {}

  return hooks.reduce((prev, transformer) => {
    return this.options?.async
      ? (Promise.all([prev, this.data]).then(([resolvedPrev, resolvedData]) =>
          transformer(resolvedPrev, resolvedData)
        ) as unknown as string)
      : (transformer(prev, this.data) as string)
  }, content)
}

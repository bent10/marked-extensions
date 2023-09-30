import type { Hooks } from 'marked'

/**
 * Represents options for configuring the `markedSequentialHooks`
 * function.
 */
export interface Options {
  /**
   * An array of functions to preprocess Markdown before parsing with
   * `marked`.
   */
  markdownHooks?: MarkdownHook[]

  /**
   * An array of functions to post-process HTML after parsing with `marked`.
   */
  htmlHooks?: HtmlHook[]
}

/**
 * Represents a Markdown hook function.
 *
 * @param markdown - The Markdown string from the prev MarkdownHook.
 * @param data - The extended Hooks data object.
 * @returns The transformed Markdown string.
 */
export type MarkdownHook = (
  markdown: string,
  data: UnknownData,
  isAsync: boolean
) => string | Promise<string>

/**
 * Represents an HTML hook function.
 *
 * @param html - The HTML string from the prev HtmlHook.
 * @param data - The extended Hooks data object.
 * @returns The transformed HTML string.
 */
export type HtmlHook = (
  html: string,
  data: UnknownData,
  isAsync: boolean
) => string | Promise<string>

/**
 * Extended Hooks interface that includes data for `marked` hooks.
 */
export interface HooksWithData extends Hooks {
  data: UnknownData
}

/**
 * Represents additional data that can be associated with `marked` hooks.
 */
export type UnknownData = { [key: string]: unknown }

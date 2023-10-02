import type { Token, TokensList } from 'marked'

/**
 * Options for configuring the markedCodePreview extension.
 */
export interface Options {
  /**
   * The code preview template to use.
   */
  template?: string

  /**
   * The transformer function for modifying code before replacing the
   * `preview` placeholder.
   *
   * @default (code) => code
   */
  transformer?: Transformer
}

/**
 * The transformer function for modifying code before replacing the
 * `preview` placeholder.
 *
 * @param code - The original code.
 * @param lang - The language of the code.
 * @param data - Hooks data and code meta.
 * @returns The transformed code.
 */
export type Transformer = (
  code: string,
  attrs: { [key: string]: unknown },
  data: { [key: string]: unknown }
) => string

/**
 * Configuration options for the transformation.
 */
export interface TransformOptions extends Options {
  index: number
  parent: Token[] | TokensList
  attrs: { [key: string]: unknown }
  data: { [key: string]: unknown }
}

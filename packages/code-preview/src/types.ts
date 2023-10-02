import type { Token, TokensList } from 'marked'

/**
 * Options for configuring the markedCodePreview extension.
 */
export interface Options {
  /**
   * The code preview template to use.
   */
  template?: string
}

/**
 * Configuration options for the transformation.
 */
export interface TransformOptions extends Options {
  index: number
  parent: Token[] | TokensList
  /**
   * Data to interpolate into template.
   */
  data: { [key: string]: unknown }
}

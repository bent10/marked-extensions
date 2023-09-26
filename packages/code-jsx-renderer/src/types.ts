/* eslint-disable @typescript-eslint/no-explicit-any */

import { Token, TokensList } from 'marked'

/**
 * Options for configuring the `remarkCodeJsxRenderer` plugin.
 */
export interface Options {
  /**
   * Components to be used for rendering JSX code.
   */
  components?: { [key: string]: React.ComponentType }

  /**
   *  Symbol to use for fragments.
   */
  Fragment?: any

  /**
   * Function to generate an element with static children in production mode.
   */
  jsx?: any

  /**
   * Function to generate an element with dynamic children in production mode.
   */
  jsxs?: any

  /**
   * A custom renderer function to render JSX code.
   *
   * @param args - Additional arguments to pass to the renderer function.
   */
  renderer?: (...args: any[]) => string

  /**
   * A sanitizer function to sanitize the code before rendering.
   *
   * @param code - The code to sanitize.
   */
  sanitizer?: (code: string) => string

  /**
   * If `true`, the plugin will not wrap the rendered code in a `codefence`
   * element.
   */
  unwrap?: boolean
}

/**
 * Configuration options for the transformation.
 */
export interface TransformOptions extends Options {
  index: number
  parent: Token[] | TokensList
}

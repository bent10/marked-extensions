import type { Attributes } from 'attributes-parser'
import type { RendererThis, Tokens } from 'marked'

/**
 * Configuration for a directive, which defines how a directive should be
 * parsed and rendered.
 */
export interface DirectiveConfig extends Omit<DirectiveMeta, 'name' | 'tag'> {
  /**
   * An optional HTML tag that the directive should be rendered as. If not
   * provided, the default tag is used based on the directive level.
   */
  tag?: string

  /**
   * A custom rendering function for the directive. This function can be used
   * to customize how the directive is rendered.
   */
  renderer?: DirectiveRenderer
}

/**
 * Meta information about a directive, providing details about its behavior and
 * rendering.
 */
export interface DirectiveMeta {
  /**
   * The level of the directive, which can be 'container', 'block', or 'inline'. This
   * determines where the directive can be used.
   */
  level: DirectiveLevel

  /**
   * The marker string that identifies the directive in the source text.
   */
  marker: string

  /**
   * The HTML tag to be used for rendering the directive.
   */
  tag: string

  /**
   * An optional name for the directive. This can be used to provide a unique name for the directive, which can be useful when rendering the directive.
   */
  name?: string
}

/**
 * Represents a directive token.
 */
export interface Directive extends Tokens.Generic {
  /**
   * Meta information about the directive.
   */
  meta: DirectiveMeta

  /**
   * The text content of the directive.
   */
  text: string

  /**
   * The attributes associated with the directive.
   */
  attrs?: Attributes
}

/**
 * Represents the level of a directive.
 */
export type DirectiveLevel = 'container' | 'block' | 'inline'

/**
 * A function that renders a directive token.
 */
export type DirectiveRenderer = (
  this: RendererThis,
  token: Directive
) => string | false | undefined

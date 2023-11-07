import { Token } from 'marked'

/**
 * Options for the `markedAlert` extension.
 */
export interface Options {
  className?: string
  variants?: AlertVariantItem[]
}

/**
 * Configuration for an alert type.
 */
export type AlertVariantItem = {
  type: string
  icon: string
  title?: string
  titleClassName?: string
}

/**
 * Represents an alert token.
 */
export type Alert = {
  type: 'alert'
  meta: {
    className: string
    variant: string
    icon: string
    title: string
    titleClassName: string
  }
  raw: string
  text: string
  tokens: Token[]
}

import type { ComponentType } from 'react'

export interface Variant {
  id: string
  name: string
  /** One line on what makes this design structurally different. */
  blurb: string
  /** Broad aesthetic family, shown in the picker. */
  mood: 'dark' | 'earthy'
  Component: ComponentType
}

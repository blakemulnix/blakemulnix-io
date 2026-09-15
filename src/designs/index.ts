import type { ComponentType } from 'react'

import { Site } from '../components/Site'
import { Atrium } from './Atrium'
import { Curtain } from './Curtain'
import { Expand } from './Expand'
import { Rail } from './Rail'
import { Stack } from './Stack'

export interface Design {
  id: string
  name: string
  /** What makes this one structurally different. */
  blurb: string
  Component: ComponentType
}

export const designs: Design[] = [
  { id: 'curtain', name: 'Curtain', blurb: 'Panel rises over the landing view', Component: Curtain },
  { id: 'atrium', name: 'Atrium', blurb: 'Fixed identity column, swapping pane', Component: Atrium },
  { id: 'expand', name: 'Expand', blurb: 'Three panels zoom to fill', Component: Expand },
  { id: 'rail', name: 'Rail', blurb: 'Big index collapses to a slim rail', Component: Rail },
  { id: 'stack', name: 'Stack', blurb: 'Fanned cards, selected one lifts', Component: Stack },
  { id: 'scroll', name: 'Scroll', blurb: 'The current live design, for comparison', Component: Site },
]

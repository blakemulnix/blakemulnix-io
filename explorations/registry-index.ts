import { BroadsheetVariant } from './Broadsheet'
import { DeckVariant } from './Deck'
import { IndexVariant } from './Index'
import { MosaicVariant } from './Mosaic'
import { RidgelineVariant } from './Ridgeline'
import type { Variant } from './registry'
import { TerminalVariant } from './Terminal'
import { TimelineVariant } from './Timeline'
import { TrailVariant } from './Trail'

export const variants: Variant[] = [
  {
    id: 'terminal',
    name: 'Terminal',
    blurb: 'Interactive shell, keyboard-driven',
    mood: 'dark',
    Component: TerminalVariant,
  },
  {
    id: 'deck',
    name: 'Deck',
    blurb: 'Full-screen horizontal panels',
    mood: 'dark',
    Component: DeckVariant,
  },
  {
    id: 'broadsheet',
    name: 'Broadsheet',
    blurb: 'Print columns on warm paper',
    mood: 'earthy',
    Component: BroadsheetVariant,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    blurb: 'Spine with year tracking scroll',
    mood: 'dark',
    Component: TimelineVariant,
  },
  {
    id: 'index',
    name: 'Index',
    blurb: 'Filterable data, command palette',
    mood: 'dark',
    Component: IndexVariant,
  },
  {
    id: 'trail',
    name: 'Trail',
    blurb: 'Topo ground, elevation profile',
    mood: 'earthy',
    Component: TrailVariant,
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    blurb: 'Bento tiles that expand in place',
    mood: 'dark',
    Component: MosaicVariant,
  },
  {
    id: 'ridgeline',
    name: 'Ridgeline',
    blurb: "Timeline's spine, Trail's palette",
    mood: 'earthy',
    Component: RidgelineVariant,
  },
]

export type { Variant } from './registry'

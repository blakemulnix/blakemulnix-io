import { yearsInCareer } from './data/about'

/**
 * One palette, with a role per colour so additions stay disciplined rather
 * than decorative.
 */
export const palette = {
  /** Neutral ground for the landing view. */
  ink: '#101512',
  /** Experience ground; also the scroll design's page colour. */
  pine: '#141d17',
  /** Primary text. */
  sand: '#e7dcc4',
  /** Body copy. */
  muted: '#c9bfa6',
  /** Global accent: years, calls to action. */
  ochre: '#d9a05b',
  /** Experience accent. */
  moss: '#93b06e',
  /** Values accent. Light enough for body text on the deep rust ground. */
  rust: '#d4795c',
  /** Outside Work accent. */
  stone: '#8fb0c0',
  /** Legible chip text on a tinted fill. */
  stoneText: '#c3d6df',
} as const

export type SectionId = 'experience' | 'values' | 'outside'

export interface Section {
  id: SectionId
  label: string
  /** Shown on the landing view under the label. */
  tagline: string
  /**
   * Page ground while this section is open. All three are dark enough to keep
   * sand text well above contrast minimums, so only the hue shifts.
   */
  bg: string
  accent: string
}

export const sections: Section[] = [
  {
    id: 'experience',
    label: 'Experience',
    tagline: `What I've been up to for ${yearsInCareer} years`,
    bg: palette.pine,
    accent: palette.moss,
  },
  {
    id: 'values',
    label: 'How I Work',
    tagline: 'What I think a team needs to excel',
    bg: '#2b1610',
    accent: palette.rust,
  },
  {
    id: 'outside',
    label: 'Outside Work',
    tagline: "Spoiler: it's mostly gravel biking",
    bg: '#1d3038',
    accent: palette.stone,
  },
]

export const sectionById = (id: SectionId): Section => {
  const found = sections.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown section: ${id}`)
  return found
}

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
  /**
   * Photographs ground. Cool and nearly colourless: it is the only section
   * whose content brings its own palette, so the ground stays out of the
   * way, and a cool grey does that in a way a warm one does not. A warm
   * ground puts an orange cast behind every photograph on it.
   */
  slate: '#141a1c',
  /**
   * Cool grey at text weight, for the labels that sit among the
   * photographs. Not a section accent: the point is to say nothing.
   */
  pewter: '#aebcc1',
} as const

export type SectionId = 'experience' | 'values' | 'outside' | 'photos'

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
  /** First path segment of the section's URL, so it can be linked to. */
  slug: string
}

export const sections: Section[] = [
  {
    id: 'experience',
    slug: 'experience',
    label: 'My Experience',
    tagline: `What I've been up to for ${yearsInCareer} years`,
    bg: palette.pine,
    accent: palette.moss,
  },
  {
    id: 'values',
    slug: 'how-i-work',
    label: 'How I Work',
    tagline: 'What I think a team needs to excel',
    bg: '#2b1610',
    accent: palette.rust,
  },
  {
    id: 'outside',
    slug: 'outside',
    label: 'Me Outside of Work',
    tagline: "Spoiler: it's mostly gravel biking",
    bg: '#1d3038',
    accent: palette.stone,
  },
  /*
   * Its own section rather than the tail of Outside Work. Sharing one meant
   * the prose and the photographs each pushed the other around, which is how
   * the collections ended up most of a screen below the fold; it also means
   * an album is now `/photos/<album>` rather than buried under an essay.
   *
   * The index numeral takes the site's green, like the first section does,
   * so the rail stays one thing. Everything inside the section is pewter
   * instead, set through `--photo-accent`: a numeral in the margin can be
   * any colour, but a label among the photographs should not tint them, and
   * the warm accent that was here first did exactly that.
   */
  {
    id: 'photos',
    slug: 'photos',
    label: 'Photographs',
    tagline: 'What I saw on the way there',
    bg: palette.slate,
    accent: palette.moss,
  },
]

export const sectionBySlug = (slug: string): Section | undefined =>
  sections.find((s) => s.slug === slug)

export const sectionById = (id: SectionId): Section => {
  const found = sections.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown section: ${id}`)
  return found
}

/** First professional role, used to derive years in the field. */
export const CAREER_START_YEAR = 2014

/** Recomputed at build time, so the figure never goes stale by hand. */
export const yearsInCareer = new Date().getFullYear() - CAREER_START_YEAR

/** A run of prose that may contain inline links. */
export type Segment = string | { text: string; href: string }

export const profile = {
  name: 'Blake Mulnix',
  role: 'Software Consultant',
  /** Under the role on the landing view. */
  tagline: 'I build software and the teams that build it.',
  /**
   * The line on the social card. It has room the page does not, and it arrives
   * with no context around it, so it can afford to be the joke.
   */
  cardTagline: 'I help teams ship faster by getting them to slow down for ten minutes.',
  location: 'Iowa',
} as const

export const aboutParagraphs: Segment[][] = [
  [
    "Hey, I'm Blake. I've been into computers since I was a youngster. If all those hours watching early YouTube and playing flight simulators taught me anything, it's that software can genuinely enrich people's lives. Today I build software for a living.",
  ],
  [
    "I'm a consultant at ",
    { text: 'Source Allies', href: 'https://www.sourceallies.com' },
    ", where I work with a crew that's unreasonably good at delivering software. We do as much coaching as coding, helping teams and organizations pick up new skills and see for themselves why the practices we live by are worth keeping.",
  ],
]

/** First professional role, used to derive years in the field. */
export const CAREER_START_YEAR = 2014

/** Recomputed at build time, so the figure never goes stale by hand. */
export const yearsInCareer = new Date().getFullYear() - CAREER_START_YEAR

/** A run of prose that may contain inline links. */
export type Segment = string | { text: string; href: string }

export const profile = {
  name: 'Blake Mulnix',
  role: 'Software Consultant',
  tagline: 'I build reliable, scalable software on the cloud.',
  location: 'Des Moines, Iowa',
} as const

export const aboutParagraphs: Segment[][] = [
  [
    "Hey, I'm Blake. I've been into computers since I was a youngster. If all those hours watching early YouTube and playing flight simulators taught me anything, it's that software can genuinely enrich people's lives. Today I build software for a living.",
  ],
  [
    "I'm a consultant at ",
    { text: 'Source Allies', href: 'https://www.sourceallies.com' },
    ", where I build software with a crew that's unreasonably good at it. We do plenty of coaching in addition to coding, helping teams and organizations pick up the practices that make delivery predictable.",
  ],
]

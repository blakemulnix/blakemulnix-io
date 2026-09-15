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
    "Hey, I'm Blake. I've been into computers since I was a youngster. If all those hours watching early YouTube and playing flight simulators taught me anything, it's that software can genuinely enrich people's lives. So today I build software for a living.",
  ],
  [
    "These days I'm a consultant at ",
    { text: 'Source Allies', href: 'https://www.sourceallies.com' },
    ', where I work on cloud applications and infrastructure with people who are unreasonably good at this. Together we help our partners build software they can stop worrying about.',
  ],
  [
    'I do plenty of coaching in addition to coding. I help teams and organizations pick up the practices that make delivery predictable: test driven development, iterations small enough to correct cheaply, cutting scope instead of moving the date, and sweet developer tooling that makes engineers smile.',
  ],
  [
    "Outside of work you'll find me on my gravel bike, road-tripping across the country, or trekking around the western United States.",
  ],
]

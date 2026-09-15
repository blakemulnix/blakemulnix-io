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
  greeting: "Hey, I'm Blake",
  location: 'Des Moines, Iowa',
} as const

export const aboutParagraphs: Segment[][] = [
  [
    "I've been into computers since I was a youngster, back in the days of dial-up internet. That early curiosity turned into a lasting appreciation for what technology can do for the people who use it. So today, I build software for a living.",
  ],
  [
    "These days I'm a consultant at ",
    { text: 'Source Allies', href: 'https://www.sourceallies.com' },
    ', where I work on cloud applications and infrastructure alongside a team of people who care a great deal about the craft. Together we help our partners ship software they can rely on.',
  ],
  [
    "Outside of work you'll find me on my gravel bike, road-tripping across the country, or trekking around the western United States.",
  ],
]

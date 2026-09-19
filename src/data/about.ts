/**
 * The landing view's copy comes from content/about.yaml (run `npm run
 * content` after editing, or just run the dev server, which watches it).
 * This file re-exports it plus the one thing that is genuinely computed
 * rather than authored.
 */
export { CAREER_START_YEAR, aboutParagraphs, profile } from './about.generated'
export type { Segment } from './about.generated'

import { CAREER_START_YEAR } from './about.generated'

/** Recomputed at build time, so the figure never goes stale by hand. */
export const yearsInCareer = new Date().getFullYear() - CAREER_START_YEAR

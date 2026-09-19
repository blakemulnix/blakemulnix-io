import { collections } from './data/collections'
import { profile } from './data/about'
import { parsePath, toPath } from './routes'
import { sectionById, sections } from './theme'

/**
 * Every address the site answers to, for the prerenderer to walk.
 *
 * Derived rather than listed: a new section or a new photo album becomes a
 * real document on the next build without anyone remembering to add it here.
 */
export const routePaths = (): string[] => [
  '/',
  ...sections.map((section) => toPath({ view: section.id, collection: null })),
  ...collections.map((collection) => toPath({ view: 'outside', collection: collection.id })),
]

export interface RouteMeta {
  title: string
  description: string
}

/**
 * The title and description for a route, so a link to an album previews as
 * that album rather than as the site's front door. Built from the same data
 * the page renders, so the two cannot disagree.
 */
export const routeMeta = (pathname: string): RouteMeta => {
  const { view, collection } = parsePath(pathname)
  const site = `${profile.name}, ${profile.role}`

  if (view === 'home') {
    return {
      title: site,
      description: `I'm a software consultant based in ${profile.location}. I build cloud and data systems, and coach teams on test driven development and sustainable delivery.`,
    }
  }

  const section = sectionById(view)
  const named = collection ? collections.find((c) => c.id === collection) : undefined

  if (named) {
    return {
      title: `${named.title}, photos by ${profile.name}`,
      description: `${named.slugs.length} photos from ${named.title}, part of ${profile.name}'s photo wall.`,
    }
  }

  return { title: `${section.label}, ${profile.name}`, description: `${section.tagline}. ${site}.` }
}

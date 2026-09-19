import { collections } from './data/collections'
import type { SectionId } from './theme'
import { sectionById, sectionBySlug } from './theme'

export type View = 'home' | SectionId

/**
 * Where the reader is, as one value.
 *
 * The site is one page that swaps its content, which used to mean there was
 * nothing to link to: a section or a photo album could be reached only by
 * clicking. This is the same state, expressed as a URL so it can be sent to
 * someone, bookmarked, and indexed.
 */
export interface Route {
  view: View
  /** Only meaningful under `photos`: the open photo collection, if any. */
  collection: string | null
}

export const HOME: Route = { view: 'home', collection: null }

/** `/how-i-work`, `/photos`, `/photos/canyon-country`, or `/`. */
export const toPath = ({ view, collection }: Route): string => {
  if (view === 'home') return '/'
  const { slug } = sectionById(view)
  return collection ? `/${slug}/${collection}` : `/${slug}`
}

/**
 * Unknown paths land on the landing view rather than a not-found page. The
 * site is small enough that the only thing a stale or mistyped link can
 * usefully do is show the way in.
 */
export const parsePath = (pathname: string): Route => {
  const [slug, second] = pathname.split('/').filter(Boolean)
  const section = slug ? sectionBySlug(slug) : undefined
  if (!section) return HOME
  const collection =
    section.id === 'photos' && collections.some((c) => c.id === second)
      ? second
      : null
  return { view: section.id, collection }
}

/*
 * A module level store rather than context, read through useSyncExternalStore.
 *
 * Two distant components care about the route, the rail and the photo
 * collections,
 * and threading it between them would mean passing it through every section's
 * props for the sake of one. The server sets it before rendering; the browser
 * takes it from the address bar.
 */
let current: Route =
  typeof window === 'undefined' ? HOME : parsePath(window.location.pathname)

const listeners = new Set<() => void>()

export const getRoute = () => current

/** For the prerenderer, which renders one document per route. */
export const setServerRoute = (pathname: string) => {
  current = parsePath(pathname)
}

export const subscribeToRoute = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const publish = (next: Route) => {
  current = next
  for (const listener of listeners) listener()
}

/** Navigates, adding a history entry so Back returns to where you were. */
export const navigate = (next: Route) => {
  const path = toPath(next)
  if (path !== window.location.pathname)
    window.history.pushState(null, '', path)
  publish(next)
}

if (typeof window !== 'undefined') {
  // The browser has already changed the URL by the time this fires, so the
  // address bar is the source of truth rather than anything saved in state.
  window.addEventListener('popstate', () =>
    publish(parsePath(window.location.pathname)),
  )
}

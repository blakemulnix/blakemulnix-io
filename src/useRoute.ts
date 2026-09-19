import { useSyncExternalStore } from 'react'

import type { Route } from './routes'
import { getRoute, subscribeToRoute } from './routes'

/**
 * The current route.
 *
 * The server snapshot is the same getter: the prerenderer sets the route
 * before rendering, so the markup for /outside/canyon-country is that album,
 * and hydration matches rather than flashing the landing view first.
 */
export const useRoute = (): Route =>
  useSyncExternalStore(subscribeToRoute, getRoute, getRoute)

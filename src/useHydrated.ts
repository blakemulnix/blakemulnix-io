import { useSyncExternalStore } from 'react'

// Nothing to subscribe to: the answer changes exactly once, at hydration,
// and React re-renders then anyway.
const noop = () => () => {}

/**
 * False while rendering on the server and through the first client render,
 * true afterwards.
 *
 * For the handful of things that cannot exist in prerendered markup at all.
 * The photo viewer is one: it renders through a portal onto `document.body`,
 * which the server has no such thing as.
 *
 * `useSyncExternalStore` rather than an effect that flips a flag, because
 * the two snapshots are exactly what it is for: React uses the server one
 * to hydrate, so the first client render is guaranteed to match the markup
 * it is adopting, and the switch costs no extra state.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

import { useCallback, useEffect } from 'react'

import type { Route, View } from '../routes'
import { HOME, navigate } from '../routes'
import type { Section } from '../theme'
import { palette, sectionById } from '../theme'
import { useRoute } from '../useRoute'

export type { View }

/**
 * Shared view state: which section is open, and the ground colour it implies.
 *
 * Backed by the URL rather than local state, so every view has an address and
 * the browser's Back button works the way the reader expects.
 */
export function useSectionView() {
  const route: Route = useRoute()
  const view = route.view

  // Escape always returns to the landing view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate(HOME)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /*
   * `instant`, not `auto`. Opening a section is a view change, and `auto`
   * defers to the CSS, which sets `scroll-behavior: smooth` for in-page
   * anchors, so this animated a long scroll back up before the new section
   * appeared. A view change should land at the top immediately.
   */
  const toTop = () => window.scrollTo({ top: 0, behavior: 'instant' })

  const open = useCallback((id: Exclude<View, 'home'>) => {
    navigate({ view: id, collection: null })
    toTop()
  }, [])

  const home = useCallback(() => {
    navigate(HOME)
    toTop()
  }, [])

  const section: Section | null = view === 'home' ? null : sectionById(view)
  const background = section?.bg ?? palette.ink

  return { view, section, background, open, home }
}

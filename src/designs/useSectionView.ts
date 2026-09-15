import { useCallback, useEffect, useState } from 'react'

import type { Section, SectionId } from '../theme'
import { palette, sectionById } from '../theme'

export type View = 'home' | SectionId

/** Shared view state: which section is open, and the ground colour it implies. */
export function useSectionView() {
  const [view, setView] = useState<View>('home')

  // Escape always returns to the landing view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('home')
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

  const open = useCallback((id: SectionId) => {
    setView(id)
    toTop()
  }, [])

  const home = useCallback(() => {
    setView('home')
    toTop()
  }, [])

  const section: Section | null = view === 'home' ? null : sectionById(view)
  const background = section?.bg ?? palette.ink

  return { view, section, background, open, home }
}

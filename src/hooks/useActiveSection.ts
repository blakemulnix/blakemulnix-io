import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in view so navigation can reflect scroll
 * position rather than only the last link clicked.
 */
export function useActiveSection(sectionIds: readonly string[], fallbackId: string): string {
  const [activeId, setActiveId] = useState(fallbackId)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (mostVisible) setActiveId(mostVisible.target.id)
      },
      // Bias the active band toward the upper half of the viewport.
      { rootMargin: '-15% 0px -55% 0px', threshold: [0.1, 0.25, 0.5, 0.75, 1] },
    )

    for (const element of elements) observer.observe(element)
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}

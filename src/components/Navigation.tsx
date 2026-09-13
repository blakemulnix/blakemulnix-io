import { useActiveSection } from '../hooks/useActiveSection'

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
] as const

// Declared once at module scope so the observer effect has a stable dependency.
const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

export const Navigation = () => {
  const activeId = useActiveSection(SECTION_IDS, 'about')

  return (
    <nav className="hidden lg:block" aria-label="In-page navigation">
      <ul className="mt-16 w-max">
        {NAV_ITEMS.map(({ id, label }) => {
          const isActive = activeId === id

          return (
            <li key={id}>
              <a href={`#${id}`} className="group flex items-center py-3" aria-current={isActive ? 'true' : undefined}>
                <span
                  className={`mr-4 h-px transition-all duration-300 ease-(--ease-out-soft) group-hover:w-16 ${
                    isActive ? 'bg-ink-50 w-16' : 'bg-ink-400 group-hover:bg-ink-100 w-8'
                  }`}
                />
                <span
                  className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                    isActive ? 'text-ink-50' : 'text-ink-300 group-hover:text-ink-100'
                  }`}
                >
                  {label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

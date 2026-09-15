import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { sectionContent } from '../sections'
import { palette, sections } from '../theme'
import { useSectionView } from './useSectionView'

/**
 * An oversized index that collapses into a slim rail once a section opens, so
 * navigation cedes its space to the content it introduced.
 *
 * Mobile is the primary case, and it is treated differently rather than
 * squeezed: the rail is not viable at phone width, so an open section hides it
 * entirely and pins a labelled back control to the top. Content then gets the
 * whole screen, and the way out is always one tap away without scrolling up.
 */
export const Rail = () => {
  const { view, section, background, open, home } = useSectionView()
  const Content = section ? sectionContent[section.id] : null
  const isHome = view === 'home'

  const currentIndex = sections.findIndex((s) => s.id === view)
  const next = currentIndex >= 0 ? sections[(currentIndex + 1) % sections.length] : undefined

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-(--ease-out-soft)"
      style={{ backgroundColor: background, color: palette.sand }}
    >
      {/* Mobile: pinned back control, standing in for the hidden rail. */}
      {section && (
        <div
          className="sticky top-0 z-30 border-b backdrop-blur-md lg:hidden"
          style={{ backgroundColor: `${background}e6`, borderColor: `${palette.sand}1f` }}
        >
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <button onClick={home} className="-mx-2 flex items-center gap-2 px-2 py-1.5 font-medium">
              <span aria-hidden="true">←</span>
              <span className="text-sm">Back</span>
            </button>
            <span
              className="truncate font-mono text-[11px] tracking-[0.2em] uppercase"
              style={{ color: section.accent }}
            >
              {section.label}
            </span>
          </div>
        </div>
      )}

      <div
        className="mx-auto grid max-w-7xl gap-8 px-5 py-10 transition-[grid-template-columns] duration-700 ease-(--ease-out-soft) sm:px-8 lg:grid-cols-[var(--nav-col)_1fr] lg:gap-12 lg:py-14"
        style={{ ['--nav-col' as string]: isHome ? '1fr' : '13rem' }}
      >
        {/* Index, becoming a rail. Hidden on phones once a section is open. */}
        <div className={section ? 'hidden lg:block' : ''}>
          {/* Desktop: a labelled way back, not just a clickable name. */}
          {!isHome && (
            <button
              onClick={home}
              className="mb-6 hidden items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase transition-opacity hover:opacity-70 lg:flex"
              style={{ color: palette.ochre }}
            >
              <span aria-hidden="true">←</span> Overview
            </button>
          )}

          <h1
            className="font-serif font-semibold tracking-tight transition-all duration-500"
            style={{ fontSize: isHome ? 'clamp(2.5rem,7vw,4.5rem)' : '1.5rem', lineHeight: 1.02 }}
          >
            {profile.name}
          </h1>
          <p
            className="mt-2 font-serif italic transition-all duration-500"
            style={{ color: palette.moss, fontSize: isHome ? '1.35rem' : '0.95rem' }}
          >
            {profile.role}
          </p>

          <div
            className="overflow-hidden transition-all duration-500"
            style={{ maxHeight: isHome ? 480 : 0, opacity: isHome ? 1 : 0 }}
          >
            <div className="mt-6 max-w-xl space-y-3 text-[15px] leading-relaxed" style={{ color: palette.muted }}>
              {aboutParagraphs.slice(0, 2).map((p, i) => (
                <p key={i}>
                  <Segments segments={p} linkClassName="underline decoration-1 underline-offset-4" />
                </p>
              ))}
            </div>
          </div>

          <nav className="mt-9 flex flex-col" aria-label="Sections">
            {sections.map((s, i) => {
              const isOpen = view === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => open(s.id)}
                  aria-current={isOpen ? 'true' : undefined}
                  className="group border-t text-left last:border-b"
                  style={{ borderColor: `${palette.sand}1a` }}
                >
                  {/* Generous vertical padding keeps the touch target comfortable. */}
                  <span className={`flex items-center justify-between gap-3 ${isHome ? 'py-5' : 'py-3'}`}>
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] tabular-nums" style={{ color: s.accent }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span
                          className="block font-serif font-semibold transition-all duration-500"
                          style={{
                            fontSize: isHome ? 'clamp(1.5rem,5vw,2.5rem)' : '1rem',
                            color: isOpen ? s.accent : palette.sand,
                          }}
                        >
                          {s.label}
                        </span>
                        {isHome && (
                          <span className="mt-0.5 block text-sm" style={{ color: `${palette.sand}8c` }}>
                            {s.tagline}
                          </span>
                        )}
                      </span>
                    </span>
                    {isHome && (
                      <span
                        className="font-mono text-lg transition-transform group-hover:translate-x-1"
                        style={{ color: s.accent }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <main>
          {section && Content && (
            <div key={view} className="animate-[rail-in_460ms_var(--ease-out-soft)_both]">
              <h2 className="font-serif text-3xl font-semibold sm:text-5xl lg:text-6xl">{section.label}</h2>
              <p className="mt-2 font-serif text-lg italic" style={{ color: `${palette.sand}a6` }}>
                {section.tagline}
              </p>
              <div className="mt-8 lg:mt-10">
                <Content accent={section.accent} />
              </div>

              {/* Somewhere to go from the bottom of long content. */}
              {next && (
                <div className="mt-14 border-t pt-6" style={{ borderColor: `${palette.sand}1f` }}>
                  <button onClick={() => open(next.id)} className="group text-left">
                    <span
                      className="font-mono text-[11px] tracking-[0.25em] uppercase"
                      style={{ color: `${palette.sand}8c` }}
                    >
                      Next
                    </span>
                    <span className="mt-1 flex items-center gap-2 font-serif text-2xl font-semibold">
                      {next.label}
                      <span
                        className="transition-transform group-hover:translate-x-1"
                        style={{ color: next.accent }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`@keyframes rail-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

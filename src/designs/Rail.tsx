import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { sectionContent } from '../sections'
import { palette, sections } from '../theme'
import { useSectionView } from './useSectionView'

/**
 * An oversized index that collapses into a slim rail once a section opens, so
 * navigation gives up its space to the content it introduced.
 */
export const Rail = () => {
  const { view, section, background, open, home } = useSectionView()
  const Content = section ? sectionContent[section.id] : null
  const isHome = view === 'home'

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-(--ease-out-soft)"
      style={{ backgroundColor: background, color: palette.sand }}
    >
      <div
        className="mx-auto grid max-w-7xl gap-8 px-6 py-14 transition-[grid-template-columns] duration-700 ease-(--ease-out-soft) sm:px-8 lg:grid-cols-[var(--nav-col)_1fr]"
        style={{ ['--nav-col' as string]: isHome ? '1fr' : '13rem' }}
      >
        {/* Index / rail */}
        <div>
          <button onClick={home} className="text-left">
            <h1
              className="font-serif font-semibold tracking-tight transition-all duration-500"
              style={{ fontSize: isHome ? 'clamp(2.75rem,7vw,4.5rem)' : '1.5rem', lineHeight: 1 }}
            >
              {profile.name}
            </h1>
          </button>
          <p
            className="mt-2 font-serif italic transition-all duration-500"
            style={{ color: palette.moss, fontSize: isHome ? '1.35rem' : '0.95rem' }}
          >
            {profile.role}
          </p>

          <div
            className="overflow-hidden transition-all duration-500"
            style={{ maxHeight: isHome ? 400 : 0, opacity: isHome ? 1 : 0 }}
          >
            <div className="mt-6 max-w-xl space-y-3 text-[15px] leading-relaxed" style={{ color: palette.muted }}>
              {aboutParagraphs.slice(0, 2).map((p, i) => (
                <p key={i}>
                  <Segments segments={p} linkClassName="underline decoration-1 underline-offset-4" />
                </p>
              ))}
            </div>
          </div>

          <nav className="mt-10 flex flex-col" aria-label="Sections">
            {sections.map((s, i) => {
              const isOpen = view === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => open(s.id)}
                  aria-current={isOpen ? 'true' : undefined}
                  className="group border-t py-4 text-left last:border-b"
                  style={{ borderColor: `${palette.sand}1a` }}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] tabular-nums" style={{ color: s.accent }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-serif font-semibold transition-all duration-500"
                      style={{
                        fontSize: isHome ? 'clamp(1.6rem,3.5vw,2.5rem)' : '1rem',
                        color: isOpen ? s.accent : palette.sand,
                      }}
                    >
                      {s.label}
                    </span>
                  </span>
                  {isHome && (
                    <span className="mt-1 block pl-7 text-sm" style={{ color: `${palette.sand}80` }}>
                      {s.tagline}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <main>
          {section && Content && (
            <div key={view} className="animate-[rail-in_520ms_var(--ease-out-soft)_both]">
              <h2 className="font-serif text-4xl font-semibold sm:text-6xl">{section.label}</h2>
              <p className="mt-2 font-serif text-lg italic" style={{ color: `${palette.sand}99` }}>
                {section.tagline}
              </p>
              <div className="mt-10">
                <Content accent={section.accent} />
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`@keyframes rail-in{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

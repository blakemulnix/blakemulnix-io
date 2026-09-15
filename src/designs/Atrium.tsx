import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { sectionContent } from '../sections'
import { palette, sections } from '../theme'
import { useSectionView } from './useSectionView'

/**
 * A permanent identity column with a pane that swaps beside it. Nothing is ever
 * navigated away from; the right-hand side simply changes what it holds.
 */
export const Atrium = () => {
  const { view, section, background, open, home } = useSectionView()
  const Content = section ? sectionContent[section.id] : null

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-(--ease-out-soft)"
      style={{ backgroundColor: background, color: palette.sand }}
    >
      <div className="mx-auto max-w-7xl lg:grid lg:min-h-screen lg:grid-cols-[22rem_1fr]">
        {/* Identity column */}
        <aside className="px-6 pt-14 pb-8 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:py-14">
          <div>
            <h1 className="font-serif text-4xl leading-[0.95] font-semibold tracking-tight sm:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-2 font-serif text-lg italic" style={{ color: palette.moss }}>
              {profile.role}
            </p>
            <div className="mt-6 space-y-3 text-sm leading-relaxed" style={{ color: palette.muted }}>
              {aboutParagraphs.slice(0, 2).map((p, i) => (
                <p key={i}>
                  <Segments segments={p} linkClassName="underline decoration-1 underline-offset-4" />
                </p>
              ))}
            </div>
          </div>

          <nav className="mt-10 flex flex-col gap-1" aria-label="Sections">
            <button
              onClick={home}
              aria-current={view === 'home' ? 'true' : undefined}
              className="w-fit font-mono text-[11px] tracking-[0.25em] uppercase transition-opacity hover:opacity-100"
              style={{ color: palette.ochre, opacity: view === 'home' ? 1 : 0.55 }}
            >
              Overview
            </button>
            {sections.map((s) => {
              const isOpen = view === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => open(s.id)}
                  aria-current={isOpen ? 'true' : undefined}
                  className="group flex w-fit items-center gap-3 py-1.5 text-left"
                >
                  <span
                    className="h-px transition-all duration-300"
                    style={{ width: isOpen ? 36 : 16, backgroundColor: isOpen ? s.accent : `${palette.sand}59` }}
                  />
                  <span
                    className="font-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
                    style={{ color: isOpen ? palette.sand : `${palette.sand}99` }}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Swapping pane. The key restarts the fade on each change. */}
        <main className="px-6 pb-20 sm:px-8 lg:py-14">
          <div key={view} className="animate-[atrium-in_520ms_var(--ease-out-soft)_both]">
            {section && Content ? (
              <>
                <h2 className="font-serif text-4xl font-semibold sm:text-6xl">{section.label}</h2>
                <p className="mt-2 font-serif text-lg italic" style={{ color: `${palette.sand}99` }}>
                  {section.tagline}
                </p>
                <div className="mt-10">
                  <Content accent={section.accent} />
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col justify-center py-10">
                <p className="max-w-lg font-serif text-2xl leading-snug sm:text-4xl">
                  Pick a thread on the left, or start with{' '}
                  <button
                    onClick={() => open('experience')}
                    className="underline decoration-2 underline-offset-4"
                    style={{ color: palette.moss }}
                  >
                    where I have worked
                  </button>
                  .
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`@keyframes atrium-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

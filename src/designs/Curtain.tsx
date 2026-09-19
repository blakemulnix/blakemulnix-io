import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { sectionContent } from '../sections'
import { palette, sections } from '../theme'
import { useSectionView } from './useSectionView'

/**
 * The landing view never leaves. Choosing a section raises a full-bleed panel
 * over it from below, so returning home feels like lowering a curtain rather
 * than navigating back.
 */
export const Curtain = () => {
  const { view, section, background, open, home } = useSectionView()
  const Content = section ? sectionContent[section.id] : null

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-(--ease-out-soft)"
      style={{ backgroundColor: background, color: palette.sand }}
    >
      {/* Landing */}
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16 sm:px-8">
        <p
          className="font-mono text-[11px] tracking-[0.35em] uppercase"
          style={{ color: palette.ochre }}
        >
          {profile.location}
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p
          className="mt-3 font-serif text-xl italic sm:text-2xl"
          style={{ color: palette.moss }}
        >
          {profile.role}
        </p>

        <div
          className="mt-7 max-w-xl space-y-3 text-[15px] leading-relaxed"
          style={{ color: palette.muted }}
        >
          {aboutParagraphs.slice(0, 2).map((p, i) => (
            <p key={i}>
              <Segments
                segments={p}
                linkClassName="underline decoration-1 underline-offset-4"
              />
            </p>
          ))}
        </div>

        <nav className="mt-12 space-y-1" aria-label="Sections">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => open(s.id)}
              className="group block w-full border-t py-5 text-left transition-colors last:border-b"
              style={{ borderColor: `${palette.sand}1f` }}
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-2xl font-semibold sm:text-3xl">
                  {s.label}
                </span>
                <span
                  className="font-mono text-lg transition-transform group-hover:translate-x-1"
                  style={{ color: s.accent }}
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
              <span
                className="mt-1 block text-sm"
                style={{ color: `${palette.sand}80` }}
              >
                {s.tagline}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Raised panel */}
      <div
        className="fixed inset-0 z-30 overflow-y-auto transition-transform duration-700 ease-(--ease-out-soft)"
        style={{
          backgroundColor: background,
          transform: view === 'home' ? 'translateY(100%)' : 'translateY(0)',
        }}
        aria-hidden={view === 'home'}
      >
        {section && Content && (
          <div>
            {/* Pinned so the way out never scrolls away on a phone. */}
            <div
              className="sticky top-0 z-10 border-b backdrop-blur-md"
              style={{
                backgroundColor: `${background}e6`,
                borderColor: `${palette.sand}1f`,
              }}
            >
              <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-3 sm:px-8">
                <button
                  onClick={home}
                  className="-mx-2 flex items-center gap-2 px-2 py-1.5 font-medium"
                >
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

            <div className="mx-auto max-w-3xl px-6 pt-10 pb-16 sm:px-8">
              <h2 className="font-serif text-4xl font-semibold sm:text-6xl">
                {section.label}
              </h2>
              <p
                className="mt-2 font-serif text-lg italic"
                style={{ color: `${palette.sand}99` }}
              >
                {section.tagline}
              </p>
              <div className="mt-10">
                <Content accent={section.accent} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

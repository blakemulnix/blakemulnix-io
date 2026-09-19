import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { sectionContent } from '../sections'
import { palette, sections } from '../theme'
import { useSectionView } from './useSectionView'

/**
 * Sections rest as a fanned stack of cards. Selecting one lifts it clear of the
 * others and flattens it into a reading surface.
 */
export const Stack = () => {
  const { view, section, background, open, home } = useSectionView()
  const Content = section ? sectionContent[section.id] : null
  const isHome = view === 'home'

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-(--ease-out-soft)"
      style={{ backgroundColor: background, color: palette.sand }}
    >
      {/* Landing */}
      <div
        className="mx-auto max-w-5xl px-6 pt-16 transition-all duration-500 sm:px-8"
        style={{
          opacity: isHome ? 1 : 0,
          pointerEvents: isHome ? 'auto' : 'none',
        }}
      >
        <h1 className="font-serif text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p
          className="mt-3 font-serif text-xl italic sm:text-2xl"
          style={{ color: palette.moss }}
        >
          {profile.role}
        </p>
        <div
          className="mt-6 max-w-xl space-y-3 text-[15px] leading-relaxed"
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

        {/* Fanned cards */}
        <div className="relative mt-14 h-72 sm:h-64">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => open(s.id)}
              className="absolute inset-x-0 flex h-44 flex-col justify-between rounded-2xl p-5 text-left transition-all duration-500 ease-(--ease-out-soft) hover:-translate-y-3"
              style={{
                backgroundColor: s.bg,
                border: `1px solid ${s.accent}59`,
                transform: `translateY(${i * 42}px) rotate(${(i - 1) * 1.1}deg)`,
                zIndex: sections.length - i,
                boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
              }}
            >
              <span
                className="font-mono text-[11px] tracking-[0.3em] uppercase"
                style={{ color: s.accent }}
              >
                {s.label}
              </span>
              <span>
                <span className="block font-serif text-xl leading-snug font-semibold sm:text-2xl">
                  {s.tagline}
                </span>
                <span
                  className="mt-2 block font-mono text-sm"
                  style={{ color: s.accent }}
                  aria-hidden="true"
                >
                  Open →
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lifted card */}
      <div
        className="fixed inset-0 z-30 overflow-y-auto transition-all duration-600 ease-(--ease-out-soft)"
        style={{
          backgroundColor: background,
          opacity: isHome ? 0 : 1,
          transform: isHome ? 'translateY(28px) scale(0.97)' : 'none',
          pointerEvents: isHome ? 'none' : 'auto',
        }}
        aria-hidden={isHome}
      >
        {section && Content && (
          <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
            <button
              onClick={home}
              className="font-mono text-[11px] tracking-[0.25em] uppercase transition-opacity hover:opacity-70"
              style={{ color: section.accent }}
            >
              ← Back to stack
            </button>
            <h2 className="mt-6 font-serif text-4xl font-semibold sm:text-6xl">
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
        )}
      </div>
    </div>
  )
}

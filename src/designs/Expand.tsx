import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { sectionContent } from '../sections'
import { palette, sections } from '../theme'
import { useSectionView } from './useSectionView'

/**
 * Three panels sit side by side and grow to fill the viewport on selection,
 * so opening a section reads as zooming into it rather than moving elsewhere.
 */
export const Expand = () => {
  const { view, section, background, open, home } = useSectionView()
  const Content = section ? sectionContent[section.id] : null

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-(--ease-out-soft)"
      style={{ backgroundColor: background, color: palette.sand }}
    >
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-20 sm:px-8">
        <header
          className={`transition-all duration-500 ${view === 'home' ? 'opacity-100' : 'pointer-events-none h-0 overflow-hidden opacity-0'}`}
        >
          <h1 className="font-serif text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-3 font-serif text-xl italic sm:text-2xl" style={{ color: palette.moss }}>
            {profile.role}
          </p>
          <div className="mt-6 max-w-xl space-y-3 text-[15px] leading-relaxed" style={{ color: palette.muted }}>
            {aboutParagraphs.slice(0, 2).map((p, i) => (
              <p key={i}>
                <Segments segments={p} linkClassName="underline decoration-1 underline-offset-4" />
              </p>
            ))}
          </div>
        </header>

        {/* Panels */}
        <div className={`grid gap-3 ${view === 'home' ? 'mt-12 sm:grid-cols-3' : 'mt-0'}`}>
          {sections.map((s) => {
            const isOpen = view === s.id
            const isHidden = view !== 'home' && !isOpen
            if (isHidden) return null

            return (
              <div
                key={s.id}
                className={
                  isOpen
                    ? 'animate-[expand-in_460ms_var(--ease-out-soft)_both]'
                    : 'transition-transform duration-300 hover:-translate-y-1'
                }
              >
                {isOpen && section && Content ? (
                  <div>
                    <button
                      onClick={home}
                      className="font-mono text-[11px] tracking-[0.25em] uppercase transition-opacity hover:opacity-70"
                      style={{ color: section.accent }}
                    >
                      ← All sections
                    </button>
                    <h2 className="mt-6 font-serif text-4xl font-semibold sm:text-6xl">{section.label}</h2>
                    <p className="mt-2 font-serif text-lg italic" style={{ color: `${palette.sand}99` }}>
                      {section.tagline}
                    </p>
                    <div className="mt-10">
                      <Content accent={section.accent} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => open(s.id)}
                    className="flex h-full min-h-56 w-full flex-col justify-between rounded-2xl p-6 text-left transition-colors"
                    style={{ backgroundColor: `${s.accent}1a`, border: `1px solid ${s.accent}40` }}
                  >
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: s.accent }}>
                      {s.label}
                    </span>
                    <span>
                      <span className="block font-serif text-2xl leading-snug font-semibold">{s.tagline}</span>
                      <span className="mt-3 block font-mono text-lg" style={{ color: s.accent }} aria-hidden="true">
                        →
                      </span>
                    </span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`@keyframes expand-in{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

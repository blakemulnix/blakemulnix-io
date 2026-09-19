import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { socialLinks } from '../data/social'
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
  const isHome = view === 'home'

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-(--ease-out-soft)"
      style={{ backgroundColor: background, color: palette.sand }}
    >
      {/* Mobile: pinned back control, standing in for the hidden rail. */}
      {section && (
        <div
          className="sticky top-0 z-30 border-b backdrop-blur-md lg:hidden"
          style={{
            backgroundColor: `${background}e6`,
            borderColor: `${palette.sand}1f`,
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <button
              onClick={home}
              className="-mx-2 flex items-center gap-2 px-2 py-1.5 font-medium"
            >
              <span aria-hidden="true">←</span>
              <span className="text-sm">Back</span>
            </button>
            <span
              className="truncate font-mono text-[0.7rem] tracking-[0.2em] uppercase"
              style={{ color: section.accent }}
            >
              {section.label}
            </span>
          </div>
        </div>
      )}

      {/*
       * `50%`, not `1fr`, for the open state of the index column.
       *
       * A track list only interpolates when each pair of tracks is the same
       * type, and `fr` does not interpolate with a length. Against `13rem` the
       * transition therefore never ran: the columns snapped to their end width
       * in one frame while the type kept shrinking for another 400ms, which is
       * the whole of the jolt. A percentage and a rem are both
       * <length-percentage>, so this pair animates.
       */}
      <div
        className="mx-auto grid max-w-7xl gap-8 px-5 py-10 transition-[grid-template-columns] duration-[600ms] ease-(--ease-out-soft) sm:px-8 lg:grid-cols-[var(--nav-col)_1fr] lg:gap-12 lg:py-14"
        style={{ ['--nav-col' as string]: isHome ? '50%' : '13rem' }}
      >
        {/* Index, becoming a rail. Hidden on phones once a section is open. */}
        <div className={section ? 'hidden lg:block' : ''}>
          {/*
           * Desktop: a labelled way back, not just a clickable name.
           *
           * Grown into place rather than mounted, for the same reason as
           * everything else here: appearing outright shoved the name and the
           * whole column down by 42px on the first frame of an otherwise
           * smooth move. `inert` because it stays in the tree while collapsed,
           * and an invisible control should not be focusable.
           */}
          <div
            className="grid transition-all duration-[600ms] ease-(--ease-out-soft)"
            style={{
              gridTemplateRows: isHome ? '0fr' : '1fr',
              opacity: isHome ? 0 : 1,
            }}
            inert={isHome}
          >
            <div className="min-h-0 overflow-hidden">
              <button
                onClick={home}
                className="hidden items-center gap-2 pb-6 font-mono text-[0.7rem] tracking-[0.25em] uppercase transition-opacity hover:opacity-70 lg:flex"
                style={{ color: palette.ochre }}
              >
                <span aria-hidden="true">←</span> Overview
              </button>
            </div>
          </div>

          <h1
            className="font-serif font-semibold tracking-tight transition-all duration-[600ms] ease-(--ease-out-soft)"
            style={{
              fontSize: isHome ? 'clamp(2.5rem,7vw,4.5rem)' : '1.5rem',
              lineHeight: 1.02,
            }}
          >
            {profile.name}
          </h1>

          {/*
           * The profiles share the role's row rather than taking one of their
           * own, so they cost no vertical space: an extra row here pushed the
           * first section link under the fold on a 720px screen. Pinned to the
           * column's right edge, they also line up with the arrows on the
           * section rows below, which keeps the column on one rhythm.
           */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p
              className="font-serif italic transition-all duration-[600ms] ease-(--ease-out-soft)"
              style={{
                color: palette.moss,
                fontSize: isHome ? '1.35rem' : '0.95rem',
              }}
            >
              {profile.role}
            </p>

            {/*
             * Collapsed along the inline axis rather than unmounted. Dropping
             * them out of the tree was a step change in the middle of a smooth
             * one, and leaving them mounted at `opacity: 0` would hold 140px
             * of a 13rem rail.
             */}
            <div
              className="grid shrink-0 transition-all duration-[600ms] ease-(--ease-out-soft)"
              style={{
                gridTemplateColumns: isHome ? '1fr' : '0fr',
                opacity: isHome ? 1 : 0,
              }}
            >
              <ul className="flex min-w-0 shrink-0 items-center gap-2 overflow-hidden sm:gap-2.5">
                {socialLinks.map(({ label, url, Icon }) => (
                  <li key={label}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 hover:border-(--hover) hover:text-(--hover) sm:h-10 sm:w-10"
                      style={{
                        borderColor: `${palette.sand}2e`,
                        color: `${palette.sand}bf`,
                        ['--hover' as string]: palette.ochre,
                      }}
                    >
                      <Icon className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/*
           * Collapsing a block of text whose height is not known needs either a
           * measured pixel value or a grid row, and the grid row wins: `1fr`
           * resolves to whatever the copy actually needs, so adding a paragraph
           * or rewrapping at a narrower width can never clip it.
           */}
          <div
            className="grid transition-all duration-[600ms] ease-(--ease-out-soft)"
            style={{
              gridTemplateRows: isHome ? '1fr' : '0fr',
              opacity: isHome ? 1 : 0,
            }}
          >
            {/*
             * Both of these are load-bearing. `min-h-0` on the clipped box,
             * because an `fr` track's automatic minimum is min-content, so
             * `0fr` would never reach zero without it. And the spacing goes on
             * a child inside that box: padding on the box itself outlives the
             * collapse, since min-height only frees the content area and the
             * padding stays behind as a gap.
             */}
            <div className="min-h-0 overflow-hidden">
              <p
                className="max-w-md pt-3 font-serif text-lg text-balance sm:text-xl"
                style={{ color: `${palette.sand}d9` }}
              >
                {profile.tagline}
              </p>
              <div
                className="max-w-xl space-y-3 pt-6 text-base leading-relaxed"
                style={{ color: palette.muted }}
              >
                {aboutParagraphs.map((p, i) => (
                  <p key={i}>
                    <Segments
                      segments={p}
                      linkClassName="underline decoration-1 underline-offset-4"
                    />
                  </p>
                ))}
              </div>
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
                  {/* Generous vertical padding keeps the touch target comfortable.
                      The padding is transitioned too: swapping the class alone
                      stepped the row height while its label was still shrinking. */}
                  <span
                    className="flex items-center justify-between gap-3 transition-[padding] duration-[600ms] ease-(--ease-out-soft)"
                    style={{ paddingBlock: isHome ? '1.25rem' : '0.75rem' }}
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        className="font-mono text-[0.7rem] tabular-nums"
                        style={{ color: s.accent }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span
                          className="block font-serif font-semibold transition-all duration-[600ms] ease-(--ease-out-soft)"
                          style={{
                            fontSize: isHome
                              ? 'clamp(1.5rem,5vw,2.5rem)'
                              : '1rem',
                            color: isOpen ? s.accent : palette.sand,
                          }}
                        >
                          {s.label}
                        </span>
                        <span
                          className="grid transition-all duration-[600ms] ease-(--ease-out-soft)"
                          style={{
                            gridTemplateRows: isHome ? '1fr' : '0fr',
                            opacity: isHome ? 1 : 0,
                          }}
                        >
                          <span className="block min-h-0 overflow-hidden">
                            <span
                              className="mt-0.5 block text-sm"
                              style={{ color: `${palette.sand}8c` }}
                            >
                              {s.tagline}
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    <span
                      className="grid transition-all duration-[600ms] ease-(--ease-out-soft)"
                      style={{
                        gridTemplateColumns: isHome ? '1fr' : '0fr',
                        opacity: isHome ? 1 : 0,
                      }}
                      aria-hidden="true"
                    >
                      <span
                        className="block min-w-0 overflow-hidden font-mono text-lg transition-transform group-hover:translate-x-1"
                        style={{ color: s.accent }}
                      >
                        →
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/*
         * Every section is rendered and the closed ones are hidden, rather
         * than mounted on open. Crawlers do not click, so gating content
         * behind a button would leave the whole site indexed as just the
         * landing blurb. Going from `hidden` to visible also restarts the
         * entrance animation on its own, since animations do not run on
         * display:none elements.
         */}
        <main>
          {sections.map((s, i) => {
            const Content = sectionContent[s.id]
            const isOpen = view === s.id
            // Undefined on the last section, which sends you home instead of
            // looping back to the first: a cycle with no end gives no signal
            // that you have seen everything.
            const next = sections[i + 1]

            return (
              <div
                key={s.id}
                hidden={!isOpen}
                aria-hidden={!isOpen}
                /*
                 * `backwards`, not `both`. With a forwards fill the final
                 * keyframe sticks, and `transform: none` computes to an
                 * identity matrix rather than `none`, which makes this element
                 * the containing block for any fixed-position descendant
                 * forever. The final keyframe matches the element's base style
                 * anyway, so dropping the forwards fill changes nothing
                 * visually.
                 */
                className="animate-[rail-in_460ms_var(--ease-out-soft)_160ms_backwards]"
              >
                <h2 className="font-serif text-3xl font-semibold sm:text-5xl lg:text-6xl">
                  {s.label}
                </h2>
                <p
                  className="mt-2 font-serif text-lg italic"
                  style={{ color: `${palette.sand}a6` }}
                >
                  {s.tagline}
                </p>
                <div className="mt-8 lg:mt-10">
                  <Content accent={s.accent} />
                </div>

                {/* Somewhere to go from the bottom of long content. */}
                <div
                  className="mt-14 border-t pt-6"
                  style={{ borderColor: `${palette.sand}1f` }}
                >
                  <button
                    onClick={() => (next ? open(next.id) : home())}
                    className="group text-left"
                  >
                    <span
                      className="font-mono text-[0.7rem] tracking-[0.25em] uppercase"
                      style={{ color: `${palette.sand}8c` }}
                    >
                      {next ? 'Next' : 'That is everything'}
                    </span>
                    <span className="mt-1 flex items-center gap-2 font-serif text-2xl font-semibold">
                      {next ? next.label : 'Back to the start'}
                      <span
                        className="transition-transform group-hover:translate-x-1"
                        style={{ color: next ? next.accent : s.accent }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </main>
      </div>

      <style>{`@keyframes rail-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

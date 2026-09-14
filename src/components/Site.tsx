import { useEffect, useRef, useState } from 'react'

import { Segments } from './Segments'
import { aboutParagraphs, profile } from '../data/about'
import { experience } from '../data/experience'
import { socialLinks } from '../data/social'

const PINE = '#141d17'
const SAND = '#e7dcc4'
const MUTED = '#c9bfa6'
const OCHRE = '#d9a05b'
const MOSS = '#93b06e'

/**
 * The site: a scroll-tracked spine over a topographic ground, where the year
 * readout follows whichever role is currently in view.
 *
 * On small screens the sticky sidebar is replaced by a compact bar pinned to
 * the top, so the position feedback survives the loss of the side column.
 */
export const Site = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const i = itemRefs.current.indexOf(visible.target as HTMLLIElement)
        if (i >= 0) setActiveIndex(i)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    )
    for (const el of itemRefs.current) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const active = experience[activeIndex]
  const activeYear = active?.start.split(' ')[1] ?? ''

  return (
    <div className="relative min-h-screen overflow-hidden pb-28" style={{ backgroundColor: PINE, color: SAND }}>
      {/* Contour ground, carried over from Trail. Decorative only. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.11]"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d={`M -50 ${110 + i * 82} C 260 ${30 + i * 78}, 580 ${250 + i * 74}, 1500 ${80 + i * 84}`}
            fill="none"
            stroke={MOSS}
            strokeWidth="1.25"
          />
        ))}
      </svg>

      {/* Compact position readout for narrow screens */}
      <div
        className="sticky top-0 z-20 border-b backdrop-blur-md lg:hidden"
        style={{ backgroundColor: `${PINE}e6`, borderColor: `${SAND}1f` }}
      >
        <div className="mx-auto flex max-w-6xl items-baseline gap-3 px-5 py-2.5">
          <span className="font-serif text-xl font-semibold tabular-nums" style={{ color: OCHRE }}>
            {activeYear}
          </span>
          <span className="truncate text-sm" style={{ color: MUTED }}>
            {active?.company}
          </span>
          <span className="ml-auto shrink-0 font-mono text-[11px]" style={{ color: `${SAND}66` }}>
            {activeIndex + 1}/{experience.length}
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <header className="pt-14 pb-12 sm:pt-20">
          <p className="font-mono text-[11px] tracking-[0.35em] uppercase" style={{ color: OCHRE }}>
            {profile.location}
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-3 font-serif text-xl italic sm:text-2xl" style={{ color: MOSS }}>
            {profile.role}
          </p>

          <div className="mt-8 max-w-2xl space-y-4 text-[15px] leading-relaxed sm:text-base">
            <p className="font-serif text-2xl">{profile.greeting}.</p>
            {aboutParagraphs.map((p, i) => (
              <p key={i} style={{ color: MUTED }}>
                <Segments
                  segments={p}
                  linkClassName="font-medium underline decoration-[#d9a05b]/50 underline-offset-4 hover:decoration-[#d9a05b]"
                />
              </p>
            ))}
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
          {/* Sticky readout of the role currently in view */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: `${SAND}66` }}>
                Currently viewing
              </p>
              <p
                className="mt-2 font-serif text-6xl leading-none font-semibold tabular-nums transition-colors"
                style={{ color: OCHRE }}
              >
                {activeYear}
              </p>
              <p className="mt-2 font-serif text-lg italic" style={{ color: MOSS }}>
                {active?.company}
              </p>
              <div className="mt-6 h-px w-12" style={{ backgroundColor: OCHRE }} />
              <p className="mt-3 font-mono text-[11px]" style={{ color: `${SAND}66` }}>
                {activeIndex + 1} / {experience.length}
              </p>
            </div>
          </div>

          {/*
            Alignment: --spine is the one x-axis, measured from the list's left
            edge. The connector and every dot are positioned at that axis and
            centred on it with a translate, so they cannot drift apart at any
            breakpoint. --node-y matches the date line's 16px leading, which
            puts each dot on the optical centre of that line.
          */}
          <ol className="relative pl-[var(--pad)] [--node-y:8px] [--pad:1.75rem] [--spine:9px] sm:[--pad:2.5rem]">
            {experience.map((e, i) => {
              const isActive = i === activeIndex
              const isLast = i === experience.length - 1
              const axis = 'calc(var(--spine) - var(--pad))'

              return (
                <li
                  key={`${e.company}-${e.start}`}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  className="relative pb-12 last:pb-0"
                >
                  {/*
                    The connector spans exactly one item's height starting at
                    this dot's centre, so it lands on the next dot's centre and
                    stops at the last one instead of trailing past it.
                  */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute top-[var(--node-y)] h-full w-px"
                      style={{
                        left: axis,
                        transform: 'translateX(-50%)',
                        backgroundImage: `repeating-linear-gradient(to bottom, ${MOSS}66 0 5px, transparent 5px 10px)`,
                      }}
                    />
                  )}

                  <span
                    aria-hidden="true"
                    className="absolute top-[var(--node-y)] flex h-4 w-4 items-center justify-center rounded-full transition-all"
                    style={{
                      left: axis,
                      // Scale lives in the same transform as the centring
                      // offsets; a separate transform would override them.
                      transform: `translate(-50%, -50%) scale(${isActive ? 1.3 : 1})`,
                      backgroundColor: PINE,
                      border: `2px solid ${isActive ? OCHRE : `${MOSS}88`}`,
                      boxShadow: isActive ? `0 0 14px ${OCHRE}80` : 'none',
                    }}
                  >
                    <span
                      className="h-1 w-1 rounded-full transition-colors"
                      style={{ backgroundColor: isActive ? OCHRE : `${MOSS}88` }}
                    />
                  </span>

                  <p
                    className="font-mono text-[11px] leading-4 tracking-widest uppercase"
                    style={{ color: `${SAND}aa` }}
                  >
                    {e.start} — {e.end ?? 'Present'}
                  </p>
                  <h3 className="mt-1.5 font-serif text-2xl font-semibold">{e.title}</h3>
                  <a
                    href={e.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-serif text-lg italic underline decoration-1 underline-offset-4 transition-colors"
                    style={{ color: isActive ? OCHRE : MOSS }}
                  >
                    {e.company}
                  </a>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed" style={{ color: MUTED }}>
                    {e.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {e.technologies.map((t) => (
                      <li
                        key={t}
                        className="rounded-full px-2.5 py-0.5 font-mono text-[11px]"
                        style={{ border: `1px solid ${SAND}22`, color: `${SAND}99` }}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>

        <footer
          className="mt-4 flex flex-wrap items-center justify-between gap-5 border-t pt-8"
          style={{ borderColor: `${SAND}22` }}
        >
          <ul className="flex gap-5">
            {socialLinks.map(({ label, url, Icon }) => (
              <li key={label}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:opacity-70"
                  style={{ color: MOSS }}
                >
                  <span className="sr-only">{label}</span>
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { experience } from '../data/experience'
import { socialLinks } from '../data/social'

const ACCENT = '#a8e831'

/**
 * The career as the page's primary structure: one continuous spine, with a
 * large year readout that tracks whichever role is currently in view.
 */
export const TimelineVariant = () => {
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

  return (
    <div className="min-h-screen bg-[#0a0b09] pb-28 text-neutral-300">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="pt-16 pb-12 sm:pt-24">
          <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-white sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg text-neutral-400 sm:text-xl">
            {profile.role} · <span className="text-neutral-500">{profile.location}</span>
          </p>
          <div className="mt-8 max-w-2xl space-y-4 text-[15px] leading-relaxed sm:text-base">
            <p className="text-white">{profile.greeting} 👋</p>
            {aboutParagraphs.map((p, i) => (
              <p key={i}>
                <Segments
                  segments={p}
                  linkClassName="text-[#a8e831] underline decoration-[#a8e831]/40 underline-offset-4 hover:decoration-[#a8e831]"
                />
              </p>
            ))}
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10">
          {/* Sticky readout of the role in view */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <p className="font-mono text-[11px] tracking-[0.3em] text-neutral-600 uppercase">Currently viewing</p>
              <p
                className="font-display mt-2 text-5xl font-bold tabular-nums transition-colors"
                style={{ color: ACCENT }}
              >
                {active?.start.split(' ')[1] ?? ''}
              </p>
              <p className="mt-1 text-sm text-neutral-400">{active?.company}</p>
              <div className="mt-6 h-px w-12" style={{ backgroundColor: ACCENT }} />
              <p className="mt-3 text-xs text-neutral-600">
                {activeIndex + 1} / {experience.length}
              </p>
            </div>
          </div>

          <ol className="relative pl-[var(--pad)] [--node-y:8px] [--pad:1.5rem] [--spine:9px] sm:[--pad:2.5rem]">
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
                  {/* Connector spans one item, so it ends on the next dot. */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute top-[var(--node-y)] h-full w-px bg-white/10"
                      style={{ left: axis, transform: 'translateX(-50%)' }}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute top-[var(--node-y)] h-2.5 w-2.5 rounded-full ring-4 ring-[#0a0b09] transition-all"
                    style={{
                      left: axis,
                      transform: `translate(-50%, -50%) scale(${isActive ? 1.35 : 1})`,
                      backgroundColor: isActive ? ACCENT : '#3f3f46',
                      boxShadow: isActive ? `0 0 16px ${ACCENT}` : 'none',
                    }}
                  />
                  <p className="font-mono text-[11px] leading-4 tracking-widest text-neutral-400 uppercase">
                    {e.start} — {e.end ?? 'Present'}
                  </p>
                  <h3 className="font-display mt-2 text-xl font-semibold text-white sm:text-2xl">{e.title}</h3>
                  <a
                    href={e.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block underline decoration-white/25 underline-offset-4 transition hover:decoration-[#a8e831]"
                    style={{ color: isActive ? ACCENT : undefined }}
                  >
                    {e.company}
                  </a>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-400">{e.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {e.technologies.map((t) => (
                      <li
                        key={t}
                        className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-neutral-400"
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

        <footer className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
          <ul className="flex gap-5">
            {socialLinks.map(({ label, url, Icon }) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noreferrer" className="text-neutral-500 transition hover:text-white">
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

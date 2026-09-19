import { useEffect, useRef, useState } from 'react'

import { experience } from '../data/experience'
import { palette } from '../theme'

/**
 * The career as a scroll-tracked spine. The year readout is sticky within this
 * section only, so it scrolls away once the section ends rather than following
 * the reader into later content.
 */
export const ExperienceSpine = () => {
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
    <section id="experience" className="scroll-mt-8 pt-4">
      <h2
        className="font-mono text-[11px] tracking-[0.3em] uppercase"
        style={{ color: palette.ochre }}
      >
        Experience
      </h2>

      <div className="mt-8 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
        <div className="hidden lg:block">
          <div className="sticky top-16">
            <p
              className="font-mono text-[11px] tracking-[0.3em] uppercase"
              style={{ color: `${palette.sand}66` }}
            >
              Currently viewing
            </p>
            <p
              className="mt-2 font-serif text-6xl leading-none font-semibold tabular-nums transition-colors"
              style={{ color: palette.ochre }}
            >
              {active?.start.split(' ')[1] ?? ''}
            </p>
            <p
              className="mt-2 font-serif text-lg italic"
              style={{ color: palette.moss }}
            >
              {active?.company}
            </p>
            <div
              className="mt-6 h-px w-12"
              style={{ backgroundColor: palette.ochre }}
            />
            <p
              className="mt-3 font-mono text-[11px]"
              style={{ color: `${palette.sand}66` }}
            >
              {activeIndex + 1} / {experience.length}
            </p>
          </div>
        </div>

        {/*
          --spine is the single x-axis: the connector and every dot are placed
          on it and centred with a translate, so they cannot drift apart at any
          breakpoint. --node-y matches the date line's 16px leading.
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
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute top-[var(--node-y)] h-full w-px"
                    style={{
                      left: axis,
                      transform: 'translateX(-50%)',
                      backgroundImage: `repeating-linear-gradient(to bottom, ${palette.moss}66 0 5px, transparent 5px 10px)`,
                    }}
                  />
                )}

                <span
                  aria-hidden="true"
                  className="absolute top-[var(--node-y)] flex h-4 w-4 items-center justify-center rounded-full transition-all"
                  style={{
                    left: axis,
                    transform: `translate(-50%, -50%) scale(${isActive ? 1.3 : 1})`,
                    backgroundColor: palette.pine,
                    border: `2px solid ${isActive ? palette.ochre : `${palette.moss}88`}`,
                    boxShadow: isActive
                      ? `0 0 14px ${palette.ochre}80`
                      : 'none',
                  }}
                >
                  <span
                    className="h-1 w-1 rounded-full transition-colors"
                    style={{
                      backgroundColor: isActive
                        ? palette.ochre
                        : `${palette.moss}88`,
                    }}
                  />
                </span>

                <p
                  className="font-mono text-[11px] leading-4 tracking-widest uppercase"
                  style={{ color: `${palette.sand}aa` }}
                >
                  {e.start} - {e.end ?? 'Present'}
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-semibold">
                  {e.title}
                </h3>
                <a
                  href={e.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-serif text-lg italic underline decoration-1 underline-offset-4 transition-colors"
                  style={{ color: isActive ? palette.ochre : palette.moss }}
                >
                  {e.company}
                </a>
                <p
                  className="mt-3 max-w-2xl text-[15px] leading-relaxed"
                  style={{ color: palette.muted }}
                >
                  {e.summary}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {e.technologies.map((t) => (
                    <li
                      key={t}
                      className="rounded-full px-2.5 py-1 font-mono text-[11px]"
                      style={{
                        backgroundColor: `${palette.stone}2e`,
                        color: palette.stoneText,
                      }}
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
    </section>
  )
}

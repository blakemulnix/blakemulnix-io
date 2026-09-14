import { useEffect, useRef, useState } from 'react'

import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { experience } from '../data/experience'
import { socialLinks } from '../data/social'

const ACCENT = '#c5fa47'

/**
 * A horizontal deck. Each panel fills the viewport and snaps into place, so the
 * career reads as a sequence of slides rather than one long scroll.
 */
export const DeckVariant = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const panels = ['intro', 'about', ...experience.map((e) => e.company), 'contact']

  const goTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(panels.length - 1, i))
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => setActive(Math.round(track.scrollLeft / track.clientWidth))
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(active + 1)
      if (e.key === 'ArrowLeft') goTo(active - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const panelClass = 'flex h-full w-screen shrink-0 snap-center flex-col justify-center px-6 sm:px-16 lg:px-28'

  return (
    <div className="relative h-screen overflow-hidden bg-[#0b0c0b] text-neutral-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${ACCENT}44, transparent 70%)` }}
      />

      <div
        ref={trackRef}
        className="flex h-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
      >
        {/* Intro */}
        <section className={panelClass} aria-label="Introduction">
          <p className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: ACCENT }}>
            {profile.location}
          </p>
          <h1 className="font-display mt-4 text-5xl leading-[0.95] font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-neutral-400 sm:text-2xl">
            {profile.role}. {profile.tagline}
          </p>
          <p className="mt-10 flex items-center gap-2 font-mono text-xs text-neutral-500">
            <span aria-hidden="true">→</span> swipe, or use the arrow keys
          </p>
        </section>

        {/* About */}
        <section className={panelClass} aria-label="About">
          <h2 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">About</h2>
          <p className="font-display mt-6 text-2xl text-white sm:text-4xl">{profile.greeting}.</p>
          <div className="mt-6 max-w-2xl space-y-4 text-neutral-400">
            {aboutParagraphs.map((p, i) => (
              <p key={i}>
                <Segments
                  segments={p}
                  linkClassName="text-white underline decoration-[#c5fa47] decoration-2 underline-offset-4"
                />
              </p>
            ))}
          </div>
        </section>

        {/* One panel per role */}
        {experience.map((e, i) => (
          <section className={panelClass} key={`${e.company}-${e.start}`} aria-label={`${e.title} at ${e.company}`}>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-6xl leading-none font-bold text-white/10 tabular-nums sm:text-8xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                {e.start} — {e.end ?? 'Present'}
              </span>
            </div>
            <h2 className="font-display mt-6 text-3xl font-semibold text-white sm:text-5xl">{e.title}</h2>
            <a
              href={e.companyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-fit text-lg underline decoration-2 underline-offset-4 sm:text-xl"
              style={{ color: ACCENT }}
            >
              {e.company}
            </a>
            <p className="mt-5 max-w-2xl text-neutral-400">{e.summary}</p>
            <ul className="mt-6 flex max-w-2xl flex-wrap gap-2">
              {e.technologies.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-neutral-300"
                >
                  {t}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Contact */}
        <section className={panelClass} aria-label="Contact">
          <h2 className="font-display text-4xl font-semibold text-white sm:text-6xl">Let&apos;s talk.</h2>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={profile.resumeUrl}
              className="w-fit rounded-full px-6 py-3 font-semibold text-neutral-900 transition hover:brightness-110"
              style={{ backgroundColor: ACCENT }}
            >
              View resume
            </a>
            <div className="flex gap-5">
              {socialLinks.map(({ label, url, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 transition hover:text-white"
                >
                  <span className="sr-only">{label}</span>
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Position rail */}
      <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center sm:bottom-24">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-2 ring-1 ring-white/10 backdrop-blur">
          <button
            onClick={() => goTo(active - 1)}
            aria-label="Previous panel"
            className="px-1.5 text-neutral-400 hover:text-white"
          >
            ←
          </button>
          {panels.map((p, i) => (
            <button
              key={p + i}
              onClick={() => goTo(i)}
              aria-label={`Go to panel ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === active ? 22 : 6,
                backgroundColor: i === active ? ACCENT : 'rgba(255,255,255,0.28)',
              }}
            />
          ))}
          <button
            onClick={() => goTo(active + 1)}
            aria-label="Next panel"
            className="px-1.5 text-neutral-400 hover:text-white"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

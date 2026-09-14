import { useEffect, useMemo, useState } from 'react'

import { Segments } from '../components/Segments'
import { aboutParagraphs, profile } from '../data/about'
import { experience } from '../data/experience'
import { socialLinks } from '../data/social'

const ACCENT = '#bef264'
const allTech = [...new Set(experience.flatMap((e) => e.technologies))].sort()

/**
 * The resume as a queryable dataset: type to filter, or narrow by stack. A
 * command palette handles navigation, so the page needs no nav bar at all.
 */
export const IndexVariant = () => {
  const [query, setQuery] = useState('')
  const [tech, setTech] = useState<string | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return experience.filter((e) => {
      const matchesTech = !tech || e.technologies.includes(tech)
      const haystack = `${e.title} ${e.company} ${e.summary} ${e.technologies.join(' ')}`.toLowerCase()
      return matchesTech && (!q || haystack.includes(q))
    })
  }, [query, tech])

  return (
    <div className="min-h-screen bg-[#0c0d0c] pb-28 font-mono text-neutral-300">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pt-14 pb-6 sm:pt-20">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {profile.role} — {profile.location}
            </p>
          </div>
          <button
            onClick={() => setPaletteOpen(true)}
            className="rounded-md border border-white/15 px-3 py-2 text-xs text-neutral-400 transition hover:border-white/30 hover:text-white"
          >
            Search <kbd className="ml-1.5 text-neutral-500">⌘K</kbd>
          </button>
        </header>

        <section className="border-b border-white/10 py-8 font-sans" aria-label="About">
          <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed">
            <p className="text-white">{profile.greeting} 👋</p>
            {aboutParagraphs.map((p, i) => (
              <p key={i} className="text-neutral-400">
                <Segments segments={p} linkClassName="text-[#bef264] underline decoration-dotted underline-offset-4" />
              </p>
            ))}
          </div>
        </section>

        {/* Query controls */}
        <div className="sticky top-0 z-10 -mx-5 bg-[#0c0d0c]/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <label htmlFor="filter" className="sr-only">
            Filter roles
          </label>
          <input
            id="filter"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter roles, companies, technologies…"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#bef264]/60 focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setTech(null)}
              className="rounded px-2 py-1 text-[11px] transition"
              style={{
                backgroundColor: tech === null ? ACCENT : 'transparent',
                color: tech === null ? '#0c0d0c' : '#a1a1aa',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              all
            </button>
            {allTech.map((t) => (
              <button
                key={t}
                onClick={() => setTech(tech === t ? null : t)}
                className="rounded border border-white/10 px-2 py-1 text-[11px] transition hover:border-white/30 hover:text-white"
                style={{
                  backgroundColor: tech === t ? ACCENT : 'transparent',
                  color: tech === t ? '#0c0d0c' : '#a1a1aa',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dense register */}
        <p className="py-3 text-[11px] text-neutral-600">
          {rows.length} of {experience.length} roles
          {tech ? ` · ${tech}` : ''}
        </p>

        <ol>
          {rows.map((e) => (
            <li
              key={`${e.company}-${e.start}`}
              className="group grid gap-1 border-b border-white/[0.07] py-4 transition-colors hover:bg-white/[0.02] sm:grid-cols-[9.5rem_1fr] sm:gap-6"
            >
              <p className="text-[11px] tracking-wide text-neutral-400 tabular-nums">
                {e.start.replace(/^\w+ /, '')}–{e.end ? e.end.replace(/^\w+ /, '') : 'now'}
              </p>
              <div>
                <h3 className="font-sans text-base font-semibold text-white">
                  {e.title} <span className="text-neutral-500">·</span>{' '}
                  <a
                    href={e.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-white/20 underline-offset-4 group-hover:decoration-[#bef264]"
                    style={{ color: ACCENT }}
                  >
                    {e.company}
                  </a>
                </h3>
                <p className="mt-1.5 max-w-2xl font-sans text-sm leading-relaxed text-neutral-400">{e.summary}</p>
                <p className="mt-2 text-[11px] text-neutral-500">{e.technologies.join(' / ')}</p>
              </div>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="py-10 text-center text-sm text-neutral-500">
              No roles match.{' '}
              <button
                onClick={() => {
                  setQuery('')
                  setTech(null)
                }}
                className="underline"
                style={{ color: ACCENT }}
              >
                Reset
              </button>
            </li>
          )}
        </ol>

        <footer className="flex flex-wrap items-center gap-6 pt-8">
          <a href={profile.resumeUrl} className="text-sm underline underline-offset-4" style={{ color: ACCENT }}>
            resume.pdf
          </a>
          {socialLinks.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-neutral-500 hover:text-white"
            >
              {label.toLowerCase()}
            </a>
          ))}
        </footer>
      </div>

      {/* Command palette */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-sm"
          onClick={() => setPaletteOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-[#141514] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to filter, Esc to close…"
              className="w-full border-b border-white/10 bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
            />
            <ul className="max-h-72 overflow-y-auto py-2">
              {rows.map((e) => (
                <li key={`${e.company}-${e.start}`}>
                  <a
                    href={e.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-baseline justify-between gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
                  >
                    <span className="text-white">{e.company}</span>
                    <span className="shrink-0 text-[11px] text-neutral-500">{e.title}</span>
                  </a>
                </li>
              ))}
              <li className="mt-1 border-t border-white/10 pt-1">
                <a
                  href={profile.resumeUrl}
                  className="block px-4 py-2.5 text-sm hover:bg-white/5"
                  style={{ color: ACCENT }}
                >
                  Open resume →
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
